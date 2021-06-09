/*
function* example() {
  yield 1;
  yield 2;
  yield 3;
}

var iter = example();

var one = iter.next(); //{value:1，done:false}
var two = iter.next(); //{value:2，done:false}
var three = example().next();  //{value:1，done:false}

console.log('one', one.value);
console.log('two', two.value);
console.log('three', three.value);

*/
/*
function * abc() {
  let a = yield 1;
  console.log(a);
  let b = yield 2;
  console.log(b);
}

let it1 = abc();

console.log(it1.next());
console.log(it1.next());
console.log(it1.next());*/

let fs = require("fs");
//这个函数的目的是想拿到文件的内容（假设文件名是未知，从服务器请求来的）
function* getData() {
  try {
    let fileName = yield new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve("name.txt"); // 假设有这么一个文件
      }, 1500);
    });
    let data = yield new Promise((resolve, reject) => {
      fs.readFile(fileName, "utf8", (err, data) => {
        resolve(data);
      });
    });

    console.log('data', data);
    return data;
  } catch (ex) {
    console.log(ex);
  }
}

let it = getData();   //生成迭代器
/*let { value } = it.next();  // 遇到第一个yield，停止，返回一个对象{value: promise, done: false}


value.then(data => {
  let { value } = it.next(data);  // 将promise成功的返回结果赋给fileName
  value.then(data => {
    let result = it.next(data);  // 读完文件后，将内容赋值给data
    return result;
  });
});*/

function co(it) {
  return new Promise((resove, reject) => {
      function next(data) {
          let { value, done } = it.next(data);

          if(done) {
            resove(value);
          }else {
            Promise.resolve(value).then((res) => {
              next(res);
            }).catch(err => {
              it.throw(err);
            })
          }
      }

      next();
  })
}
co(it).then(res => {
  console.log('res', res);
});

