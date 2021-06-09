//https://github.com/mqyqingfeng/Blog/issues/22
/**
 *
 * 防抖函数
 *
 * 你尽管触发事件，但是我一定在事件触发 n 秒后才执行，如果你在一个事件触发的 n 秒内又触发了这个事件，那我就以新的事件的时间为准，n 秒后才执行，总之，就是要等你触发完事件 n 秒内不再触发事件
 *
 * 第一版
 *
 * this指向有问题
 *
 *
 * */

function debouce(func, wait) {
  let timeout = null;

  return function () {
    clearTimeout(timeout);
    timeout = setTimeout(func, wait);
  }
}

/**
 * 第二版修复this 指向
 *      修复传参问题
 * */
function debouce(func, wait) {
  let timeout = null;

  return function () {
    const context = this;
    const args = arguments;
    clearTimeout(timeout);

    timeout = setTimeout(function() {
      func.apply(context, args);
    }, wait);
  }
}

/**
 * 立即执行
 *
 * 增加 immidate参数
 *
 * */
function debouce(func, wait, immidate) {
  let timeout = null;


  return function() {
      const context = this;
      const args = arguments;
      clearTimeout(timeout);

      if(immidate) {
         if(!timeout) {
           func.apply(context, args);
         }
          timeout = setTimeout(function() {
            timeout = null;
          })
      }else {
        timeout = setTimeout(function() {
            func.apply(context, args);
        })
      }
  }
}
