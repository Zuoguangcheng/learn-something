/**
 * @description: 判断是否是引用类型
 */
const isComplexDataType = obj => (typeof obj === 'object' || typeof obj === 'function') && (obj !== null)


// WeakMap 它的键名所引用的对象都是弱引用，即垃圾回收机制不将该引用考虑在内。因此，只要所引用的对象的其他引用都被清除，垃圾回收机制就会释放该对象所占用的内存。也就是说，一旦不再需要，WeakMap 里面的键名对象和所对应的键值对会自动消失，不用手动删除引用。
const deepClone = function (obj, hash = new WeakMap()) {
    // 处理null
    if (!obj.constructor) return obj;
    
    //如果成环了,参数obj = obj.loop = 最初的obj 会在WeakMap中找到第一次放入的obj提前返回第一次放入WeakMap的cloneObj
    if (hash.has(obj)) return hash.get(obj);
    
    // 枚举所有不能正确处理的对象类型
    let type = [Date, RegExp, Set, Map, WeakMap, WeakSet];
    // new Set(a) 就直接是浅拷贝，深拷贝见下面for of
    // 示例：var a = new Set([1,3]); var b = new Set(a);
    if (type.includes(obj.constructor)) return new obj.constructor(obj);
    
    // Object.getOwnPropertyDescriptors() 方法用来获取一个对象的所有自身属性的描述符
    // Object.assign() 方法只能拷贝源对象的可枚举的自身属性，同时拷贝时无法拷贝属性的特性们，而且访问器set get属性会被转换成数据属性，也无法拷贝源对象的原型
    // form: <https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyDescriptors>
    let allDesc = Object.getOwnPropertyDescriptors(obj);  // 获得传入参数所有键的特性
    // 继承原型 && 浅拷贝
    let cloneObj = Object.create(Object.getPrototypeOf(obj), allDesc); 
    // 备份当前对象，方便循环引用值获取
    hash.set(obj, cloneObj);

    // 递归深拷贝, 这里使用for of 是为了方便遍历 set map 数据结构
    for (let key of Reflect.ownKeys(obj)) { // Reflect.ownKeys返回一个数组，包含对象自身的所有键名，不管键名是 Symbol 或字符串，也不管是否可枚举
        cloneObj[key] =
            // 如果值是引用类型(非函数)则递归调用deepClone
            (isComplexDataType(obj[key]) && typeof obj[key] !== 'function')
                ? deepClone(obj[key], hash)
                : obj[key];
    }

    return cloneObj;
};



let obj = {
    bigInt: BigInt(12312),
    set: new Set([2]),
    map: new Map([['a', 22], ['b', 33]]),
    num: 0,
    str: '',
    boolean: true,
    unf: undefined,
    nul: null,
    obj: {
        name: '我是一个对象',
        id: 1
    },
    arr: [0, 1, 2],
    func: function () {
        console.log('我是一个函数')

    },
    date: new Date(0),
    reg: new RegExp('/我是一个正则/ig'),
    [Symbol('1')]: 1,
};

Object.defineProperty(obj, 'innumerable', {
    enumerable: false,
    value: '不可枚举属性'
});
obj = Object.create(obj, Object.getOwnPropertyDescriptors(obj))
obj.loop = obj
let cloneObj = deepClone(obj);
console.log('obj', obj);
console.log('cloneObj', cloneObj);
for (let key of Object.keys(cloneObj)) {
    if (typeof cloneObj[key] === 'object' || typeof cloneObj[key] === 'function') {
        console.log(`${key}相同吗？ `, cloneObj[key] === obj[key])
    }
}

