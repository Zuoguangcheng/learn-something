/**
 * @param {number[]} target
 * @param {number} n
 * @return {string[]}
 */
var buildArray = function(target, n) {
  let targetIndex = 0;
  let returnAction = [];

  for(let i = 1; i <= n; i++) {
    if(targetIndex === target.length) {
      return returnAction;
    }
    if(target[targetIndex] === i) {
      returnAction.push('Push');
      targetIndex++;
    }else {
      returnAction.push('Push');
      returnAction.push('Pop');
    }
  }

  return returnAction;
};
