// https://mp.weixin.qq.com/s/qdJ0Xd8zTgtetFdlJL3P1g

// 判断是否为函数
const isFunction = (obj) => {
    return typeof obj === 'function';
  };
  
  // 判断是否为对象
  const isObject = (obj) => {
    return !!(obj && typeof obj === 'object');
  };
  
  // 判断是否为 thenable
  const isThenable = (obj) => {
    return (
      isFunction(obj)
      || isObject(obj)
    ) && 'then' in obj;
  };
  
  // 判断是否为 Promise
  const isPromise = (promise) => {
    return promise instanceof JsliangPromise;
  };



// promise 有 3 个状态，分别是 pending, fulfilled 和 rejected。
const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

const resolvePromise = (promise, result, resovle, reject) => {
    if (result === promise) {
        let reason = new TypeError('can not fufill promise with itself')
        return reject(reason);
    }

    if (isPromise(result)) {
        return result.then(resovle, reject);
    }

    if (isThenable(result)) {
        try {
            let then = result.then;

            if (isFunction(then)) {
                return new Promise(then.bind(result)).then(resolve, reject)
            }
        } catch (error) {
            return reject(error)
        }
    }

    resovle(result);
}


function Promise(f) {
    this.state = PENDING;
    this.result = null;

    this.callbacks = [];

    let onFulfilled = value => transition(this, FULFILLED, value);
    let onRejected = reason => transition(this, REJECTED, reason);

    let ignore = false;

    let resolve = value => {
        if (ignore) return;
        ignore = true;

        resolvePromise(this, value, onFulfilled, onRejected)
    }

    let reject = reason => {
        if (ignore) return;
        ignore = true;

        onRejected(reason);
    }


    try {
        f(resovle, reject)
    } catch (error) {
        reject(error);
    }
}


/**
 * 在 pending 状态，promise 可以切换到 fulfilled 或 rejected。
 * 在 fulfilled 状态，不能迁移到其它状态，必须有个不可变的 value。
 * 在 rejected 状态，不能迁移到其它状态，必须有个不可变的 reason。
 * 
 * @param {*} promise 
 * @param {*} state 
 * @param {*} result 
 */
const transition = (promise, state, result) => {
    if (promise.state !== PENDING) {
        return
    }

    promise.state = state;
    promise.result = result;
}

/**
 * 
 * handleCallback 函数，根据 state 状态，判断是走 fulfilled 路径，还是 rejected 路径。
 * 先判断 onFulfilled/onRejected 是否是函数，如果是，以它们的返回值，作为下一个 promise 的 result。
 * 如果不是，直接以当前 promise 的 result 作为下一个 promise 的 result。
 * 如果 onFulfilled/onRejected 执行过程中抛错，那这个错误，作为下一个 promise 的 rejected reason 来用。
 * then 方法核心用途是，构造下一个 promise 的 result。
 * 
 * @param {*} callback 
 * @param {*} state 
 * @param {*} result 
 */
const handleCallback = (callback, state, result) => {
    let {
        onFulfilled,
        onRejected,
        resolve,
        reject
    } = callback;

    try {
        if (state === FULFILLED) {
            isFunction(onFulfilled) ? resolve(onFulfilled(result)) : resolve(result)
        } else if (state === REJECTED) {
            isFunction(onRejected) ? resolve(onRejected(result)) : reject(result);
        }
    } catch (error) {
        reject(error);
    }
}

/**
 * promise 必须有 then 方法，接受 onFulfilled 和 onRejected 参数。
 * then 方法必须返回 promise。
 * 
 * @param {*} onFulfilled 
 * @param {*} onRejected 
 */
Promise.prototype.then = function (onFulfilled, onRejected) {
    return new Promise((resolve, reject) => {
        let callback = {
            onFulfilled,
            onRejected,
            resolve,
            reject
        };

        if (this.state === PENDING) {
            this.callbacks.push(callback)
        } else {
            setTimeout(() => handleCallback(callback, this.state, this.result), 0);
        }
    })
}


