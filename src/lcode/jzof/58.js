/**
 * @param {string} s
 * @param {number} n
 * @return {string}
 */
var reverseLeftWords = function(s, n) {
    if(!s) {
      return '';
    }

    var left = s.substring(0, n);
    var right = s.substring(n, s.length);

    return right + left;
};
