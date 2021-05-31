/*
*
* 首先必须要说的是，this的指向在函数定义的时候是确定不了的，只有函数执行的时候才能确定this到底指向谁。
* 实际上this的最终指向的是那个调用它的对象
*
* (这句话有些问题，后面会解释为什么会有问题，虽然网上大部分的文章都是这样说的，虽然在很多情况下那样去理解不会出什么问题，
*   但是实际上那样理解是不准确的，所以在你理解this的时候会有种琢磨不透的感觉)，
*
* 那么接下来我会深入的探讨这个问题。
* */


/**
 * eg1:
 *
 * 这个 this调用是在window环境下调用，因此this指的是window
 *
 * */
function a(){
  var user = "追梦子";
  console.log(this.user); //undefined
  console.log(this); //Window
}
a();


/**
 * eg2:
 *
 * 这里的this指向的是对象o，
 * 因为你调用这个fn是通过o.fn()执行的，那自然指向就是对象o，
 * 这里再次强调一点，this的指向在函数创建的时候是决定不了的，在调用的时候才能决定，谁调用的就指向谁，一定要搞清楚这个。
 *
 * */

var o = {
  user:"追梦子",
  fn:function(){
    console.log(this.user);  //追梦子
  }
}
o.fn();

/**
 *
 * 其实例子1和例子2说的并不够准确，下面这个例子就可以推翻上面的理论。
 * 如果要彻底的搞懂this必须看接下来的几个例子
 *
 * */
var o = {
  user:"追梦子",
  fn:function(){
    console.log(this.user); //追梦子
  }
}
window.o.fn();


var o = {
  a:10,
  b:{
    a:12,
    fn:function(){
      console.log(this.a); //12
    }
  }
}
o.b.fn();

var o = {
  a:10,
  c: function () {
    o.b.fn();
  },
  b:{
    a:12,
    fn:function(){
      console.log(this.a); //undefined
    }
  }
}
o.b.fn();

// o.c.bind(o.b)

var o = {
  a:10,
  b:{
    a:12,
    fn:function(){
      console.log(this.a); //undefined
      console.log(this); //window
    }
  }
}
var j = o.b.fn;
j();

/**
 *
 * this永远指向的是最后调用它的对象，也就是看它执行的时候是谁调用的，
 * 例子4中虽然函数fn是被对象b所引用，但是在将fn赋值给变量j的时候并没有执行所以最终指向的是window，
 * 这和例子3是不一样的，例子3是直接执行了fn。
 *
 * */


let obj={
  name:'程新松',
  fn:function(){
    setTimeout(function(){console.log(this.name)}) // undefined
  }
}
obj.fn();

/**
 * 不难发现，虽然 fn() 里面的 this 是指向 obj ，但是，传给 setTimeout 的是普通函数， this 指向是 window ， window 下面没有 name ，所以这里输出 underfind 。
 * */
//换成箭头函数
let obj={
  name:"程新松",
  fn:function(){
    setTimeout(()=>{console.log(this.name)}); //程新松
  }
}
obj.fn();
/**
 *
 * 这次输出 程新松 是因为，传给 setTimeout 的是箭头函数，然后箭头函数里面没有 this ，所以要向上层作用域查找，
 * 在这个例子上， setTimeout 的上层作用域是 fn 。而 fn 里面的 this 指向 obj ，所以 setTimeout 里面的箭头函数的 this ，指向 obj 。
 * 所以输出 程新松。
 * */
