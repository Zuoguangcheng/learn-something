/**
 * @param {string} s
 * @return {string}
 */
var makeGood = function(s) {
  var stack = [];

  for(let i = 0; i < s.length; i++) {
    if(stack.length === 0 || Math.abs(stack[stack.length - 1].charCodeAt() - s[i].charCodeAt()) !== 32) {
      stack.push(s[i]);
    }else {
      stack.pop();
    }
  }

  return stack.join('');
};
