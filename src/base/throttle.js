// https://github.com/mqyqingfeng/Blog/issues/26

/**
 * 使用时间戳
 *  第一次立即执行，停止操作后 没办法执行最后一次
 *
 * */

function throttle(func, wait) {
  let preview = 0;

  return function () {
      const context = this;
      const args = arguments;
      const now = +new Date();

      if(now - preview > wait) {
        func.apply(context, args);
        preview = now;
      }
  }
}

/**
 * 使用定时器
 *  第一次是wait后执行，停止操作后会再执行一次
 *
 * */

function throttle(func, wait) {
    let timer = null;

    return function () {
      const context = this;
      const args = arguments;

      if(!timer) {
        timer = setTimeout(function() {
          func.apply(context, args);
          timer = null;
        }, wait)
      }
    }
}

/**
 * 可以将两者结合下，
 *
 * */


