import * as fs from "fs";

import {iid, Jalangi, JalangiAnalysis} from "../types/Jalangi";

import {Label, LabelOps} from "./Labels";
import {Meta} from "./MetaHelper";
import {ProxyConstants} from "./ProxyConstants";
import {ShadowArray, ShadowedArray} from "./ShadowArray";
import {SMemory} from "./SMemory";
import {CodeAnalyzer} from "./SourceCodeAnalyzer.js";
import {Propagation, Sink, TaintModel} from "./TaintModel";
import {ViolationMessenger} from "./ViolationMessenger";

import _ = require("lodash");
// for whatever reason TS fails to find this on my machine;
declare var require: any;
const PRINT_HOOKS = false;
const PRINT_LOC = false;
const PRINT_ARGS_STACK = false;
const PRINT_TAINT_STACK = false;
const PRINT_STACK_MISSES = false;
const STACK_ELEMENTS_TO_PRINT = 5;
const TAINTED_KEYS_GENERIC_MEMBERS = true;

/**
 * Copyright 2018 Software Lab, TU Darmstadt, Germany
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to
 * deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 *
 * Created by Cristian-Alexandru Staicu on 22.11.18.
 *
 * This file is the main part of AintNodeTaint, a lightweight taint engine
 * for Node.js built using NodeProf.
 */

class TaintStack {
  public stack: {taint: Taint, depth: number}[] = [];

  public stackMisses = 0;

  // Counts the number of elements popped from the stack.
  public stackTotal = 0;

  private fctDepth = 0;

  constructor(private violator: ViolationMessenger) {}

  functionEnter() {
    this.fctDepth++;
  }

  functionExit() {
    let lastElement;
    while (this.stack.length > 0) {
      lastElement = this.stack[this.stack.length - 1];
      if (lastElement.depth >= this.fctDepth)
        this.stack.pop();
      else {
        break;
      }
    }
    this.fctDepth--;
  }

  length(): number {
    return this.stack.length;
  }

  isTop(val: any): boolean {
    return this.stack[this.stack.length - 1] === val;
  }

  push(val: Taint, doPrint: boolean = true) {
    this.stack.push({taint: val, depth: this.fctDepth});
    doPrint && this.printStack();
  };

  peek(): Taint {
    if (this.stack.length > 0)
      return this.stack[this.stack.length - 1].taint;
  }

  pop(expected: any, operation: string, iid: number): Taint|undefined {
    this.stackTotal++;
    if (this.stack.length == 0) {
      this.stackMisses++;
      PRINT_STACK_MISSES && this.violator.reportStackMiss(
        expected, "empty stack", operation, iid);
      PRINT_STACK_MISSES && this.printStack();
      return;
    }
    let entry = this.stack.pop().taint;

    if (!entry) {
      this.stackMisses++;
      PRINT_STACK_MISSES && this.violator.reportStackMiss(
        expected, "undefined entry", operation, iid);
    }
    if (entry &&
      (typeof entry.val != typeof expected || entry.val != expected)) {
      this.stackMisses++;
      PRINT_STACK_MISSES &&
      this.violator.reportStackMiss(expected, entry.val, operation, iid);
    }
    PRINT_STACK_MISSES && this.printStack();
    return entry;
  }

  popUntilFound(expected: any, operation: string, iid: number): Taint
    |undefined {
    if (this.stack.length == 0) {
      this.stackMisses++;
      this.violator.reportStackMiss(expected, "empty stack", operation, iid);
      this.printStack();
      return;
    }
    let entry;
    do {
      this.stackTotal++;
      entry = this.stack.pop().taint;
    } while (
      this.stack.length > 0 &&
      !((!entry && !expected) ||
        (entry &&
          (typeof entry.val == typeof expected &&
            entry.val == expected))));  // TODO double check if we want this

    // Fixme: Replace with library equality check, e.g., lodash equals.
    if (!entry || typeof entry.val != typeof expected ||
      entry.val != expected) {
      this.stackMisses++;
      if (entry)
        this.violator.reportStackMiss(expected, entry.val, operation, iid);
    }
    this.printStack();
    return entry;
  }

  private printStack() {
    if (PRINT_TAINT_STACK) {
      const topElements = _.takeRight(this.stack, STACK_ELEMENTS_TO_PRINT);
      console.log(`TAINT-STACK (${this.stack.length}):\t` +
        _.join(_.map(topElements, (e) => `(${
            _.isObjectLike(e.taint.val) ||
            _.isFunction(e.taint.val) ||
            _.isSymbol(e.taint.val)
              ? "object/function/string"
              : e.taint.val}, ${
            (e.taint.taint === undefined)
              ? "undefined"
              : e.taint.taint.toString()})`),
          " - "))
    }
  }
}

interface ArgsStackEntry {
  val: Taint[], func: Taint, base: Taint, async: boolean
}

class ArgsStack {
  private stack: ArgsStackEntry[] = [];

  push(val: Taint[], func: Taint, base: Taint, async: boolean) {
    this.stack.push({val : val, func : func, base : base, async : async});
    this.printStack();
  };

  length(): number{return this.stack.length}

  pop(): ArgsStackEntry|undefined {
    const popped = this.stack.pop();
    this.printStack();
    return popped;
  }

  private printStack() {
    if (PRINT_ARGS_STACK) {
      const topElements = _.takeRight(this.stack, STACK_ELEMENTS_TO_PRINT);
      console.log(
        "ARGS_STACK" +
        _.join(_.map(topElements, (e) => `${e.val.toString()}, ${e.async}`),
          " - "));
    }
  }

  peek(): Taint[]|undefined {
    let last = this.stack[this.stack.length - 1];
    if (last) return last.val;
  }

  isLastAsync(): boolean {
    let last = this.stack[this.stack.length - 1];
    if (last) return last.async;
  }
}

declare var J$: Jalangi;

class SinkPointer {
  constructor(public id: string, public queryID: string,
              public argSpecs: (boolean|((args: any[]) => boolean))[]) {}
}

class SourcePointer {
  constructor(public fct: any, label: any, source: any) {}
}

interface Sinks {
  [index: string]: SinkPointer
}

class Taint {
  constructor(public val: any, public taint: Label, public baseTaint?: Label) {}
}

function printHookObject(hook: string, obj: any) {
  if (PRINT_LOC && obj.iid) {
    obj.loc = J$.iidToLocation(J$.getGlobalIID(obj.iid));
  }
  console.log(`HOOK(${hook}) - ${JSON.stringify(obj)}`);
}

function isNativeFunction(f: Function) {
  return f.toString().indexOf("[native code]") != -1 ||
    //@ts-ignore
    (f[ProxyConstants.actualObj] &&
      //@ts-ignore
      f[ProxyConstants.actualObj].toString().indexOf("[native code]") !=
      -1);
}

class AintNodeTaint implements JalangiAnalysis {
  private Labels = require("./Labels.js");
  private metaHelper: Meta = new Meta(Label.LOW_LEVEL);
  private policyHelper = require("./PolicyHelper.js").PolicyHelper;
  private smemory = new SMemory();
  private codeAnalyzer = new CodeAnalyzer();
  private forinMapping: {[index: number]: any} = {};
  private functionDepth = 0;

  private policySources: SourcePointer[] = [];
  private policySinks: Sinks = {};

  // We need this field even with //DO NOT INSTRUMENT since we sometimes call
  // library code, e.g., calls to lodash
  public enableHooks = true;

  /**
   * Is set to true whenever we enter a library function, and false whenever we
   * leave the function
   */
  private isInsideLibraryCode = 0;

  /**
   * This stack contains the taint value of the currently read variables. That
   * is, after each read we push on the stack the value and the associated
   * taint. Other hooks consume the values from the stack and hence they receive
   * the taint values of objects and primitives.
   */

  private argsStack = new ArgsStack();

  private analysisResults: TaintModel = new TaintModel();

  private invMessenger =
    new ViolationMessenger(J$, this.analysisResults, PRINT_STACK_MISSES);

  private taintStack = new TaintStack(this.invMessenger);

  private taintArgs: Taint[];

  popIfFound(object: any, context: string, iid: number): Taint {
    let top = this.taintStack.peek();
    let isEqual: boolean = false;
    try {
      isEqual = top && (typeof top.val == typeof object) && top.val == object;
      if (isEqual) return this.taintStack.pop(object, context, iid);
      return null;
    } catch (e) {
      return null;
    }
  }

  /**
   * This callback is called before a function, method, or constructor
   *invocation.
   **/
  invokeFunPre(iid: iid, f: Function, base: object, args: any[],
               isConstructor: boolean, isMethod: boolean, functionIid: iid,
               functionSid: iid):
    {f: Function, base: object, args: any[], skip: boolean} {
    // We're entering a library function
    if (f && (f as any)[ProxyConstants.isProxy]) {
      this.isInsideLibraryCode++;
    }

    if ((this.isInsideLibraryCode && this.enableHooks) ||
      //@ts-ignore
      (base === this.policyHelper)) {
      this.enableHooks = false;
      if (PRINT_HOOKS) {
        printHookObject("invokeFunPre", {
          iid : iid,
          //@ts-ignore
          fName : f.name,
          isConstructor : isConstructor,
          isMethod : isMethod,
          functionIid : functionIid,
          functionSid : functionSid
        });
      }
      // Standard Jalangi hack, to make it look like the function was called
      // directly when using call and apply.
      if (f == Function.prototype.call) {
        let newBase = args[0];

        // rearrange taint stack accordingly
        let taintArgs: Taint[] = [];
        if (args.length > 1) {
          for (let i = args.length - 1; i >= 1; i--) {
            taintArgs.push(
              //@ts-ignore
              this.taintStack.pop(args[i], `invoke ${f.name}`, iid));
          }
        }
        //@ts-ignore
        let taintBase = this.taintStack.pop(args[0], `invoke ${f.name}`, iid);
        //@ts-ignore
        this.taintStack.pop(f, `invoke ${f.name}`, iid);
        this.taintStack.push(taintBase);
        this.taintStack.push({val : base, taint : Label.LOW_LEVEL});
        for (let i = taintArgs.length - 1; i >= 0; i--)
          this.taintStack.push(taintArgs[i]);
        this.enableHooks = true;
        args = args.slice(1);
        let res =
          this.invokeFunPre(iid, <Function>base, newBase, args, isConstructor,
            isMethod, functionIid, functionSid);
        return res;
      }
      if (f == Function.prototype.apply) {
        //@ts-ignore
        let taintArgs: Taint =
          //@ts-ignore
          this.taintStack.pop(args[1], `invoke ${f.name}`, iid);
        // FIXME why is this newBase not used?
        //@ts-ignore
        let newBase = this.popIfFound(args[0], `invoke ${f.name}`, iid);
        //@ts-ignore
        this.popIfFound(Function.prototype.apply, `invoke ${f.name}`, iid);
        this.taintStack.push({val : base, taint : Label.LOW_LEVEL});
        let argsArr = <ShadowedArray>(taintArgs.val);
        for (let i = 0; i < argsArr.length; i++) {
          if (argsArr.shadow && argsArr.shadow[i])
            this.taintStack.push(new Taint(argsArr[i], argsArr.shadow[i]));
          else
            this.taintStack.push(new Taint(argsArr[i], Label.LOW_LEVEL));
        }
        this.enableHooks = true;
        return this.invokeFunPre(iid, <Function>base, args[0], argsArr,
          isConstructor, isMethod, functionIid,
          functionSid);
      }

      let msg = "invoke";
      if (f) {
        //@ts-ignore
        msg = `invoke ${f.name}`;
      }
      let taintArgs: Taint[] = [];
      if (this.taintStack.length() == 0) {
        // if this is a call from non-instrumented code
        if (args && args.length > 0) {
          for (let i = args.length - 1; i >= 0; i--)
            taintArgs[i] = new Taint(args[i], Label.LOW_LEVEL);
        }
      } else if (args && args.length > 0) {
        let argsShadow: any[] = (<ShadowedArray>args).shadow;
        for (let i = args.length - 1; i >= 0; i--) {
          if (argsShadow) {
            taintArgs[i] = new Taint(args[i], argsShadow[i]);
            this.popIfFound(args[i], msg, iid);
          } else {
            // for a call f(a, b, undefined) args has only two elements and the
            // stack has three taints, therefore we need to get rid of th
            // trailing taints
            let taintArgi: Taint =
              this.taintStack.popUntilFound(args[i], msg, iid);
            if (!taintArgi) {
              PRINT_STACK_MISSES &&
              //@ts-ignore
              console.log("No taint for arg " + i + " : " + args[i] + " " + f.name);
              taintArgs[i] = new Taint(args[i], Label.LOW_LEVEL);
            } else {
              // if (typeof taintArgi.val != typeof args[i] ||
              //     taintArgi.val != args[i]) {
              //   this.invMessenger.reportStackValueInvarintViolation(
              //       `expected argument-${i}(${
              //           args[i]}) to equal taint-stack-arg-${i}(${
              //           taintArgi.val})`,
              //       //@ts-ignore
              //       "invokeFunPre arg check", `call ${f.name}`, iid);
              // }
              taintArgs[i] = taintArgi;
            }
          }
        }
      }
      let taintF;
      if (this.taintStack.length() > 0) {
        //@ts-ignore
        taintF = this.taintStack.pop(f, msg, iid);
      }

      let baseTaint: Taint = new Taint(base, Label.LOW_LEVEL);
      baseTaint = this.popIfFound(base, msg, iid) || baseTaint;

      this.argsStack.push(taintArgs, taintF, baseTaint, false);
      if (f && (f as any)[ProxyConstants.isProxy]) {
        try {
          //@ts-ignore
          f.taintArgs = taintArgs;
        } catch (e) {
          //todo avoid this try-catch by trapping this setter in the proxy
        }
      }
      // handle closures in array methods
      if (Array.isArray(base) && (typeof args[0] == "function")) {
        var sa: ShadowedArray = <ShadowedArray>base;
        if (sa.length > 0)
          for (var i = sa.length - 1; i >= 0; i--) {
            // TODO see if this is ok for all array methods + add taint
            // propagation for the arguments[i], i > 0
            if (sa.shadow && sa.shadow[i])
              this.argsStack.push([ {val : sa[i], taint : sa.shadow[i]} ],
                taintF, baseTaint, true);
            else
              this.argsStack.push([ {val : sa[i], taint : Label.LOW_LEVEL} ],
                taintF, baseTaint, true);
          }
      }

      if (f === this.policyHelper) {
        if (args[1]) {
          this.policySources.push(new SourcePointer(args[0], args[1], args[2]));
        } else {
          this.policySources.push(
            new SourcePointer(args[0], Label.HIGH_LEVEL, "auto"));
        }
      } else if (f === this.policyHelper.addSink) {
        if (args[0]) {
          console.log("Marked sink " + args[0].name);
          this.policySinks[args[0]] = new SinkPointer(
            args[1], args[2],
            <(boolean | ((args: any[]) => boolean))[]>args[3]);
        }
      }

      // if it is one of the stored sources mark the indicated argument
      for (var s = 0; s < this.policySources.length; s++) {
        if (this.policySources[s].fct === f) {
          // TODO add code indicating that a source was hit
        }
      }

      // if sink
      var sinkProps: SinkPointer|undefined;
      // TODO remove this try-catch by correctly wrapping access path objects
      try {
        // this.printCallerFile(f);
        if (f && this.policySinks.hasOwnProperty(f.toString()))
          sinkProps = this.policySinks[f.toString()];
      } catch (e) {
      }
      //@ts-ignore
      if (f && f[ProxyConstants.isProxy] && !f[ProxyConstants.isEntryPoint]
        //@ts-ignore
        && !f[ProxyConstants.isExpired]) {
        for (let i = 0; i < taintArgs.length; i++) {
          //@ts-ignore
          let ap = `(parameter ${i} ${f[ProxyConstants.accessPath]})`;
          let apDeclassif =
            //@ts-ignore
            f[ProxyConstants.accessPath].match(/\(root [^)]+\)/)[0];
          this.checkTaint(taintArgs[i].taint, ap);
          //@ts-ignore
          f.taintArgs = [];
          taintArgs[i].taint = LabelOps.declassify(taintArgs[i].taint, args[i]);
          if (!LabelOps.isTainted(taintArgs[i].taint)){
            this.searchTaintRecursively(args[i], ap, [])
            this.declassifyRecursively(args[i], apDeclassif, []);
          }
        }
      }

      if (f === this.policyHelper.sink || sinkProps) {
        //@ts-ignore don't know why the Decl doesn't have the name prop on funcs
        console.log("Hit the sink " + f.name);
        for (let j = args.length - 1; j >= 0; j--) {
          let isSink = !sinkProps;
          if (sinkProps) {
            let argSpec = sinkProps.argSpecs[j];
            isSink =
              argSpec === true || (_.isFunction(argSpec) && argSpec(args));
          }
          if (isSink) {
            let taintEntry = taintArgs[j];
            if (taintEntry.val === args[j]) {
              if (sinkProps) {
                this.verifyTaint(args[j], taintEntry.taint, f, sinkProps.id,
                  sinkProps.queryID);
              } else {
                this.verifyTaint(args[j], taintEntry.taint, f, args[1],
                  "DefaultQuery");
              }
            }
            if (Array.isArray(args[j])) {
              let sa: ShadowedArray = <ShadowedArray>args[j];
              if (sa.shadow)
                for (let i = 0; i < sa.length; i++) {
                  if (sinkProps) {
                    this.verifyTaint(sa[i], sa.shadow[i], f, sinkProps.id,
                      sinkProps.queryID);
                  } else {
                    this.verifyTaint(sa[i], sa.shadow[i], f, args[1],
                      "DefaultQuery");
                  }
                }
            }
          }
        }
      }
      this.enableHooks = true;
    }
    return {f : f, base : base, args : args, skip : false};
  };

  printCallerFile(f: Function): void {
    //@ts-ignore
    console.log(f.name);
    var err = new Error();
    console.log(err.stack.split("\n")[3]);
  }

  verifyTaint(arg: any, taint: Label, f: Function, sinkID: string,
              queryID: string): void {
    if (LabelOps.isTainted(taint)) {
      var currLabels = LabelOps.getLabelNamesFromLabel(taint);
      for (var i = 0; i < currLabels.length; i++) {
        //@ts-ignore
        console.log("Taint violation at sink " + f.name +
          ", with value=" + arg + " and label=" + currLabels[i]);
        let newSink: Sink = {
          accessPath : currLabels[i],
          sinkID : sinkID,
          queryID : queryID
        };
        let exists = false;
        let addSinks = this.analysisResults.additionalSinks;
        for (let i = 0; i < addSinks.length; i++) {
          if (_.isEqual(addSinks[i], newSink)) exists = true;
        }
        if (!exists) addSinks.push(newSink);
      }
    }
  }

  /**
   * This callback is called after a function, method, or constructor
   *invocation.
   **/
  invokeFun(iid: iid, f: Function, base: any, args: any[], result: any,
            isConstructor: boolean, isMethod: boolean, functionIid: iid,
            functionSid: iid): {result: any} {
    if ((this.enableHooks && this.isInsideLibraryCode) ||
      //@ts-ignore
      (base === this.policyHelper) || f[ProxyConstants.isProxy]) {
      let isNative = isNativeFunction(f);
      //@ts-ignore
      let lastVal = this.taintStack.peek();
      let isNotEqual: boolean = false;
      try {
        isNotEqual = !lastVal || !_.isEqual(lastVal.val, result)
      } catch (e) {
        // not equal
      }
      if (isConstructor || this.isInsideLibraryCode && (isNotEqual)) {
        this.taintStack.push({val : result, taint : Label.LOW_LEVEL});
      }
      this.enableHooks = false;
      if (PRINT_HOOKS) {
        printHookObject("invokeFun", {
          iid : iid,
          //@ts-ignore
          fName : f.name,
          isConstructor : isConstructor,
          isMethod : isMethod,
          functionIid : functionIid,
          functionSid : functionSid
        });
      }

      if (f == Function.prototype.call && (typeof base == "function")) {
        // TODO splice the args
        var newBase = args[0];
        args = args.slice(1);
        this.enableHooks = true;
        let res =
          this.invokeFun(iid, <Function>base, newBase, args, result,
            isConstructor, isMethod, functionIid, functionSid);
        return res;
      }
      if (f == Function.prototype.apply && (typeof base == "function")) {
        let res =
          this.invokeFun(iid, f, args[0], args[1], result, isConstructor,
            isMethod, functionIid, functionSid);
        this.enableHooks = true;
        return res;
      }
      if (f == this.policyHelper.dumpStack) {
        console.log("Stack value:");
        console.log(JSON.stringify({
          "stackMisses" : this.taintStack.stackMisses,
          "stackTotal" : this.taintStack.stackTotal,
          "stackLength" : this.taintStack.length()
        }));
      }
      let argsEntry: ArgsStackEntry;
      let taintArgs: Taint[] = [];
      if (this.argsStack.length() > 0) {
        argsEntry = this.argsStack.pop();
        taintArgs = argsEntry.val;
      }
      let argsLabels: Label[] = [];
      for (let i = 0; i < taintArgs.length; i++)
        if (taintArgs[i] && taintArgs[i].taint)
          argsLabels.push(taintArgs[i].taint);
        else
          argsLabels.push(Label.LOW_LEVEL);
      let resTaint = Label.LOW_LEVEL;
      let toUpdateTaint = true;
      if (this.canAccessShadowArray(base) &&
        (typeof args[0] != "function") && isNative) {
        let sa: ShadowedArray = <ShadowedArray>base;

        if (sa.shadow) {
          try {
            let taintRes = f.apply(sa.shadow, argsLabels);
            if (taintRes && taintRes instanceof Label) resTaint = taintRes;
            if (Array.isArray(result) && this.canAccessShadowArray(result)) {
              let saR: ShadowedArray = <ShadowedArray>result;
              for (let i = 0; i < result.length; i++)
                if (_.isArray(taintRes) && taintRes[i] &&
                  taintRes[i] instanceof Label)
                  saR.shadow[i] = taintRes[i];
                else
                  saR.shadow[i] = Label.LOW_LEVEL;
            }
          } catch (e) {
            // the shadowarray model failed
          }
        }
      } else if (f === this.policyHelper.declassify) {
        resTaint = LabelOps.declassify(resTaint, args[1]);
        this.declassifyRecursively(result, args[1], []);
      } else if (f === this.policyHelper.source) {
        try {
          console.log("Variable marked:" + result + " with " + args[1] +
            ", source " + args[2]);
        } catch(e) {
          console.log("Variable marked: object with " + args[1] +
            ", source " + args[2]);
        }
        if (taintArgs && taintArgs[0] && taintArgs[0].taint.intersect)
          resTaint = taintArgs[0].taint.intersect(args[1]);
        else
          resTaint = args[1];
      } else if (f === this.policyHelper.isTainted) {
        result.tainted = LabelOps.isTainted(argsLabels[0]);
      } else if (isNative) {
        if (result) {
          for (let i = 0; i < taintArgs.length; i++) {
            if (taintArgs[i])
              resTaint = LabelOps.aggregate(resTaint, taintArgs[i].taint);
          }
          if (_.isArray(base) || _.isString(base)) {
            if (argsEntry && argsEntry.base) {
              resTaint = LabelOps.aggregate(resTaint, argsEntry.base.taint);
            }
            if (argsEntry && argsEntry.func) {
              //   resTaint = LabelOps.aggregate(resTaint,
              //   argsEntry.func.taint);
              resTaint = LabelOps.aggregate(resTaint, argsEntry.func.baseTaint);
            }
          }
        }
      } else {
        toUpdateTaint = false;
      }

      let lastStackEl = this.taintStack.peek();
      let isDeclassifPoint = false;
      //@ts-ignore
      if (f && f[ProxyConstants.interfaceMethod] && f[ProxyConstants.isEntryPoint]) {
        isDeclassifPoint = true;
        let lastStackEl = this.taintStack.peek();
        let tainted: boolean = false;
        let apDeclassif =
          //@ts-ignore
          f[ProxyConstants.accessPath].match(/\(root [^)]+\)/)[0];
        if (lastStackEl && lastStackEl.val === result &&
          LabelOps.isTainted(lastStackEl.taint)) {
          tainted =
            this.checkTaint(lastStackEl.taint,
              //@ts-ignore
              "(return " + f[ProxyConstants.accessPath] + ")");
          lastStackEl.taint =
            LabelOps.declassify(lastStackEl.taint, apDeclassif);
        }
        if (!tainted) {
          this.searchTaintRecursively(
            result,
            //@ts-ignore
            "(return " + f[ProxyConstants.accessPath] + ")", []);
          this.declassifyRecursively(result, apDeclassif, []);
        }
      }
      let isSanitizer: boolean = this.isSanitizer(f);

      if (lastStackEl && lastStackEl.val === result &&
        (toUpdateTaint === true || isSanitizer)) {
        if (isSanitizer)
          lastStackEl.taint = Label.LOW_LEVEL;
        else {
          if (!isDeclassifPoint) {
            lastStackEl.taint = LabelOps.aggregate(lastStackEl.taint, resTaint);
            if (Array.isArray(lastStackEl.val)
              && this.canAccessShadowArray(lastStackEl.val)) {
              let sa: ShadowedArray = <ShadowedArray>(lastStackEl.val);
              for (let i = 0; i < sa.length; i++) {
                if (!sa.shadow[i])
                  sa.shadow[i] = resTaint;
              }
            }
          }
        }
      }
      this.enableHooks = true;
    }

    // We're leaving a library function
    if ((f as any)[ProxyConstants.isProxy]) {
      this.isInsideLibraryCode--;
    }

    return {result : result};
  };

  addPropagation(newProp: Propagation) {
    if (this.crossPackagePropagation(newProp.entry, newProp.exit))
      return;
    if (this.isSanitizationAccessPath(newProp.entry))
      return true;
    let exists = false;
    let props = this.analysisResults.propagations;
    for (let i = 0; i < props.length; i++) {
      if (_.isEqual(props[i], newProp)) exists = true;
    }
    if (!exists) props.push(newProp);
  }

  isSanitizer(f: any): boolean {
    if (f && f.name && this.isSanitizationAccessPath(f.name))
      return true;
    //@ts-ignore
    if (f[ProxyConstants.isProxy]
      && this.isSanitizationAccessPath(f[ProxyConstants.accessPath]))
      return true;
    return false;
  }

  isSanitizationAccessPath(ap: string): boolean {
    //TODO add better support for sanitizers
    let sanitizerRegexp = /(escape|sanitize|Escape|Sanitize)/;
    return ap.search(sanitizerRegexp) != -1;
  }

  declassifyRecursively(object: any, ap: string, visited: any[]) {
    visited.push(object);
    if (object instanceof Label) return;
    if (Array.isArray(object)) {
      let sa = <ShadowedArray>object;
      for (let i = 0; i < sa.length; i++) {
        try {
          sa.shadow[i] = LabelOps.declassify(sa.shadow[i], ap);
          if (visited.indexOf(object[i]) === -1)
            this.declassifyRecursively(object[i], ap, visited)
        } catch(e) {
          // console.log(e)
        }
      }
    } else {
      try {
        let keys: string[] = Object.keys(object);
        for (let i = 0; i < keys.length; i++) {
          let currKey = keys[i];
          let label: Label = this.metaHelper.readMeta(object, currKey);
          label = LabelOps.declassify(label, ap);
          this.metaHelper.storeMeta(object, currKey, label);
          let currChild = object[currKey];
          if (visited.indexOf(currChild) === -1)
            this.declassifyRecursively(currChild, ap, visited);

        }
      } catch (e) {
      }
    }
  }

  searchTaintRecursively(object: any, ap: string, visited: any[]) {
    visited.push(object);
    if (object instanceof Label) return;
    if (Array.isArray(object)) {
      let sa = <ShadowedArray>object;
      for (let i = 0; i < sa.length; i++) {
        let newAp = `(member ${i} ${ap})`;
        if (sa.shadow) {
          let tainted: boolean = this.checkTaint(sa.shadow[i], newAp);
          if (!tainted) {
            let currChild = object[i];
            if (visited.indexOf(currChild) === -1)
              this.searchTaintRecursively(currChild, newAp, visited);
          }
        }
      }
    } else if (_.isObject(object)) {
      try {
        let keys: string[] = Object.keys(object);
        for (let i = 0; i < keys.length; i++) {
          let currKey = keys[i];
          let label: Label = this.metaHelper.readMeta(object, currKey);
          let newAp: string;
          if (label.isDynComputed())
            newAp = `(member * ${ap})`;
          else
            newAp = `(member ${currKey} ${ap})`;
          let tainted: boolean = this.checkTaint(label, newAp);
          if (!tainted) {
            //@ts-ignore
            let currChild = object[currKey];
            if (visited.indexOf(currChild) === -1)
              this.searchTaintRecursively(currChild, newAp, visited);
          }
        }
      } catch (e) {
      }
    }
  }

  checkTaint(taint: Label, accessPath: string) {
    if (LabelOps.isTainted(taint)) {
      let currLabels = LabelOps.getLabelNamesFromLabel(taint);
      for (let j = 0; j < currLabels.length; j++) {
        let newProp: Propagation = {
          entry : currLabels[j],
          //@ts-ignore
          exit : accessPath,
          queryID : "AllQueries"
        };
        if (newProp.entry !== newProp.exit)
          this.addPropagation(newProp)
      }
      return true;
    } else {
      return false;
    }
  }

  /**
   * This callback is called after the creation of a literal. A literal can be a
   *function literal, an object literal, an array literal, a number, a string, a
   *boolean, a regular expression, null, NaN, Infinity, or undefined.
   **/
  literal(iid: iid, val: any, hasGetterSetter: boolean) {
    if (this.enableHooks && this.isInsideLibraryCode) {
      this.enableHooks = false;
      if (PRINT_HOOKS) {
        printHookObject("literal", {
          iid : iid,
          hasGetterSetter : hasGetterSetter,
          val : _.isObjectLike(val) || _.isFunction(val) ? undefined : val
        });
      }

      if (_.isFunction(val)) {
        this.smemory.defineFunction(val);
      } else if (Array.isArray(val) && this.canAccessShadowArray(val)) {
        let sa: ShadowedArray = <ShadowedArray>val;
        if (sa.shadow) {
          for (let i = sa.length - 1; i >= 0; i--) {
            let popped: Taint =
              this.taintStack.popUntilFound(val[i], "literal", iid);
            if (popped) {
              sa.shadow[i] = popped.taint;  // Label.LOW_LEVEL;
            } else {
              sa.shadow[i] = Label.LOW_LEVEL;
            }
          }
        }
      } else if (val && _.isObject(val)) {
        let keys: any[] = [];
        try {
          keys = Object.keys(val);
        } catch (e) {
          // on some objects this throws a runtime error
        }
        if (keys.length > 0)
          for (let i = keys.length - 1; i--; i >= 0) {
            //@ts-ignore
            let entry = val[keys[i]];
            let popped: Taint =
              this.taintStack.popUntilFound(entry, "literal", iid);
            if (popped) {
              this.metaHelper.storeMeta(val, keys[i], popped.taint);
            }
          }
      }

      this.taintStack.push({"val" : val, "taint" : Label.LOW_LEVEL});
      this.enableHooks = true;
    }
    return {result : val};
  };

  /**
   * These callbacks are called before and after a property of an object is
   *accessed.
   **/
  getFieldPre(iid: iid, base: any, offset: string | symbol, isComputed: boolean,
              isOpAssign: boolean, isMethodCall: boolean) {
    if (base && base[ProxyConstants.isProxy]) {
      try {
        if (_.isObject(base)) {
          //@ts-ignore
          if (!base[ProxyConstants.dynComputed]) {
            Object.defineProperty(base, ProxyConstants.dynComputed,
              {enumerable: false, writable: true});
            //@ts-ignore
            base[ProxyConstants.dynComputed] = Object.create(null);
          }
          let isComputed: boolean;
          if (TAINTED_KEYS_GENERIC_MEMBERS) {
            let offTaint = this.popIfFound(offset, "getFielPre", iid);
            if (offTaint && LabelOps.isTainted(offTaint.taint))
              isComputed = true;
            else
              isComputed = false;
          } else {
            let node = this.iidToASTNode(iid);
            isComputed = this.codeAnalyzer.isComputedRead(node);
          }
          //@ts-ignore
          base[ProxyConstants.dynComputed][offset] = isComputed;
        }
      } catch (e) {
      }
    }
    return {base : base, offset : offset, skip : false};
  };

  getField(iid: iid, base: any, offset: string, val: any, isComputed: boolean,
           isOpAssign: boolean, isMethodCall: boolean) {
    if (this.enableHooks && this.isInsideLibraryCode) { //&& !base[ProxyConstants.isProxy]
      this.enableHooks = false;
      if (PRINT_HOOKS) {
        printHookObject("getField", {
          iid : iid,
          offset : offset,
          isComputed : isComputed,
          isOpAssign : isOpAssign,
          isMethodCall : isMethodCall
        });
      }
      let label;
      let baseTaint:  Taint;
      if (base && base[ProxyConstants.isProxy]) {
        // we need to pop the result of the proxied get
        let resTaint = this.popIfFound(val, "getField", iid);
        if (resTaint) {
          label = resTaint.taint;
          if (base[ProxyConstants.dynComputed]) {
            // isComputed = base[ProxyConstants.dynComputed][offset]
            delete base[ProxyConstants.dynComputed][offset];
          }
        }
        this.popIfFound(offset, "getField", iid);
        this.popIfFound(base, "getField", iid)
      } else {
        let node = this.iidToASTNode(iid);
        isComputed = this.codeAnalyzer.isComputedRead(node);
        // pop the offset
        this.popIfFound(offset, "getField", iid);
        baseTaint = this.popIfFound(base, "getField", iid);
        if (baseTaint && LabelOps.isTainted(baseTaint.taint) && !this.inPolicy()) {
          label = LabelOps.wrapFieldAccess(baseTaint.taint, offset,
            (isComputed && !_.isArray(base)));
        }
      }

      if (Array.isArray(base)) {
        let sa = <ShadowedArray>base;
        if (sa.shadow) {
          if (offset == "length") {
            label = Label.LOW_LEVEL;
            // model the length property separately
            for (let i = 0; i < sa.shadow.length; i++)
              if (sa.shadow[i] && sa.shadow[i])
                label = label.intersect(sa.shadow[i]);
          } else {
            if (sa.shadow[offset as unknown as number])
              label = sa.shadow[offset as unknown as number];
          }
        }
      }

      try {
        if (base && base.toString && base.toString() == "[object Arguments]") {
          try {
            label = this.taintArgs[parseInt(offset)].taint;
          } catch (e) {
            // unhandled advance reflective operations on arguments object
          }
        }
      } catch (e) {
        // fixme base.toString() does sometimes throw for unknown reasons
      }
      label =
        label || this.metaHelper.readMeta(base, offset) || Label.LOW_LEVEL;
      // fixme remove this baseTaint once the isMethodCall flag in getField
      // works
      // properly
      if (baseTaint)
        this.taintStack.push(
          {"val" : val, "taint" : label, "baseTaint" : baseTaint.taint});
      else
        this.taintStack.push({"val" : val, "taint" : label});
      this.enableHooks = true;
    }
    return {result : val};
  };

  /**
   * These callbacks are called before a property of an object is written
   **/
  putFieldPre(iid: iid, base: any, offset: string, val: any,
              isComputed: boolean, isOpAssign: boolean) {
    return {base : base, offset : offset, val : val, skip : false};
  };

  putField(iid: iid, base: any, offset: string, val: any, isComputed: boolean,
           isOpAssign: boolean) {
    if (this.enableHooks && this.isInsideLibraryCode) {
      this.enableHooks = false;
      if (PRINT_HOOKS) {
        printHookObject("putField", {
          iid : iid,
          offset : offset,
          isComputed : isComputed,
          isOpAssign : isOpAssign,
        });
      }

      let entry = this.taintStack.pop(val, "putField", iid);
      let offTaint = this.popIfFound(offset, "putField", iid);
      this.popIfFound(base, "putField", iid);

      if (entry) {
        let node = this.iidToASTNode(iid);
        // isComputed is not correctly set by NodeProf
        isComputed = this.codeAnalyzer.isComputedWrite(node);

        let resTaint = entry.taint.intersect(Label.LOW_LEVEL);

        if (
          (TAINTED_KEYS_GENERIC_MEMBERS
            && offTaint && LabelOps.isTainted(offTaint.taint))
          || isComputed && !_.isArray(base)
        ) {
          resTaint.setDynComputed(true);
        } else {
          resTaint.setDynComputed(false);
        }
        try {
          this.metaHelper.storeMeta(base, offset, resTaint);
        } catch (e) {
          // object not writable
        }
      }

      if (Array.isArray(base)) {
        let sa = <ShadowedArray>base;
        if (sa.shadow) {
          try {
            sa.shadow[offset as unknown as number] = entry.taint;
          } catch (e) {
          }
        }
      }

      this.enableHooks = true;
    }
    return {result : val};
  };

  /**
   * These callbacks are called after a variable is read or written.
   **/
  read(iid: iid, name: string, val: any, isGlobal: boolean,
       isScriptLocal: boolean) {
    if (this.enableHooks && this.isInsideLibraryCode) {
      this.enableHooks = false;
      if (PRINT_HOOKS) {
        printHookObject("read", {
          iid : iid,
          name : name,
          isGlobal : isGlobal,
          isScriptLocal : isScriptLocal,
        });
      }
      let frame = this.smemory.getFrame(name);
      let meta = this.metaHelper.readMeta(frame, name);
      if (name == "arguments" && this.canAccessShadowArray(val)) {
        // TODO make this work with async calls also
        let taints: Taint[] = this.argsStack.peek();
        let sa: ShadowedArray = (<ShadowedArray>val);
        for (let i = 0; i < taints.length; i++)
          sa.shadow.push(taints[i].taint);
      }
      this.taintStack.push({"val" : val, "taint" : meta});
      this.enableHooks = true;
    }
    return {result : val};
  };

  write(iid: iid, name: string, val: any, lhs: any, isGlobal: boolean,
        isScriptLocal: boolean) {
    if (this.enableHooks && this.isInsideLibraryCode) {
      this.enableHooks = false;
      if (PRINT_HOOKS) {
        printHookObject("write", {
          iid : iid,
          name : name,
          isGlobal : isGlobal,
          isScriptLocal : isScriptLocal,
        });
      }
      let node = this.iidToASTNode(iid);
      let isInForIn = this.codeAnalyzer.isInForIn(node);
      if (isInForIn) {
        try {
          if (!this.forinMapping[iid])
            this.forinMapping[iid] = this.taintStack.peek();
          let iteratedObj = this.forinMapping[iid];
          this.taintStack.push({"val": val, "taint": iteratedObj.taint});
          this.metaHelper.storeMeta(this.smemory.getFrame(name), name,
            iteratedObj.taint);
        } catch (e) {
          // console.log(e);
        }
      } else {
        let entry = this.taintStack.pop(val, "write", iid);

        if (entry) {
          this.metaHelper.storeMeta(this.smemory.getFrame(name), name,
            entry.taint);
          let isSelfIncrement: boolean = this.codeAnalyzer.isSelfIncrement(node);
          let isPrefixOp: boolean = this.codeAnalyzer.isPrefixOp(node);
          if (isSelfIncrement && !isPrefixOp)
            this.taintStack.push({"val": val - 1, "taint": entry.taint});
          else
            this.taintStack.push({"val": val, "taint": entry.taint});
        } else {
          this.taintStack.push({"val": val, "taint": Label.LOW_LEVEL});
        }
      }
      this.enableHooks = true;
    }
    return {result : val};
  };

  /**
   * These callbacks are called before the execution of a function body starts
   *and after it completes.
   **/

  functionEnter(iid: iid, f: Function, dis: any, args: any[]) {
    if (this.enableHooks && this.isInsideLibraryCode) {
      this.enableHooks = false;
      this.taintStack.functionEnter();
      if (PRINT_HOOKS) {
        printHookObject("functionEnter", {
          iid : iid,
          //@ts-ignore
          fName : f.name
        });
      }
      this.taintArgs = this.argsStack.peek();
      //it would be nice if we could do this in the proxy instead
      //@ts-ignore
      let fTargs =  f.taintArgs;
      if (fTargs) {
        for (let i =  0; i < fTargs.length; i++) {
          if (this.taintArgs[i])
            this.taintArgs[i].taint =
              this.taintArgs[i].taint.intersect(fTargs[i].taint);
          else
            this.taintArgs[i] = fTargs[i];
        }
      }
      // pop if async
      if (this.argsStack.isLastAsync()) this.argsStack.pop();
      this.smemory.functionEnter(f);
      let argsNames = this.getArgsNames(f);
      let sa: ShadowedArray = <ShadowedArray>args;
      if (!sa.shadow) ShadowArray.wrap(sa, this.taintArgs);
      if (this.taintArgs)
        for (let i = 0; i < this.taintArgs.length; i++) {
          let entry = this.taintArgs[i];
          if (entry && argsNames[i]) {
            this.metaHelper.storeMeta(this.smemory.getCurrentFrame(),
              argsNames[i], entry.taint);
          }
        }

      this.enableHooks = true;
    }
  };

  functionExit(iid: iid, returnVal: any,
               wrappedExceptionVal: {exception: any}|undefined) {
    if (this.enableHooks && this.isInsideLibraryCode) {
      this.enableHooks = false;

      if (PRINT_HOOKS) {
        printHookObject("functionExit", {iid : iid});
      }

      let resTaint = this.popIfFound(returnVal, "functionExit", iid);
      this.taintStack.functionExit();
      if (resTaint)
        this.taintStack.push(resTaint);
      else
        this.taintStack.push({val: returnVal, taint: Label.LOW_LEVEL});

      this.smemory.functionReturn();
      this.enableHooks = true;
    }
    return {
      returnVal : returnVal,
      wrappedExceptionVal : wrappedExceptionVal,
      isBacktrack : false
    };
  };

  /**
   * These callbacks are called before the execution of a builtin function body
   *starts and after it completes.
   * !!! Careful the builtin hook is called in addition to the invokeFun hook,
   *not instead !!!
   **/

  builtinEnter(name: string, f: Function, dis: any, args: any[]) {
    // if (this.enableHooks) {
    //   this.enableHooks = false;
    //   // @ts-ignore
    //   console.log(f.name);
    //   if (args.length > 0)
    //     for (let i = args.length - 1; i >= 0; i--) {
    //       this.popIfFound(args[i], "builtinEnter", -1);
    //     }
    //   this.enableHooks = true;
    // }
  };

  builtinExit(name: string, f: Function, dis: any, args: any[], returnVal: any,
              exceptionVal: any) {
    if (this.enableHooks && this.isInsideLibraryCode) {
      this.enableHooks = false;
      // FIXME enabling this debug hook slows down the execution considerably.
      // if (PRINT_HOOKS) {
      //  printHookObject(
      //      "builtinExit",
      //      {name : name});
      // }
      // TODO: funny but you can't use console.log in the body of this function
      // printing from builtinExit causes an infinite loop for unknown reasons
      // if (f != Function.prototype.apply && f != Function.prototype.call) {
      //   if (exceptionVal)
      //     this.taintStack.push(
      //         {"val" : exceptionVal, "taint" : Label.LOW_LEVEL}, false);
      //   else
      //     this.taintStack.push({"val" : returnVal, "taint" : Label.LOW_LEVEL},
      //                          false);
      // }
      this.enableHooks = true;
    }
    return {returnVal : returnVal};
  };

  /**
   * These callbacks are called before and after a binary operation.
   **/
  binaryPre(iid: iid, op: any, left: any, right: boolean, isOpAssign: boolean,
            isSwitchCaseComparison: boolean, isComputed: boolean) {
    return {op : op, left : left, right : right, skip : false};
  };

  binary(iid: iid, op: any, left: any, right: any, result: any,
         isOpAssign: boolean, isSwitchCaseComparison: boolean,
         isComputed: boolean) {
    // TODO find a way to distinguish between ++x and x++
    if (this.enableHooks && this.isInsideLibraryCode) {
      this.enableHooks = false;
      if (PRINT_HOOKS) {
        printHookObject("binary", {
          iid : iid,
          op : op,
          isOpAssign : isOpAssign,
          isSwitchCaseComparison : isSwitchCaseComparison,
          isComputed : isComputed
        });
      }
      let taintB = this.taintStack.pop(right, "binary", iid);
      let taintA = this.taintStack.pop(left, "binary", iid);
      let actualTB = (taintB) ? taintB.taint : Label.LOW_LEVEL;
      let actualTA = (taintA) ? taintA.taint : Label.LOW_LEVEL;

      this.taintStack.push(
        new Taint(result, LabelOps.aggregate(actualTA, actualTB)));
      this.enableHooks = true;
    }
    return {result : result};
  };

  /**
   * These callbacks are called before and after a unary operation.
   **/

  unaryPre(iid: iid, op: any, left: any) {
    return {op : op, left : left, skip : false};
  };

  unary(iid: iid, op: any, left: any, result: any) {
    if (this.enableHooks && this.isInsideLibraryCode && op != "void") {
      this.enableHooks = false;
      if (PRINT_HOOKS) {
        printHookObject("unary", {
          iid : iid,
          op : op,
        });
      }
      var taintA = this.taintStack.pop(left, "unary", iid);
      if (taintA)
        this.taintStack.push(new Taint(result, taintA.taint));
      else
        this.taintStack.push(new Taint(result, Label.LOW_LEVEL));
      this.enableHooks = true;
    }
    return {result : result};
  };

  /**
   * This callback is called after a conditional expression has been evaluated
   **/
  conditional(iid: iid, result: any) {
    // in order to handle "a = b>c" we can not pop this
    // this.taintStack.pop(result);
    return {result : result};
  };

  /**
   * This callback is called when an execution terminates in node.js.
   **/
  public endExecution() {
    this.enableHooks = false;
    this.analysisResults.taintStackMisses = this.taintStack.stackMisses;
    this.analysisResults.taintStackTotal = this.taintStack.stackTotal;
    const analysisResults =
      JSON.stringify(this.analysisResults.toJson(), null, 2);
    console.log("TaintModel:\n" + analysisResults);

    const outFile = process.env.POLICY_OUT;
    if (outFile) {
      console.log(`Writing analysis results to ${outFile}`);
      fs.writeFileSync(outFile, analysisResults);
    }
  };

  // for callbacks that are new or different from Jalangi
  private extraFeatures = true;

  /**
   *  These callbacks are called before and after code is executed by eval.
   **/
  evalPre(iid: iid, str: string) {
    if (this.enableHooks && this.isInsideLibraryCode) {
      this.enableHooks = false;
      let taintStr = this.taintStack.peek();
      if (this.policySinks[eval.toString()]) {
        let entry = this.policySinks[eval.toString()];
        this.verifyTaint(iid, taintStr.taint, eval, entry.id, entry.queryID);
      }
      this.smemory.evalBegin();
      this.enableHooks = true;
    }
  };
  evalPost(iid: iid, str: string) {
    if (this.enableHooks && this.isInsideLibraryCode) {
      this.enableHooks = false;
      let currentRes = this.taintStack.peek();
      if (currentRes) {
        let taintStr = this.taintStack.popUntilFound(str, "eval", iid);
        if (taintStr)
          currentRes.taint =
            LabelOps.aggregate(currentRes.taint, taintStr.taint);
        this.taintStack.push(currentRes);
        this.smemory.evalEnd();
      }
      this.enableHooks = true;
    }
  };

  /**
   *  These callabcks are called before and after body of functions defined with
   *the Function constructor are executed.
   **/
  evalFunctionPre(args: any[]) {};

  evalFunctionPost(args: any[], ret: any, exceptionVal: any) {};

  declare(iid: iid, name: string) {
    if (!this.smemory.isOnCurrentFrame(name)) {
      this.smemory.initialize(name);
    }
  };

  private cache: {[index: string]: string[]} = {};

  private iidToASTNode(iid: number): any {
    let locObj = J$.iidToSourceObject(J$.getGlobalIID(iid));
    return this.codeAnalyzer.resolve(locObj.name, locObj.loc);
  }

  private canAccessShadowArray(obj: any): boolean {
    if (!obj)
      return false;
    try {
      let sa: ShadowedArray = <ShadowedArray>obj;
      if (sa.shadow)
        return true;
      if (Array.isArray(obj) || _.isArguments(obj)) {
        ShadowArray.wrap(sa);
        return true;
      }
    } catch (e) {
      return false;
    }
  }

  private crossPackagePropagation(entry: string, exit: string): boolean {
    let matchedRoot = entry.match(/\(root [^)]+\)/);
    if (!matchedRoot)
      return false;
    let entryRoot: string = matchedRoot[0];
    return exit.indexOf(entryRoot) == -1;
  }

  private inPolicy(): boolean {
    try {
      let stack = (new Error()).stack.split("\n");
      return stack[3].indexOf("DefaultPolicy.js") != -1;
    } catch (e) {
    }
    return false;
  }

  private getArgsNames(func: Function): string[] {
    // First match everything inside the function argument parens.
    if (func === Function.prototype.toString ||
      func === String.prototype.match || func === String.prototype.indexOf ||
      func === String.prototype.replace || func === String.prototype.trim ||
      func === String.prototype.split || func === Array.prototype.push)
      return [];
    var fCode = func.toString();
    if (this.cache[fCode]) return this.cache[fCode];
    if (fCode.indexOf("[native code]") != -1) return [];
    var matches = fCode.match(/function[^)]*?\(([^)]*)\)/) ||
      fCode.match(/\(([^)]*)\).*=>/);
    if (matches != null && matches.length > 0) {
      let args: string = matches[1];
      let argsArr: string[] = args.split(',');
      let resArgs: string[] = [];
      for (var i = 0; i < argsArr.length; i++) {
        argsArr[i] = argsArr[i].replace(/\/\*.*\*\//, '').trim();
        if (argsArr[i]) resArgs.push(argsArr[i]);
      }
      this.cache[fCode] = resArgs;
      return resArgs;
    }
    return [];
  }
}
const analysis = new AintNodeTaint();
J$.analysis = analysis;

process.on('exit', function() {
  console.log('exit handler called');
  analysis.endExecution();
});

const policyFile = process.env.POLICY_FILE;
if (policyFile) {
  require(policyFile);
  console.log(`Successfully loaded policy: ${policyFile}`);
}

console.log("Successfully setup the analysis");