import * as path from "path";
import {ParsedPath} from "path";

import {Meta} from "./MetaHelper";
import {PolicyHelper} from "./PolicyHelper";
import {NonInstrPolicyHelper} from "./NonInstrPolicyHelper";
import {ProxyConstants} from "./ProxyConstants";
import {toSemmleFormat, toSemmleFormatLibraryTest} from "./toSemmleFormat";

const callsites = require('callsites');

//@ts-ignore
global.helper = PolicyHelper;

//@ts-ignore
const Module = require("module");
const oldRequire = Module.prototype.require;
const fs = require("fs");
const cp = require("child_process");
const vm = require("vm");
const isBuiltinModule = require('is-builtin-module');
const libraryName = process.env.LIBRARY_UNDER_TEST;
const MAX_TAINTS_PER_OBJECT = 10;
const MAX_PROXIES_PER_OBJECT = 5;
const INSTRUMENT_TRANSITIVE_DEPS = true;
let instrumentedTransitiveDeps: string[] = [];
console.log("library module name " + libraryName);
let mainModuleFile: string = undefined;

// Notice, LIBRARY_ROOT_PATH serves both as a flag and as a path.
// It's set whenever we're running a test suite of the library itself.
// In that case, the value it has is the root path to the library itself.
// If it's set then we fetch the main field from package.json since we need it
// correctly compute the root action in access paths.
if (process.env.LIBRARY_ROOT_PATH) {
  const pkgJson = JSON.parse(fs.readFileSync(
      path.resolve(process.env.LIBRARY_ROOT_PATH, "package.json")));
  if (pkgJson) {
    mainModuleFile = path.resolve(process.env.LIBRARY_ROOT_PATH, pkgJson.main);
  }
}

//@ts-ignore
Module.prototype.require = function(moduleQueryString) {
  if (isBuiltinModule(moduleQueryString))
    return oldRequire.apply(this, arguments);
  if (moduleQueryString && typeof moduleQueryString === 'string') {
    if (moduleQueryString === "mongodb") {
      let toReturn = oldRequire.apply(this, arguments);
      markMongoSinks(toReturn);
      return toReturn;
    }
    try {
      // This part of the code attempts to resolve the path of the module being
      // loaded. The idea is that if we can resolve this path, then we can
      // better determine if we want to proxy the module or not compared to just
      // looking at the moduleQueryString. E.g., if we just look at the module
      // query string, then we will struggle to capture observations for the
      // library's own tests since they tend to load the library by doing
      // something like require('..') etc.

      const cs = callsites();
      const callerFileName = cs[2].getFileName();
      let resolvedLibraryPath;
      // If the module starts with '.', then it's a relative path, so we resolve
      // it relative to the callerFileModule.
      // I haven't found a way to make require.resolve do this for us. It seems
      // like require.resolve always resolves relative to this file, i.e.,
      // relative to DefaultPolicy.js.
      //@ts-ignore
      if (moduleQueryString.startsWith('.')) {
        resolvedLibraryPath =
            path.resolve(path.dirname(callerFileName), moduleQueryString);
      } else {
        let pathsObj = {paths : this.paths};
        resolvedLibraryPath =
            require.resolve.call(module, moduleQueryString, pathsObj);
      }
      arguments[0] = resolvedLibraryPath;

      // Set to the root location of the library, if it's the library's OWN test
      // suite that is running. For that case, we need a slightly different
      // mechanism for deciding when to instrument a module.
      if (process.env.LIBRARY_ROOT_PATH) {
        // Resloved module is in the library path and the resolved module does
        // not contain a node_modules. Notice, the library path itself will
        // never contain a node_modules, so this is a sensible way to ensure
        // that we are not instrumenting submodules of the library itself.
        const isLibrarySubModule =
            resolvedLibraryPath.startsWith(process.env.LIBRARY_ROOT_PATH) &&
            !resolvedLibraryPath.includes("node_modules");

        if (isLibrarySubModule) {
          console.log(`Instrumenting ${
              moduleQueryString} require from resolvedLibraryPath ${
              resolvedLibraryPath} as main entry to library`);
          return wrapInProxy(
              oldRequire.apply(this, arguments),
              toSemmleFormatLibraryTest(resolvedLibraryPath,
                                        process.env.LIBRARY_ROOT_PATH,
                                        mainModuleFile, libraryName),
            true);
        }
      } else {
        if (INSTRUMENT_TRANSITIVE_DEPS) {
          const callerModule =
            callerFileName.includes('node_modules')
              ? callerFileName.substring(
              callerFileName.lastIndexOf('node_modules'))
                .replace("node_modules/", "")
                .replace(/\/.*/, "")
              : "main-module";
          const targetModule =
            resolvedLibraryPath.includes('node_modules')
              ? resolvedLibraryPath.substring(
              resolvedLibraryPath.lastIndexOf("node_modules"))
                .replace("node_modules/", "")
                .replace(/\/.*/, "")
              : resolvedLibraryPath;
          if (callerModule !== targetModule &&
            (targetModule === libraryName ||
              instrumentedTransitiveDeps.indexOf(callerModule) != -1)) {
            if (instrumentedTransitiveDeps.indexOf(targetModule) === -1)
              instrumentedTransitiveDeps.push(targetModule);
            console.log("========= Instrumenting module " + targetModule +
              ", called from " + callerModule + " =========");
            return wrapInProxy(oldRequire.apply(this, arguments),
              toSemmleFormat(moduleQueryString,
                resolvedLibraryPath, libraryName),
              true);
          } else {
            // console.log("========= Skipped " + targetModule +
            //   " called from " + callerModule + " =========");
            // console.log(resolvedLibraryPath);
          }
        } else {
          const callerModule =
            callerFileName.includes('node_modules')
              ? callerFileName.substring(
              callerFileName.lastIndexOf('node_modules'))
              : false;

          // true if the require call happens inside the library itself. This
          // indicates loading of private API, so we shouldn't proxify the module.
          const isInternalLibraryModule =
            callerModule && callerModule.split('/').includes(libraryName);

          // Get whatever is after the last node_modules.
          const lastNodeModulesPostFix =
            resolvedLibraryPath.includes('node_modules')
              ? resolvedLibraryPath.substring(
              resolvedLibraryPath.lastIndexOf("node_modules"))
              : resolvedLibraryPath;

          /**
           * if the lastNodeModules actually contains a node_modules (not the case
           * for library files that are included in the client), then we make sure
           * that the next folder in the path is the actual library to instrument.
           * Otherwise, we risk that we instrument a file that is in the
           * wrong library, but named the same as the right library (typically the
           * right library included in another library).
           */
          const isInstrumentingLibrary =
            lastNodeModulesPostFix.startsWith("node_modules/")
              ? (lastNodeModulesPostFix.substring("node_modules/".length)
                .startsWith(libraryName +
                  "/")  // Must have the / in the end
              // such that we don't instrument
              // other libraries that have
              // libraryName as a prefix.

              ||
              lastNodeModulesPostFix.endsWith(`node_modules/${
                libraryName}`))  // Alternatively, it must be the
                                   // end of the path, but only if it's
                                   // immediately after the node_modules.
              : lastNodeModulesPostFix.split('/').includes(libraryName);

          if (!isInternalLibraryModule && isInstrumentingLibrary) {
            console.log(`Instrumenting ${
              moduleQueryString} require from resolvedLibraryPath ${
              resolvedLibraryPath}`);
            return wrapInProxy(oldRequire.apply(this, arguments),
              toSemmleFormat(moduleQueryString,
                resolvedLibraryPath, libraryName),
              true);
          } else if (lastNodeModulesPostFix.includes(libraryName)) {
            console.log(`skipping instrument of ${resolvedLibraryPath}`);
          }
        }
      }
    } catch (e) {
      console.error(`Error: Resolving location of moduleQueryString ${
          moduleQueryString}. Falling back to standard require - Error ${e}`);
    }
  }
  return oldRequire.apply(this, arguments);
};

/* Sinks corresponding to CommandInjection.qll */
PolicyHelper.addSink(cp.exec, "exec", "CommandInjection", [ true ]);
PolicyHelper.addSink(cp.execSync, "execSync", "CommandInjection", [ true ]);
PolicyHelper.addSink(cp.spawn, "spawn", "CommandInjection", [
  true,
  function(args) {
    return args[0] == "/bin/sh" || args[0] == "/bin/bash" || args[0] == "sh" ||
           args[0] == "bash" || args[0] == "cmd" || args[0] == "cmd.exe";
  }
]);
PolicyHelper.addSink(cp.spawnSync, "spawnSync", "CommandInjection", [
  true,
  function(args) {
    return args[0] == "/bin/sh" || args[0] == "/bin/bash" || args[0] == "sh" ||
           args[0] == "bash" || args[0] == "cmd" || args[0] == "cmd.exe";
  }
]);
PolicyHelper.addSink(cp.execFile, "execFile", "CommandInjection", [ true ]);
PolicyHelper.addSink(cp.execFileSync, "execFileSync", "CommandInjection",
                     [ true ]);
// fork is not really compatible with NodeProf
// PolicyHelper.addSink(cp.fork, "fork",
//   "CommandInjection");

/* Sinks corresponding to CodeInjection.qll */
PolicyHelper.addSink(eval, "eval", "CodeInjection", [ true ]);
PolicyHelper.addSink(vm.runInThisContext, "vm.runInThisContext",
                     "CodeInjection", [ true ]);
PolicyHelper.addSink(vm.runInNewContext, "vm.runInNewContext", "CodeInjection",
                     [ true ]);
PolicyHelper.addSink(Function, "Function.prototype.constructor",
                     "CodeInjection", [ true ]);
// PolicyHelper.addSink(WebAssembly.compile, "WebAssembly.compile",
// "CodeInjection");

/* Sinks corresponding to TaintedPath.qll */
PolicyHelper.addSink(fs.rmdir, "fs.rmdir", "TaintedPath", [ true ]);
PolicyHelper.addSink(fs.rmdirSync, "fs.rmdirSync", "TaintedPath", [ true ]);
PolicyHelper.addSink(fs.appendFile, "fs.appendFile", "TaintedPath", [ true ]);
PolicyHelper.addSink(fs.appendFileSync, "fs.appendFileSync", "TaintedPath",
                     [ true ]);
PolicyHelper.addSink(fs.write, "fs.write", "TaintedPath", [ true ]);
PolicyHelper.addSink(fs.writeSync, "fs.writeSync", "TaintedPath", [ true ]);
PolicyHelper.addSink(fs.writeFile, "fs.writeFile", "TaintedPath", [ true ]);
PolicyHelper.addSink(fs.writeFileSync, "fs.writeFileSync", "TaintedPath",
                     [ true ]);
PolicyHelper.addSink(require, "require", "TaintedPath", [ true ]);
PolicyHelper.addSink(fs.read, "fs.read", "TaintedPath", [ true ]);
PolicyHelper.addSink(fs.readSync, "fs.readSync", "TaintedPath", [ true ]);
PolicyHelper.addSink(fs.readFile, "fs.readFile", "TaintedPath", [ true ]);
PolicyHelper.addSink(fs.readFileSync, "fs.readFileSync", "TaintedPath",
                     [ true ]);

/* Sinks corresponding to RegExpInjection.qll */
PolicyHelper.addSink(RegExp, "RegExp.prototype.constructor", "RegExpInjection",
                     [ true ]);
PolicyHelper.addSink(String.prototype.match, "String.prototype.match",
                     "RegExpInjection",
                     [ function(args) { return args.length === 1; } ]);
PolicyHelper.addSink(String.prototype.search, "String.prototype.search",
                     "RegExpInjection",
                     [ function(args) { return args.length === 1; } ]);

/* Sinks corresponding to NoSQL.qll */
function markMongoSinks(mongodb: any) {
  try {
    PolicyHelper.addSink(mongodb.Collection.prototype.aggregate,
                         "mongodb.Collection.prototype.aggregate", "NoSQL",
                         [ true ]);
    PolicyHelper.addSink(mongodb.Collection.prototype.count,
                         "mongodb.Collection.prototype.count", "NoSQL",
                         [ true ]);
    PolicyHelper.addSink(mongodb.Collection.prototype.deleteMany,
                         "mongodb.Collection.prototype.deleteMany", "NoSQL",
                         [ true ]);
    PolicyHelper.addSink(mongodb.Collection.prototype.deleteOne,
                         "mongodb.Collection.prototype.deleteOne", "NoSQL",
                         [ true ]);
    PolicyHelper.addSink(mongodb.Collection.prototype.distinct,
                         "mongodb.Collection.prototype.distinct", "NoSQL",
                         [ false, true ]);
    PolicyHelper.addSink(mongodb.Collection.prototype.find,
                         "mongodb.Collection.prototype.find", "NoSQL",
                         [ true ]);
    PolicyHelper.addSink(mongodb.Collection.prototype.findOne,
                         "mongodb.Collection.prototype.findOne", "NoSQL",
                         [ true ]);
    PolicyHelper.addSink(mongodb.Collection.prototype.findOneAndDelete,
                         "mongodb.Collection.prototype.findOneAndDelete",
                         "NoSQL", [ true ]);
    PolicyHelper.addSink(mongodb.Collection.prototype.findOneAndRemove,
                         "mongodb.Collection.prototype.findOneAndRemove",
                         "NoSQL", [ true ]);
    PolicyHelper.addSink(mongodb.Collection.prototype.findOneAndUpdate,
                         "mongodb.Collection.prototype.findOneAndUpdate",
                         "NoSQL", [ true ]);
    PolicyHelper.addSink(mongodb.Collection.prototype.remove,
                         "mongodb.Collection.prototype.remove", "NoSQL",
                         [ true ]);
    PolicyHelper.addSink(mongodb.Collection.prototype.replaceOne,
                         "mongodb.Collection.prototype.replaceOne", "NoSQL",
                         [ true ]);
    PolicyHelper.addSink(mongodb.Collection.prototype.update,
                         "mongodb.Collection.prototype.update", "NoSQL",
                         [ true ]);
    PolicyHelper.addSink(mongodb.Collection.prototype.updateMany,
                         "mongodb.Collection.prototype.updateMany", "NoSQL",
                         [ true ]);
    PolicyHelper.addSink(mongodb.Collection.prototype.updateOne,
                         "mongodb.Collection.prototype.updateOne", "NoSQL",
                         [ true ]);
  } catch (e) {
    // mongodb not available in this project, so no sinks are marked
  }
}

function wrapInProxy(obj: any, accessPath: string, isEntry: boolean): any {
  console.log(`Wrapping ${accessPath}`);
  if (typeof obj === "function") {
    if (NonInstrPolicyHelper.isNonNativeFunction(obj)) {
      return wrapSingle(obj, accessPath, isEntry, obj);
    } else {
      return obj;
    }
  }
  let res = wrapSingle(obj, accessPath, isEntry);
  return res;
}

function wrapSingleGet(obj: {[index: string]: any}, accessPath: string,
                       isEntry: boolean): any {
  //@Do not change ES version (NodeProf does not support >ES5)
  //@ts-ignore
  return new Proxy(obj, {
    //@Do not modify this into a switch
    get : function(target: {[index: string]: any}, prop: PropertyKey) {
      if (prop === ProxyConstants.accessPath) return accessPath;
      if (prop === ProxyConstants.interfaceMethod) return true;
      if (prop === ProxyConstants.actualObj) return obj;
      if (prop === ProxyConstants.isProxy) return true;
      if (prop === ProxyConstants.isEntryPoint) return isEntry;
      //@ts-ignore
      return target[prop];
    }
  });
}


let wrapSingleCache: {[key: string]: {obj: any, proxy: any}} = {};

function wrapSingle(obj: {[index: string]: any}, accessPath: string,
                    isEntry: boolean, diffTarget?: any): any {
  if (wrapSingleCache[accessPath]
    && wrapSingleCache[accessPath].obj === obj)
    return wrapSingleCache[accessPath].proxy;
  let objType = typeof obj;
  if (!obj || objType != "object" && objType != "function")
    return obj;
  //@ts-ignore
  if (obj && obj[ProxyConstants.isProxy])
  //@ts-ignore
    obj = obj[ProxyConstants.actualObj];
  //@Do not change ES version (NodeProf does not support >ES5)
  let noTaintsPerObject = 0;
  let noSpawnedProxies = 0;
  //@ts-ignore
  let res = new Proxy(obj, {

    get : function(target: {[index: string]: any}, prop: PropertyKey): any {
      //@Do not modify this into a switch
      if (prop === ProxyConstants.accessPath)
        return accessPath;
      if (prop === ProxyConstants.interfaceMethod)
        return true;
      if (prop === ProxyConstants.actualObj)
        return obj;
      if (prop === ProxyConstants.isProxy)
        return true;
      if (prop === ProxyConstants.isEntryPoint)
        return isEntry;
      if (prop === ProxyConstants.isExpired)
        return noSpawnedProxies >= MAX_PROXIES_PER_OBJECT;

      if (noSpawnedProxies > MAX_PROXIES_PER_OBJECT)
        //@ts-ignore
        return target[prop];

      if (NonInstrPolicyHelper.isNotTrapped(prop))
        //@ts-ignore
        return target[prop];

      // function methods are called
      target = diffTarget || target;
      if (typeof prop === "string") {
        let ap;
        //@ts-ignore
        if (target[ProxyConstants.dynComputed]
          //@ts-ignore
          && target[ProxyConstants.dynComputed][prop])
          ap = `(member * ${accessPath})`;
        else
          ap = `(member ${prop} ${accessPath})`;
        let newLabel = PolicyHelper.addLabelIfNotExists(ap);
        noSpawnedProxies++;
        //@ts-ignore
        let res = wrapInProxy(target[prop], ap, isEntry);
        if (!isEntry && noTaintsPerObject < MAX_TAINTS_PER_OBJECT)
          res = PolicyHelper.source(res, newLabel, ap);
        return res;
      } else {
        let ap;
        //@ts-ignore
        if (target[ProxyConstants.dynComputed]
          //@ts-ignore
          && target[ProxyConstants.dynComputed][prop])
          ap = `(member * ${accessPath})`;
        else
          ap = `(member ${prop.toString()} ${accessPath})`;
        let newLabel = PolicyHelper.addLabelIfNotExists(ap);
        noSpawnedProxies++;
        //@ts-ignore
        let res = wrapInProxy(target[prop], ap, isEntry);
        if (!isEntry  && noTaintsPerObject < MAX_TAINTS_PER_OBJECT)
          res = PolicyHelper.source(res, newLabel, ap);
        return res;
      }
    },

    apply : function(target: {[index: string]: any}, thisArg: any,
                     argumentsList: any) {
      console.log(`Called ${accessPath}[${argumentsList.length}]`);
      let newAP = `(return ${accessPath})`;
      let args = argumentsList;
      if (noTaintsPerObject < MAX_TAINTS_PER_OBJECT) {
        noTaintsPerObject += argumentsList.length;
        if (isEntry)
          args = markArgsAsSourcesAndWrap(accessPath, argumentsList, isEntry);
        else
          args = wrapArgs(accessPath, argumentsList, isEntry);
      }
      let wrappedFunction = target;
      //@ts-ignore
      if (!target[ProxyConstants.isProxy]
        // && NonInstrPolicyHelper.isNonNativeFunction(target)
      )
        wrapSingleGet(target, accessPath, isEntry);
      let res;
      res = wrappedFunction.apply(thisArg, args);

      return wrapSingle(res, newAP, isEntry);
    },

    construct : function(target: any, argArray: any) {
      console.log(`Called constructor ${accessPath}`);
      let args = argArray;
      if (noTaintsPerObject < MAX_TAINTS_PER_OBJECT) {
        noTaintsPerObject += argArray.length;
        args = markArgsAsSourcesAndWrap(accessPath, argArray, isEntry);
      }

      let newAP = `(instance ${accessPath})`;
      let wrappedFunction = target;
      wrapSingleGet(target, accessPath, isEntry);

      return wrapSingle(new wrappedFunction(...args), newAP, isEntry);
      // return Reflect.construct(target, args);
    }

  });
  wrapSingleCache[accessPath] = {obj: obj, proxy: res}
  return res;
}

function markArgsAsSourcesAndWrap(basePath: string, args: IArguments,
                                  isEntry: boolean) {
  let argsRes = [];
  for (let i = 0; i < args.length; i++) {
    let ap: string = `(parameter ${i} ${basePath})`;
    let newLabel = PolicyHelper.addLabelIfNotExists(ap);
    argsRes[i] = PolicyHelper.source(args[i], newLabel, ap);
    argsRes[i] = wrapInProxy(argsRes[i], ap, !isEntry);
  }
  return argsRes;
}

function wrapArgs(basePath: string, args: [],
                                  isEntry: boolean) {
  let argsRes = [];
  for (let i = 0; i < args.length; i++) {
    let ap: string = `(parameter ${i} ${basePath})`;
    argsRes[i] = wrapInProxy(args[i], ap, !isEntry);
  }
  return argsRes;
}