const lodash = require('lodash');

const sum = lodash.reduce([1, 2, 3, 4], (acc, nxt) => acc + nxt, 0); 

console.log(sum);
