/**
 * @param {string} s
 * @return {boolean}
 */
var isValid = function (s) {

  if (s.length % 2 === 1) {
    return false;
  }

  var left = [];

  for (let i = 0; i < s.length; i++) {
    if (s[i] === '(' || s[i] === '{' || s[i] === '[') {
      left.push(s[i]);
    }

    if (s[i] === ')' && left[left.length - 1] === '(') {
      left.pop();
    } else if (s[i] === ']' && left[left.length - 1] === '[') {
      left.pop();
    } else if (s[i] === '}' && left[left.length - 1] === '{') {
      left.pop();
    }else {
      return false;
    }
  }

  if (left.length === 0) {
    return true;
  }

  return false;
};

console.log(isValid("([}}])"));