/**
 * @param {string} S
 * @return {string}
 */
var removeDuplicates = function(S) {
  var stack = [];

  for(let i = 0; i < S.length; i++) {
    if(stack[stack.length - 1] !== S[i]) {
      stack.push(S[i]);
    }else {
      stack.pop();
    }
  }

  return stack.toString().replace(/,/g, '');
};
