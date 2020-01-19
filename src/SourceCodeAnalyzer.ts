import parser = require("acorn");
import estraverse = require("estraverse");
import fs = require("fs");
import path_m = require("path");
import {CodeSnippetLocation} from "../types/Jalangi";

/**
 * Copyright 2019 Software Lab, TU Darmstadt, Germany
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
 * Created by Cristian-Alexandru Staicu on 2.07.19.
 *
 * This file's purpose is to attach in arbitrary objects metadata associated
 * with a particular property. The metadata is stored on the object and it is
 * associated to the property using the property name.
 */
export class CodeAnalyzer {

  private cache: {[index: string]: any} = {};

  constructor() {}

  private parseScript(path: string): any {
    if (!this.cache.hasOwnProperty(path)) {
      try {
        let newPath = path;
        if (process.env.LIBRARY_ROOT_PATH)
          newPath = path_m.resolve(process.env.LIBRARY_ROOT_PATH, path);
        let fileContent: string = fs.readFileSync(newPath).toString();
        this.cache[path] = parser.parse(fileContent, { locations: true });
        let cacheEntry: any = this.cache[path];
        cacheEntry.locToObj = {};
        this.traverseAndIndexByLocation(
          cacheEntry,
          cacheEntry.locToObj);
      } catch (e) {
        console.log("Unable to parse script: " + path)
      }
    }
    return this.cache[path];
  }

  private traverseAndIndexByLocation(tree: any, locToObj: any) {
    estraverse.traverse(tree, {
      enter: function (node, parent) {
        //@ts-ignore
        node.parent = parent;
        let locAsString = JSON.stringify(node.loc);
        locToObj[locAsString] = node;
      }
    });
  }

  resolve(scriptPath: string, loc: CodeSnippetLocation): any {
    let parsedTree: {locToObj: {[index: string]: object}}
      = this.parseScript(scriptPath);
    //TODO investigate this off-by-one error
    loc.start.column--;
    let locAsString: string = JSON.stringify(loc);
    loc.start.column++;
    if (parsedTree && parsedTree.locToObj[locAsString])
      return parsedTree.locToObj[locAsString];
    else
      return null;
  }

  isComputedWrite(node: any): boolean {
    try {
      if (node.left.computed === false)
        return false;
      if (node.left.property.type === "Literal")
        return false;
    } catch(e) {
      //best effort
    }
    return true;
  }

  isComputedRead(node: any): boolean {
    try {
      if (node.computed === false)
        return false;
      if (node.property.type === "Literal")
        return false;
    } catch(e) {
      //best effort
    }
    return true;
  }

  isSelfIncrement(node: any): boolean {
    try {
      if (node.type === "UpdateExpression" && node.operator === "++")
        return true;
    } catch(e) {
      //best effort
    }
    return false;
  }

  isPrefixOp(node: any): boolean {
    try {
      if (node.prefix)
        return true;
    } catch(e) {
      //best effort
    }
    return false;
  }

  isInForIn(node: any): boolean {
    try {
      //@ts-ignore
      if (node.type === "ForInStatement")
        return true;
      //@ts-ignore
      if (node.parent.type === "ForInStatement")
        return true;
      /* the common case: with an ExpressionStatement + a VariableDeclarator */
      if (node.parent.parent.parent.type === "ForInStatement")
        return true;
      //@ts-ignore
      if (node.parent.parent.type === "ForInStatement")
        return true;
    } catch(e) {
      //best effort
    }
    return false;

  }

}


