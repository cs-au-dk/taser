export interface Sink {
  accessPath: string
  sinkID: string
  queryID: string
}

export interface Propagation {
  entry: string
  exit: string
  queryID: string
}

export class TaintModel {
  public additionalSinks: Sink[] = [];
  public propagations: Propagation[] = [];
  public stackInvariants: string[] = [];

  public taintStackMisses: number;
  public taintStackTotal: number;
  public semmleCompatibleAdditionalSinks: string;
  public semmleCompatiblePropagations: string;

  public toJson() {
    let res: any = {};
    res.class = "TaintModel";
    res.sinks = this.additionalSinks;
    res.taintStackMisses = this.taintStackMisses;
    res.taintStackTotal = this.taintStackTotal;
    res.stackInvariants = this.stackInvariants;
    res.semmleCompatibleAdditionalSinks = prettyPrintSinks(this.additionalSinks);
    res.semmleCompatiblePropagations = prettyPrintProps(this.propagations)
    res.propagations = this.propagations;
    return res;
  }
}

function prettyPrintSinks(additionalSinks: Sink[]): string {
  var res = "";
  for (let i = 0; i < additionalSinks.length; i++) {
    res += "| " + additionalSinks[i].accessPath + " | taint | "
        + additionalSinks[i].queryID + " |\n";
  }
  return res;
}

function prettyPrintProps(propagations: Propagation[]): string {
  var res = "";
  for (let i = 0; i < propagations.length; i++) {
    res += "| " + propagations[i].entry + " | taint | "
        + propagations[i].exit + " | taint | "
        + propagations[i].queryID + " |\n";
  }
  return res;
}
