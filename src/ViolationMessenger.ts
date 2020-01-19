import {Jalangi} from "../types/Jalangi";
import * as fs from "fs";
import {TaintModel} from "./TaintModel";

export class ViolationMessenger {
  constructor(private jalangi: Jalangi,
              private analysisResults: TaintModel,
              private printViolations: boolean) {}

  reportStackValueInvarintViolation(msg: string, type: string,
                                    operation: string, iid: number) {
    const violation = `Invarint violation\n\tMessage: ${msg}\n\tType: ${
        type}\n\tOperation(Location): ${operation}${
        this.jalangi.iidToLocation(this.jalangi.getGlobalIID(iid))}`;
    this.analysisResults.stackInvariants.push(violation);
    this.printViolations && console.log(violation);
  }

  reportStackMiss(expected: any, found: any, operation: string, iid: number) {
    try {
      const violation = `Stack miss\n\tExpected: ${expected}\n\tFound: ${
        found}\n\tOperation(Location): ${operation}${this.loc(iid)}`;
      this.printViolations && console.log(violation);
    } catch (e) {
      this.printViolations && console.log("Stack miss. Additional info could not be printed.");
      this.printViolations && console.log(e);
    }
  }

  private loc(iid: number): string {
    return this.jalangi.iidToLocation(this.jalangi.getGlobalIID(iid))
  }

}
