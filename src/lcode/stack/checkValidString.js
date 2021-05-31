// 有效括号
/**
 * 
 */

/**
 * @param {string} s
 * @return {boolean}
 */



var Stack = function () {
  this.ak = [];
}

Stack.prototype.push = function (str) {
  this.ak.push(str);
}

Stack.prototype.pop = function () {
  return this.ak.pop();
}

Stack.prototype.size = function () {
  return this.ak.length;
}

Stack.prototype.peek = function () {
  return this.ak[this.ak.length - 1];
}



var checkValidString = function (s) {
  var leftStack = new Stack();
  var starStack = new Stack();

  for (let k = 0; k < s.length; k++) {

    let i = s[k];
    if(i === '(' || i === '（') {
      leftStack.push(k);
    }

    if(i === '*') {
      starStack.push(k);
    }

    if (i === ')' || i === '）') {
      if (leftStack.size()) {
        leftStack.pop();
      } else if (starStack.size()) {
        starStack.pop();
      }else {
        return false;
      }
    }
  }
  console.log('leftStack', leftStack.ak);
  console.log('starStack', starStack.ak);
  while(leftStack.size() && starStack.size()) {
      if(starStack.peek() < leftStack.peek()) {
        return false;
      }

      leftStack.pop();
      starStack.pop();
  }

  return leftStack.size() === 0;
};

console.log(checkValidString("(((((*(()((((*((**(((()()*)()()()*((((**)())*)*)))))))(())(()))())((*()()(((()((()*(())*(()**)()(())"))
console.log(checkValidString("((((()(()()()*()(((((*)()*(**(())))))(())()())(((())())())))))))(((((())*)))()))(()((*()*(*)))(*)()"))