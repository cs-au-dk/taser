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
 * Created by Cristian-Alexandru Staicu on 4.12.18.
 *
 * This file manages the taint levels available. By default there are only
 * two taint levels: HIGH and LOW, but in the future the policy may add
 * additional taint levels.
 */

export interface ShadowedArray extends Array<any> {
  //[index: string]: any
  shadow: Array<any>;
}

export class ShadowArray {
  static wrap(arr: ShadowedArray, saVal?: any[]): any {
    try {
      Object.defineProperty(arr, 'shadow', {
        writable : true,
        configurable : true,
        enumerable : false,
        value : saVal ? saVal : []
      });
    } catch (e) {
      // the object is frozen, do nothing
    }
  };
}
