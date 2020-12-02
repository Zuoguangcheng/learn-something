/**
 * @fileoverview 
 * @author liuduan
 * @Date 2020-06-09 11:16:00
 * @LastEditTime 2020-06-09 15:04:40
 */
export default function compose(...funcs) {
  if (funcs.length === 0) {
    return arg => arg;
  }

  if (funcs.length === 1) {
    return funcs[0];
  }

  return funcs.reduce((a, b) => (...args) => a(b(...args)))
}

/* 测试demo */
var a = function (next) {
  console.log('a...');
  return (action) => {
    console.log('a-start');
    console.log('a', next.toString());
    next(action);
    console.log('a-end');
  }
}

var b = function (next) {
  console.log('b...');
  return (action) => {
    console.log('b-start');
    console.log('b', next.toString());
    next(action);
    console.log('b-end');
  }
}

var c = function (next) {
  console.log('c...');
  return (action) => {
    console.log('c-start');
    console.log('c', next.toString());
    next(action);
    console.log('c-end');
  }
}

var funcs = [a, b, c];

var f = funcs.reduce((f1, f2) => {
  return (...args) => f1(f2(...args));
});

// f 相当于：(...args) => a(b(c(...args)));

const dispatch = () => {
  console.log('dispatch');
}
// console.log(f(dispatch)());