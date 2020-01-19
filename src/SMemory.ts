interface Frame {
  [index: string]: any
}

export class SMemory {
  static PREFIX1 = "ANT$";
  static SPECIAL_PROP = "*" + SMemory.PREFIX1 + "C*M";

  private HAS_OWN_PROPERTY = Object.prototype.hasOwnProperty;
  private CALL = Function.prototype.call;

  private HOP(obj: {}, prop: PropertyKey) {
    return (prop.toString() + "" === '__proto__') ||
           this.CALL.call(this.HAS_OWN_PROPERTY, obj, prop);
  };

  private frame: Frame = Object.create(null);

  private frameStack: Frame[] = [ this.frame ];
  private evalFrames: any[] = [];

  getFrame(name: PropertyKey): Frame {
    let tmp = this.frame;
    while (tmp && !this.HOP(tmp, name)) {
      tmp = tmp[SMemory.SPECIAL_PROP];
    }
    if (tmp) {
      return tmp;
    } else {
      return this.frameStack[0];  // return global scope
    }
  };

  getCurrentFrame(): Frame {
    return this.frame;
  };

  isOnCurrentFrame(name: PropertyKey): boolean {
    return this.HOP(this.getCurrentFrame(), name);
  }


  defineFunction(val: any) {
    if (Object && Object.defineProperty &&
        typeof Object.defineProperty === 'function') {
      Object.defineProperty(val, SMemory.SPECIAL_PROP,
                            {enumerable : false, writable : true});
    }
    val[SMemory.SPECIAL_PROP] = this.frame;
  };

  evalBegin() {
    this.evalFrames.push(this.frame);
    this.frame = this.frameStack[0];
  };

  evalEnd() {
    this.frame = this.evalFrames.pop();
  };

  initialize(name: PropertyKey) {
    this.frame[name.toString()] = undefined;
  };

  functionEnter(val: any) {
    this.frameStack.push(this.frame = Object.create(null));
    if (Object && Object.defineProperty &&
        typeof Object.defineProperty === 'function') {
      Object.defineProperty(this.frame, SMemory.SPECIAL_PROP,
                            {enumerable : false, writable : true});
    }
    this.frame[SMemory.SPECIAL_PROP] = val[SMemory.SPECIAL_PROP];
  };

  functionReturn() {
    // because of our partial instrumentation we sometimes pop the global
    // scope off
    if (this.frameStack.length > 1) {
      this.frameStack.pop();
      this.frame = this.frameStack[this.frameStack.length - 1];
    }
  };

}
