/**
 * @param {number} n
 * @return {number}
 */
var numWays = function(n) {
    if(!n) {
      return 1
    }

    let map = new Map();

    function loop(n) {
      if(n === 1) {
        return 1
      }

      if(n === 2) {
        return 2
      }

      if(map.has(n)) {
        return map.get(n);
      }

      const value = (loop(n - 1) + loop(n - 2)) % 1000000007;

      map.set(n, value);

      return value;
    }
    return loop(n);
};
