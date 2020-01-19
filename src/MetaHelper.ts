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
 * This file's purpose is to attach in arbitrary objects metadata associated
 * with a particular property. The metadata is stored on the object and it is
 * associated to the property using the property name.
 */
export class Meta {
  public static MAPPING_PROPERTY = "mapping23$^42";

  constructor(public defaultMeta: any) {}

  storeMeta(object: {[index: string]: any}, property: PropertyKey, meta: any) {
    let mapping = object[Meta.MAPPING_PROPERTY];
    if (!mapping) {
      mapping = this.createMappingProperty(object);
    }
    mapping[property] = meta;
  }

  removeMeta(object: {[index: string]: any}, property: PropertyKey, meta: any) {
    let mapping = object[Meta.MAPPING_PROPERTY];
    if (mapping)
      delete mapping[property];
  }

  readMeta(object: {[index: string]: any}, property: PropertyKey) {
    let metaReference = this.defaultMeta;
    try {
      let mappingRefObj = object[Meta.MAPPING_PROPERTY];
      if (mappingRefObj && mappingRefObj[property]) {
        metaReference = mappingRefObj[property];
      }
    } catch (e) {
      console.log(`readMeta of property ${
          property.toString()} failed. Returning default metaReference`);
    }
    return metaReference;
  }

  createMappingProperty(object: {[index: string]: any}) {
    try {
      Object.defineProperty(object, Meta.MAPPING_PROPERTY,
                            {enumerable : false, writable : true});
      object[Meta.MAPPING_PROPERTY] = Object.create(null);
      return object[Meta.MAPPING_PROPERTY];
    } catch (e) {
      // the object is not writable
      return {};
    }
  }
}
