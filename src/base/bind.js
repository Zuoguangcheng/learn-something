// https://github.com/mqyqingfeng/Blog/issues/12

/**
 *
 * var foo = {
    value: 1
};

 function bar(name, age) {
    console.log(this.value);
    console.log(name);
    console.log(age);

}

 var bindFoo = bar.bind(foo, 'daisy');
 bindFoo('18');
 * */
Function.prototype.bind = function (ctx) {
    const self = this;
    let args = Array.prototype.slice.call(arguments, 1); // 获取bind参数

    let f = function () {
      let bindArgs = Array.prototype.slice.call(arguments); // 获取bind返回的函数中传递的参数

      // return bind后return的func  被new 后 bind失效
      return self.call(this instanceof f ? this : ctx, ...args.concat(bindArgs));
    }

    f.prototype = Object.create(this.prototype);

    return f;
}

