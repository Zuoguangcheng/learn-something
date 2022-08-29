/**
 * bug: undefined/date/正则/函数/symbol/set/map/proxy/NaN/infinity/循环引用 无法正确拷贝
 */
function Obj() {
    this.obj = { a: 1 };
    this.arr = [1, 2, 3];
    this.null = null
    this.und = undefined;    // 丢失属性值是undefined的属性
    this.reg = /123/;        // 被转为空对象
    this.date = new Date(0); // 被转为字符串
    this.NaN = NaN           // 被转为null
    this.infinity = Infinity // 被转为null
    this.sym = Symbol(1)     // 丢失属性值是Symbol类型的属性
    this.set = new Set([1, 2, 3])  // 被转为空对象
    this.map = new Map([['a', 1], ['b', 9]]) // 被转为空对象
    this.proxy = new Proxy({ a: 1 }, {}) // 被转未普通对象
    this.func = function () { // 丢失属性值是function类型的属性
        alert(1)
    };
}
let obj1 = new Obj();
Object.defineProperty(obj1, 'innumerable', {
    enumerable: false,  // 当enumerable为true时可被clone，为false时不可以被clone
    value: 'innumerable'
})
console.log(obj1);
let str = JSON.stringify(obj1);
console.log(str)
let obj2 = JSON.parse(str);
console.log(obj2);