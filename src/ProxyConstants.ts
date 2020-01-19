export class ProxyConstants {
  static isProxy = Symbol("is-proxy");
  static interfaceMethod = Symbol("interfaceMethod");
  static accessPath = Symbol("accessPath");
  static actualObj = Symbol("actualObj");
  static isEntryPoint = Symbol("is-entry");
  static dynComputed = Symbol("dyn-computed");
  static isExpired = Symbol("is-expired");
}