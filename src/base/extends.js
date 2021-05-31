// https://github.com/mqyqingfeng/Blog/issues/16

/*
* 1.原型链继承
* */

function Parent() {
  this.name = 'kevin';
}

Parent.prototype.getName =function () {
  console.log(this.name);
}

function Child() {

}

Child.prototype = new Parent();

var child1 = new Child();
console.log(child1.getName());

/*
*
* 问题：
1.引用类型的属性被所有实例共享，举个例子：

function Parent () {
    this.names = ['kevin', 'daisy'];
}

function Child () {

}

Child.prototype = new Parent();

var child1 = new Child();

child1.names.push('yayu');

console.log(child1.names); // ["kevin", "daisy", "yayu"]

var child2 = new Child();

console.log(child2.names); // ["kevin", "daisy", "yayu"]
2.在创建 Child 的实例时，不能向Parent传参
*
* */


/**
 * 2.借用构造函数
 * */

function Parent() {
  this.names = ['kevin', 'daisy'];
}

function Child() {
  Parent.call(this);
}


var child1 = new Child();

child1.names.push('yayu');

console.log(child1.names); // ["kevin", "daisy", "yayu"]

var child2 = new Child();

console.log(child2.names); // ["kevin", "daisy"]

/*
* 优点：

1.避免了引用类型的属性被所有实例共享

2.可以在 Child 中向 Parent 传参
*
*
* 举个例子：

function Parent (name) {
    this.name = name;
}

function Child (name) {
    Parent.call(this, name);
}

var child1 = new Child('kevin');

console.log(child1.name); // kevin

var child2 = new Child('daisy');

console.log(child2.name); // daisy
缺点：

方法都在构造函数中定义，每次创建实例都会创建一遍方法。
* */


/*
* 3.组合继承
* */

function Parent (name) {
  this.name = name;
  this.colors = ['red', 'blue', 'green'];
}

Parent.prototype.getName = function () {
  console.log(this.name)
}

function Child (name, age) {

  Parent.call(this, name);

  this.age = age;

}

Child.prototype = new Parent();
Child.prototype.constructor = Child;

var child1 = new Child('kevin', '18');

child1.colors.push('black');

console.log(child1.name); // kevin
console.log(child1.age); // 18
console.log(child1.colors); // ["red", "blue", "green", "black"]

var child2 = new Child('daisy', '20');

console.log(child2.name); // daisy
console.log(child2.age); // 20
console.log(child2.colors); // ["red", "blue", "green"]


/*4. 原型式继承
* 其实是Object.create 的模拟实现
*
* 将所有的属性都挂在到新对象的prototype上
*
* 他的问题和原型继承一样，因为把所有的元素都挂在到原型上， 所以引用的是同一份，引用属性修改会影响
* */

function createObj(o) {
  function F() {}

  F.prototype = o;

  return new F();
}


/**
 * .组合寄生式继承
 *
 * 是为了解决 组合继承的问题
 *
 * Parent.call(this, name);
 * Child.prototype = new Parent();
 *
 * 1.会调用两次parent构造函数
 * 2.child的prototype上有parent的自己属性，是多余的
 *
 * 因此需要将 Child.prototype = new Parent(); 这一句修改
 *
 * 改成 Child.prototype = Object.create(Parent.prototype)
 *     Child.prototype.constructor = Child;
 * 或者模拟
 *    var F = function(){}
 *    F.prototype = Parent.prototype;
 *    Child.prototype = new F();
 *    Child.prototype.constructor = Child;
 *
 * 寄生组合继承应该是最完美的解决继承的方式
 * 其次是组合继承
 *
 * */



