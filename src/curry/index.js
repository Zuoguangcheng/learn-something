/* 
支持这几种写法的一个函数

add(1, 2, 3);
add(1, 2)(3);
add(1)(2, 3);

无限支持
*/

function addThree(...args) {
  return args.reduce((pre, cur) => {
    return pre + cur
  })
}

const curry = (fn, ctx) => (...args) => {
  //  计算当前的结果 因为返回的是function ,因此可以无限调用
  //  重点是当前的计算结果怎么返回，这里是在返回的函数中增加变量返回

  const one = fn.call(ctx, ...args);
  const nextFn = (..._args) => curry(fn, ctx)(...args, ..._args);

  nextFn.value = one;
  return nextFn;
}

const add = curry(addThree);

const add123 = add(1, 2, 3);

const add4 = add123(4)(5);

console.log(add4.value);