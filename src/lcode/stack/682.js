/**
 * @param {string[]} ops
 * @return {number}
 */

var calPoints = function (ops) {
  var stack = [];

  for (let i = 0; i < ops.length; i++) {
    let value = ops[i];
    if (value === 'C') {
      stack.pop();
    } else if (value === 'D') {
       let last = stack[stack.length - 1];

       stack.push(last * 2);
    } else if (value === '+') {
        let last = stack[stack.length - 1];

        let lastLast = stack[stack.length - 2];

        stack.push(+last + +lastLast);
    } else {
        stack.push(+value)
    }


  }
  return stack.reduce((pre, cur) => +pre + +cur);
};

console.log(calPoints(["5","2","C","D","+"]))

