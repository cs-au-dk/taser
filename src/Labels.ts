import _ = require("lodash");
import {PolicyHelper} from "./PolicyHelper";
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
let labelsToId: {[index: string]: Label} = {};
let idToLabel: {[index: number]: string} = {};
let counter: number = 2;

export class Label {

  private static NUMBER_BYTES = 32;
  private representation: number[] = [];
  private dynComputed: boolean = false;

  public static LOW_LEVEL = new Label(0);
  public static HIGH_LEVEL = new Label(1);

  constructor(num: number) {
    if (num === 0)
      return;
    let indexOfInterest: number = Math.floor(num / Label.NUMBER_BYTES);
    let reminder: number = num % Label.NUMBER_BYTES;
    for (let i = 0; i < indexOfInterest; i++)
      this.representation[i] = 0;
    this.representation[indexOfInterest] = 1 << reminder;
  }

  public equals(other: Label) {
    if (this.representation.length != other.representation.length)
      return false;
    for (let i = 0; i < this.representation.length; i++)
      if (this.representation[i] != other.representation[i])
        return false;
    return true;
  }

  public setDynComputed(val: boolean) {
    this.dynComputed = val;
  }

  public isDynComputed(): boolean {
    return this.dynComputed;
  }

  public intersect(other: Label): Label {
    let result = new Label(0);
    if (!other) {
      for (let i = 0; i < this.representation.length; i++) {
        result.representation[i] = this.representation[i];
      }
      return result;
    }
    let max: number = this.representation.length;
    if (other.representation.length > max)
      max = other.representation.length;
    for (let i = 0; i < max; i++) {
      result.representation[i] =
        this.representation[i] | other.representation[i];
    }
    return result;
  }

  public asIndieces(): number[] {
    let res: number[] = [];
    for (let i = 0; i < this.representation.length; i++) {
      let bitIndex: number = 1;
      let counter: number = 0;
      do {
        if (this.representation[i] & bitIndex)
          res.push(i * Label.NUMBER_BYTES + counter);
        bitIndex = bitIndex << 1;
        counter++;
      } while (counter < Label.NUMBER_BYTES);
    }
    return res;
  }

  public toString() {
    return "taint=" + this.representation[0];
  }

}

export class LabelOps {

  static isTainted(label: Label): boolean {
    return label && (label instanceof Label)
      && !Label.LOW_LEVEL.equals(label);
  }

  static aggregate(label1: Label, label2: Label): Label {
    let newLabelVal: Label = new Label(0);
    if (!this.isTainted(label1) && !this.isTainted(label2))
      return newLabelVal;
    if (!this.isTainted(label1)) {
      return newLabelVal.intersect(label2);
    }
    if (!this.isTainted(label2)) {
      return newLabelVal.intersect(label1);
    }
    return label1.intersect(label2);
  }

  static declassify(label: Label, labelSubstr: string): Label {
    if (!this.isTainted(label))
      return label;
    let res = new Label(0);
    let names: string[] = this.getLabelNamesFromLabel(label);
    for (let i = 0; i < names.length; i++)
      if (names[i].indexOf(labelSubstr) === -1)
        res = res.intersect(labelsToId[names[i]]);
    res.setDynComputed(label.isDynComputed());
    return res;
  }

  static addLabel(label: string): Label {
    let res: Label = new Label(counter);
    labelsToId[label] = res;
    idToLabel[counter] = label;
    counter++;
    return res;
  }

  static addLabelIfNotExists(label: string): Label {
    if (labelsToId[label])
      return labelsToId[label];
    else
      return LabelOps.addLabel(label);
  }

  static getLabelNamesFromLabel(label: Label): string[] {
    let labels: string[] = [];
    let indices: number[] = label.asIndieces();
    for (let i = 0; i < indices.length; i++) {
      labels.push(idToLabel[indices[i]])
    }
    return labels;
  }

  static wrapFieldAccess(label: Label, field: string, isComp: boolean): Label {
    let labels: string[] = LabelOps.getLabelNamesFromLabel(label);
    var newLabelVal: Label = new Label(0);
    for (let i = 0; i < labels.length; i++) {
      let newLabel;
      try {
        if (isComp)
          newLabel = `(member * ${labels[i]})`;
        else
          newLabel = `(member ${field} ${labels[i]})`;
      } catch (e) {
        newLabel = `(member symbol ${labels[i]})`;
      }
      if (!labelsToId[newLabel])
        newLabelVal = newLabelVal.intersect(LabelOps.addLabel(newLabel));
      else
        newLabelVal = newLabelVal.intersect(labelsToId[newLabel]);

      //console.log(labelsToId[newLabel] + " " + LabelOps.addLabel(newLabel)
      // + " " + newLabelVal)
    }
    return newLabelVal;
  }
}
