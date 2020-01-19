// NODEPROF DO NOT INSTRUMENT
import {Meta} from "./MetaHelper";
import {ProxyConstants} from "./ProxyConstants";

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
 * Created by Cristian-Alexandru Staicu on 05.08.19.
 *
 * This file manages the taint levels available. By default there are only
 * two taint levels: HIGH and LOW, but in the future the policy may add
 * additional taint levels.
 */

const util = require("util");

export class NonInstrPolicyHelper {

  static isNotTrapped(prop: string | symbol | number): boolean {
    return prop === "actualObj" || prop === Meta.MAPPING_PROPERTY ||
      prop === "toString" || prop === "valueOf" || prop === "shadow" ||
      prop === Symbol.toPrimitive || prop === Symbol.toStringTag ||
      prop === ProxyConstants.dynComputed || prop === Symbol.iterator ||
      prop === util.inspect.custom || prop === "inspect" ||
      prop === "length" || recursiveAccess();
  }

  static isNonNativeFunction(obj: any): boolean {
    return obj.toString().indexOf("[native code]") === -1;
  }

  static getPackageName(accessPath: string): string {
    return accessPath.match(/\(root [^)]+\)/)[0];
  }
}

function recursiveAccess(): boolean {
  try {
    let stack = (new Error()).stack.split("\n");
    return stack[4].indexOf("DefaultPolicy.js") != -1
      || stack[4].indexOf("AintNodeTaint.js") != -1;
  } catch (e) {
  }
  return false;
}