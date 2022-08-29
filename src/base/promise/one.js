const PENDING = 'pending';
const RESOLVED = 'resolved';
const REJECTED = 'rejected';

function myPromise(fn) {
    const that = this;
    that.status = PENDING;
    that.value = null;
    that.reason = null;

    that.resolvedCallbacks = [];
    that.rejectedCallbacks = [];

    function resolve(value) {
        if (that.status === PENDING) {
            that.status = RESOLVED;
            that.value = value;
            that.resolvedCallbacks.map(cb => cb(value));
        }
    }

    function reject(reason) {
        if (that.status === PENDING) {
            that.status = REJECTED;
            that.reason = reason;
            that.rejectedCallbacks.map(cb => cb(reason));
        }
    }

    try {
        fn(resolve, reject);
    } catch (e) {
        reject(e);
    }
}

myPromise.prototype.then = function (onFullfilled, onRejected) {
    const that = this;
    console.log('=======');
    if (that.status === PENDING) {
        that.resolvedCallbacks.push(onFullfilled);
        that.rejectedCallbacks.push(onRejected);
    }

    if (that.status === RESOLVED) {
        onFullfilled(that.value);
    }

    if (that.status === REJECTED) {
        onFullfilled(that.reason);
    }

    return that;
}

const p = new myPromise((resolve, reject) => {
    setTimeout(() => {
        resolve(1000);
    }, 1000);
});



p.then((res) => {
    console.log('结果：', res); // 结果：1000
}).then(() => {
    console.log('jsliang'); // jsliang
})



















const PENDING = 'pending';
const RESOLVE = 'resolve';
const REJECT = 'reject';


function myPromise(fn) {
  const that = this;
  that.status = PENDING;
  that.value = '';
  that.reason = '';

  that.resolveCbList = [];
  that.rejectCbList = [];

  function resolveFn(value) {
    if(that.status === PENDING) {
      that.status = RESOLVED;
      that.value = value;
      that.resolveCbList.forEach(cb => {
        that.value = cb(that.value)
      })
    }
  }

  function rejectFn(value) {
    if(that.status === PENDING) {
      that.status = RESOLVED;
      that.value = value;
      that.resolveCbList.forEach(cb => cb(value))
    }
  }

  try {
    fn(resolveFn, rejectFn);
  }catch (e) {
    rejectFn(e);
  }
}

myPromise.prototype.then = function (onResolve, onReject) {
  const that = this;
  if(that.status === PENDING) {
    that.resolveCbList.push(onResolve);
    that.rejectCbList.push(onReject);
  }

  if(that.status === REJECT) {
    onReject(that.reason);
  }

  if(that.status === RESOLVE) {
    onResolve(that.value);
  }

  return that;
}

