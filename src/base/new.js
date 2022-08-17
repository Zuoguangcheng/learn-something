/**
 * new 操作符
 * */


function objectFactory(Parent, ...res) {

  var obj = {}; // 穿件一个新的对象

  obj.__proto__ = Parent.prototype; // 将新对象的原型指向构造函数的原型对象

  var result = Parent.call(obj, ...res); // 执行构造函数，绑定this的值到新生成的对象

  return typeof result  === 'object' ? result : obj; // 如果构造函数返回对象 则返回构造函数的返回对象，否则返回这个新生成的对象
}




function myNew(parent, ...res) {
  let obj = {};

  obj.__proto__ = parent.prototype;


  const result = parent.call(obj, ...res);


  return typeof result === 'object' ? result : obj;
}

