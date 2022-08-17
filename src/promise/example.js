// https://blog.csdn.net/qq_42033567/article/details/108129645

// 1.
//   const promise = new Promise((resolve, reject) => {
//     console.log(1);
//     console.log(2);
//   });
//
//   promise.then(() => {
//     console.log(3);
//   });
//
//   console.log(4);
// 最后应该输出1 2 4。这样最主要的就是3，要知道promise.then是微任务，会在所有的宏任务执行完之后才会执行，同时需要promise内部的状态发生变化，因为这里内部没有发生变化，所以不输出3。



// 2.
// const promise1 = new Promise((resolve, reject) => {
//   console.log('promise1')
//   resolve('resolve1')
// })
// const promise2 = promise1.then(res => {
//   console.log(res)
// })
// console.log('1', promise1);
// console.log('2', promise2);

// 'promise1'
// '1' Promise{<resolved>: 'resolve1'}
// '2' Promise{<pending>}
// 'resolve1'

// script是一个宏任务，按照顺序执行这些代码
// 首先进入Promise，执行该构造函数中的代码，打印promise1
// 碰到resolve函数, 将promise1的状态改变为resolved, 并将结果保存下来
// 碰到promise1.then这个微任务，将它放入微任务队列
// promise2是一个新的状态为pending的Promise
// 执行同步代码1， 同时打印出promise1的状态是resolved
// 执行同步代码2，同时打印出promise2的状态是pending
// 宏任务执行完毕，查找微任务队列，发现promise1.then这个微任务且状态为resolved，执行它。



// 3.
// const promise = new Promise((resolve, reject) => {
//   console.log(1);
//
//   setTimeout(() => {
//     console.log("timerStart");
//     resolve("success");
//     console.log("timerEnd");
//   }, 0);
//
//   console.log(2);
// });
// promise.then((res) => {
//   console.log(res);
// });
//
// console.log(4);

// 1
// 2
// 4
// timerStart
// timerEnd
// success

// 首先遇到Promise构造函数，会先执行里面的内容，打印1
// 遇到steTimeout，它是一个宏任务，被推入宏任务队列
// 接下继续执行，打印出2
// 由于Promise的状态此时还是pending，所以promise.then先不执行
// 继续执行下面的同步任务，打印出4
// 微任务队列此时没有任务，继续执行下一轮宏任务，执行steTimeout
// 首先执行timerStart，然后遇到了resolve，将promise的状态改为resolved且保存结果并将之前的promise.then推入微任务队列，再执行timerEnd
// 执行完这个宏任务，就去执行微任务promise.then，打印出resolve的结果




// 4.
// Promise.resolve().then(() => {
//   console.log('promise1');
//   const timer2 = setTimeout(() => {
//     console.log('timer2')
//   }, 0)
// });
//
// const timer1 = setTimeout(() => {
//   console.log('timer1')
//   Promise.resolve().then(() => {
//     console.log('promise2')
//   })
// }, 0)
//
// console.log('start');

// todo 为什么promise2在timer2前面打印
// todo 大概的解释是 当前宏任务下生成的微任务 执行是优先于其他的宏任务的。 自己总结的 不知道正确与否
// start
// promise1
// timer1
// promise2
// timer2


// 首先，Promise.resolve().then是一个微任务，加入微任务队列
// 执行timer1，它是一个宏任务，加入宏任务队列
// 继续执行下面的同步代码，打印出start
// 这样第一轮的宏任务就执行完了，开始执行微任务，打印出promise1
// 遇到timer2，它是一个宏任务，将其加入宏任务队列
// 这样第一轮的微任务就执行完了，开始执行第二轮宏任务，指执行定时器timer1,打印timer1
// 遇到Promise，它是一个微任务，加入微任务队列
// 开始执行微任务队列中的任务，打印promise2
// 最后执行宏任务timer2定时器，打印出timer2


// 5.

// const promise = new Promise((resolve, reject) => {
//   resolve('success1');
//   reject('error');
//   resolve('success2');
// });
// promise.then((res) => {
//   console.log('then:', res);
// }).catch((err) => {
//   console.log('catch:', err);
// })

// then: success1


// 6.
// Promise.resolve(1)
//   .then(2)
//   .then(Promise.resolve(3))
//   .then(console.log)

// 1

// Promise.resolve方法的参数如果是一个原始值，或者是一个不具有then方法的对象，则Promise.resolve方法返回一个新的Promise对象，状态为resolved，Promise.resolve方法的参数，会同时传给回调函数。
// then方法接受的参数是函数，而如果传递的并非是一个函数，它实际上会将其解释为then(null)，这就会导致前一个Promise的结果会传递下面。


// 7.


/*const promise1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('success')
  }, 1000)
})
const promise2 = promise1.then(() => {
  throw new Error('error!!!')
})
console.log('promise1', promise1)
console.log('promise2', promise2)
setTimeout(() => {
  console.log('promise1', promise1)
  console.log('promise2', promise2)
}, 2000)*/


/*async function async1() {
  await Promise.reject('error').catch(e => console.log('e', e));
  await Promise.resolve('1').then(res => {console.log('res', res); return 2}).then(res => console.log('res1', res))
  console.log('async1');
  return Promise.resolve('async success')
}

async1().then(res => console.log('res'));
console.log('script start')*/



/*new Promise((resolve, reject) => {
  reject(1)
}).catch(error => {
  console.log('error', error);
  return 2
}).finally(res => {
  console.log('finally', res);
  return 3
}).then(res => console.log('res', res))*/





