// https://leetcode-cn.com/problems/basic-calculator

/**
 * 给你一个字符串表达式 s ，请你实现一个基本计算器来计算并返回它的值。
 *
 * 示例 1：
 *
 * 输入：s = "1 + 1"
 * 输出：2
 * 示例 2：
 *
 * 输入：s = " 2-1 + 2 "
 * 输出：3
 * 示例 3：
 *
 * 输入：s = "(1+(4+5+2)-3)+(6+8)"
 * 输出：23
 * 提示：
 *
 * 1 <= s.length <= 3 * 105
 * s 由数字、'+'、'-'、'('、')'、和 ' ' 组成
 * s 表示一个有效的表达式
 * */


function isNumber(str) {
  return !isNaN(Number(str));
}

const stack = [];

function strCalculator(str) {
  let sum = 0;
  let tempC = '';
  let sign = 1;
  for(let i = 0; i < str.length; i++) {
    if(isNumber(str[i])) {
      if(isNumber(str[i + 1])) {
        tempC += str[i];
      }else {
        tempC += str[i];
        sum = sum + sign * Number(tempC);
        tempC = '';
      }
    }else if(str[i] === '+') {
      sign = 1;
    }else if(str[i] === '-') {
      sign = -1;
    }else if(str[i] === '(') {
      stack.push(sum);
      stack.push(sign);
      sum = 0;
      sign=1;
    }else if(str[i] === ')') {
      const curSign = stack.pop();
      const curSum = stack.pop();

      sum = curSum + curSign * sum;
    }
  }

  return sum;
}

const result = strCalculator('11+21+(1-(1+1))')
console.log(result);
