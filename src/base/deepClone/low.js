function deepClone(obj) {
    if (typeof obj === "object" && obj !== null) {
        if (obj.constructor === Array) {
            var newArr = []
            for (var i = 0; i < obj.length; i++) {
                newArr.push(deepClone(obj[i]))
            }
            return newArr
        } else {
            var newObj = {}
            // for (var key in obj) { // for in循环遍历对象自身的和继承的可枚举属性（不含 Symbol 属性）
            //     newObj[key] = deepClone(obj[key])
            // }
            Reflect.ownKeys(obj).forEach(key => { // Reflect.ownKeys返回一个数组，包含对象自身的所有键名，不管键名是 Symbol 或字符串，也不管是否可枚举
                newObj[key] = deepClone(obj[key])
            })
            return newObj
        }
    } else {
        return obj
    }
}


function Obj() {
    this.obj = { a: 1 };
    this.arr = [{ a: 1 }, 2, 3];
    this.null = null
    this.und = undefined;
    this.reg = /123/;        // 被转为空对象
    this.date = new Date(0); // 被转为空对象
    this.NaN = NaN
    this.infinity = Infinity
    this.sym = Symbol(1)
    this.set = new Set([1, 2, 3])  // 被转为空对象
    this.map = new Map([['a', 1], ['b', 9]]) // 被转为空对象
    this.proxy = new Proxy({ a: 1 }, {}) // 被转未普通对象
    this.func = function () {  // 直接拷贝回来了
        alert(1)
    };
}


let obj1 = new Obj();
Object.defineProperty(obj1, 'innumerable', {
    enumerable: false,
    value: 'innumerable'
})
console.log(obj1);
let obj2 = deepClone(obj1);
console.log(obj2);
console.log("arr:", obj2.arr[0] === obj1.arr[0]);
console.log("func:", obj2.func === obj1.func);