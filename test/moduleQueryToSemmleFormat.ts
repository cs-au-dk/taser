import {assert} from 'chai';

import {toSemmleFormat, toSemmleFormatLibraryTest} from "../src/toSemmleFormat";

describe('toSemmleFormat', function() {
  describe('toSemmleFormatLibraryClientTests', function() {
    it('should transform relative paths to semmleFormat', function() {
      assert.equal(
          toSemmleFormat('./lib/express',
                         '/root/node_modules/express/lib/index.js', 'express'),
          '(root https://www.npmjs.com/package/express/lib/index.js)',
          'incorrect submodule resolution');
    });

    it('should transform absolute paths to semmleFormat', function() {
      assert.equal(
          toSemmleFormat('/foo/bar/baz/express/lib/index.js',
                         '/foo/bar/baz/express/lib/index.js', 'express'),
          '(root https://www.npmjs.com/package/express/lib/index.js)',
          'incorrect submodule resolution');
    });

    it('should not transform library names', function() {
      assert.equal(
          toSemmleFormat('express', '/root/node_modules/express/lib/index.js',
                         'express'),
          '(root https://www.npmjs.com/package/express)',
          'incorrect submodule resolution');
    });
  });
  describe('toSemmleFormatLibraryTest', function() {
    it('should transform the main module to the library name itself',
       function() {
         assert.equal(
             toSemmleFormatLibraryTest('/root/lodash/index.js', '/root/lodash/',
                                       '/root/lodash/index.js', 'lodash'),
             '(root https://www.npmjs.com/package/lodash)',
             'incorrect module path');
       });

    it('should transform submodules to submodules relative to the library name',
       function() {
         assert.equal(
             toSemmleFormatLibraryTest('/root/lodash/util/map.js', '/root/lodash/',
                                       '/root/lodash/index.js', 'lodash'),
             '(root https://www.npmjs.com/package/lodash/util/map)',
             'incorrect module path');
       });
  });
});
