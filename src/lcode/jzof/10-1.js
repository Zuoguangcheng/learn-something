/**
 * @param {number} n
 * @return {number}
 */


var map = new Map();

var fib = function(n) {
  if(n === 0) {
    return 0
  }

  if(n === 1) {
    return 1;
  }

  if(map[n]) {
    return map[n];
  }

  const value = fib(n - 1) + fib(n - 2);
  map[n] = value;

  return value;
};
