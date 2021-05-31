/**
 * @param {string[]} logs
 * @return {number}
 */

// "../"
// "./"
var minOperations = function(logs) {
  var stack = [];

  logs.forEach(item => {
    if(item === '../') {
      stack.pop();
    }else if (item === './') {

    }else {
      stack.push(item);
    }
  });
  return stack.length;
};
