
function f1() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('11111');
    }, 1000)
  })
}
function f2() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('22222');
    }, 2000)
  })
}
function f3() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('33333');
    }, 3000)
  })
}
function f4() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('44444');
    }, 4000)
  })
}

function f5() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('55555');
    }, 5000)
  })
}




const requestQueue = [f1, f2, f3, f4, f5];


function requests(queue) {
  let index = 2;

  const go = (fn) => {
    console.log('fn', fn);
    fn().then(res => {
      console.log('res', res);
      index++;
      if (index >= queue.length) {
        return;
      }
      go(queue[index]);
    })
  }


  for (let i = 0; i <= index; i++) {
    go(queue[i]);
  }


}

requests(requestQueue);

