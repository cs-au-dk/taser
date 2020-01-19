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
 * This file manages the taint levels available. By default there are only
 * two taint levels: HIGH and LOW, but in the future the policy may add
 * additional taint levels.
 */
import {Label, LabelOps} from "./Labels";

function addSource(sourceFunc: Function, label: any, sourceID: any) {
  return sourceFunc;
}

function addSink(sinkFunc: Function, sinkID: any, queryID: string,
                 argSpecs?: (boolean|((args: any[]) => boolean))[]) {
  return sinkFunc;
}

function sink(value: any) {
  return value;
}

function source(value: any, label: Label, sourceID: any) {
  return value;
}

function dumpStack() {}

function isTainted(value: any): {tainted: boolean} {
  return {tainted: false};
}

function declassify(value: any, ap: string) {
  return value;
}

export class PolicyHelper {
  static LOW_LEVEL = Label.LOW_LEVEL;
  static HIGH_LEVEL = Label.HIGH_LEVEL;
  static sink = sink;
  static source = source;
  static addSource = addSource;
  static addSink = addSink;
  static addLabel = LabelOps.addLabel;
  static addLabelIfNotExists = LabelOps.addLabelIfNotExists;
  static dumpStack = dumpStack;
  static isTainted = isTainted;
  static declassify = declassify;
}

