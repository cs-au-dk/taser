export type iid = number;

export type giid = string;

export interface SourceCodePointer {
  line: number;
  column: number;
}

export interface CodeSnippetLocation {
  start: SourceCodePointer;
  end: SourceCodePointer;
}

export interface Jalangi {

  smap: { [key: number]: any };

  initParams?: any;

  sid: iid;

  getGlobalIID(iid: iid): giid;

  iidToLocation(iid: giid): string;

  iidToSourceObject(iid: giid):
    {name: string, loc: CodeSnippetLocation, range: []};

  analysis?: JalangiAnalysis;

  smemory?: {

    getShadowObject(
      obj: object,
      prop: string,
      isGetField: boolean
    ): { owner: object, isProperty: boolean };

    getShadowFrame(name: string): object;

    getIDFromShadowObjectOrFrame(obj: object): number | void;

    getActualObjectOrFunctionFromShadowObjectOrFrame(obj: object): any;

    getFrame(name: string): object;

    getShadowObjectOfObject(val: object): object | void;

  };

}

export interface JalangiAnalysis {

  invokeFunPre?(
    iid: iid,
    f: Function,
    base: object,
    args: any[],
    isConstructor: boolean,
    isMethod: boolean,
    functionIid: iid,
    functionSid: iid
  ): { f: Function, base: object, args: any[], skip: boolean } | void;

  invokeFun?(
    iid: iid,
    f: Function,
    base: any,
    args: any[],
    result: any,
    isConstructor: boolean,
    isMethod: boolean,
    functionIid: iid,
    functionSid: iid
  ): { result: any } | void;

  literal?(
    iid: iid,
    val: any,
    hasGetterSetter: boolean
  ): { result: any } | void;

  forinObject?(
    iid: iid,
    val: any
  ): { result: any } | void;

  declare?(
    iid: iid,
    name: string,
    val: any,
    isArgument: boolean,
    argumentIndex: number,
    isCatchParam: boolean
  ): { result: any } | void;

  getFieldPre?(
    iid: iid,
    base: any,
    offset: string | any,
    isComputed: boolean,
    isOpAssign: boolean,
    isMethodCall: boolean
  ): { base: any, offset: any, skip: boolean } | void;

  getField?(
    iid: iid,
    base: any,
    offset: string | any,
    val: any,
    isComputed: boolean,
    isOpAssign: boolean,
    isMethodCall: boolean
  ): { result: any } | void;

  putFieldPre?(
    iid: iid,
    base: any,
    offset: string | any,
    val: any,
    isComputed: boolean,
    isOpAssign: boolean
  ): { base: any, offset: any, val: any, skip: boolean } | void;

  putField?(
    iid: iid,
    base: any,
    offset: string | any,
    val: any,
    isComputed: boolean,
    isOpAssign: boolean
  ): { result: any } | void;

  read?(
    iid: iid,
    name: string,
    val: any,
    isGlobal: boolean,
    isScriptLocal: boolean,
  ): { result: any } | void;

  write?(
    iid: iid,
    name: string,
    val: any,
    lhs: any,
    isGlobal: any,
    isScriptLocal: any
  ): { result: any } | void;

  _return?(
    iid: iid,
    val: any
  ): { result: any } | void;

  _throw?(
    iid: iid,
    val: any
  ): { result: any } | void;

  _with?(
    iid: iid,
    val: any
  ): { result: any } | void;

  functionEnter?(
    iid: iid,
    f: Function,
    dis: any,
    args: any[]
  ): void;

  functionExit?(
    iid: iid,
    returnVal: any,
    wrappedExceptionVal: { exception: any } | undefined
  ): { returnVal: any, wrappedExceptionVal: any, isBacktrack: boolean } | void;

  scriptEnter?(
    iid: iid,
    instrumentedFileName: string,
    originalFileName: string
  ): void;

  scriptExit?(
    iid: iid,
    wrappedExceptionVal: { exception: any } | undefined
  ): { returnVal: any, wrappedExceptionVal: any, isBacktrack: boolean } | void;

  binaryPre?(
    iid: iid,
    op: string,
    left: any,
    right: any,
    isOpAssign: boolean,
    isSwitchCaseComparison: boolean,
    isComputed: boolean
  ): { op: string, left: any, right: any, skip: boolean } | void;

  binary?(
    iid: iid,
    op: string,
    left: any,
    right: any,
    result: any,
    isOpAssign: boolean,
    isSwitchCaseComparison: boolean,
    isComputed: boolean
  ): { result: any } | void;

  unaryPre?(
    iid: iid,
    op: string,
    left: any
  ): { op: string, left: any, skip: boolean } | void;

  unary?(
    iid: iid,
    op: string,
    left: any,
    result: any
  ): { result: any } | void;

  conditional?(
    iid: iid,
    result: any
  ): { result: any } | void;

  instrumentCodePre?(
    iid: iid,
    code: any,
    isDirect: boolean
  ): { code: any, skip: boolean } | void;

  instrumentCode?(
    iid: iid,
    newCode: any,
    newAst: object,
    isDirect: boolean
  ): { result: any } | void;

  endExpression?(iid: iid): void;

  endExecution?(): void;

  runInstrumentedFunctionBody?(
    iid: iid,
    f: Function,
    functionIid: iid,
    functionSid: iid
  ): boolean;

  onReady?(cb: Function): void;

}
