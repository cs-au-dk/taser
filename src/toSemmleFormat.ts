import * as path from "path";

export function toSemmleFormat(moduleQueryString: string,
                               resolvedLibraryPath: string,
                               libraryToInstr: string): string {
  console.log(moduleQueryString + " " + resolvedLibraryPath + " " + libraryToInstr)
  let moduleAbsPath: string;
  if (moduleQueryString.startsWith("/") || moduleQueryString.startsWith(".")) {
    // Absolute or relative path
    const libFolder = `/${libraryToInstr}`;

    if (resolvedLibraryPath.includes(libFolder)) {
      moduleAbsPath = resolvedLibraryPath.substring(
          resolvedLibraryPath.lastIndexOf(libFolder) +
          1)  // +1 to remove the '/' in the beginning
    } else {
      console.error(
          `Unable to identify correct submodule path for moduleQueryString ${
              moduleQueryString} resolved to ${resolvedLibraryPath}`);
      moduleAbsPath = 'unknownSubModule'
    }
  } else {
    moduleAbsPath = moduleQueryString;
  }
  return `(root https://www.npmjs.com/package/${moduleAbsPath})`;
}

export function toSemmleFormatLibraryTest(
    resolvedLibraryPath: string, libraryRootPath: string,
    mainModuleFile: string, libraryToInstrument: string): string {
  let modulePath: string;
  if (resolvedLibraryPath === mainModuleFile) {
    modulePath = libraryToInstrument
  } else {
    const moduleRelativePath = path.relative(libraryRootPath, resolvedLibraryPath);

    //Remove file extension
    const moduleWOExtension = moduleRelativePath.substring(0, moduleRelativePath.lastIndexOf("."));
    modulePath = `${libraryToInstrument}/${moduleWOExtension}`;
  }
  return `(root https://www.npmjs.com/package/${modulePath})`;
}