// https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy

/*const handler = {
    get: function (obj, prop, res) {
        return prop in obj ? obj[prop] : 37;
    }
}

const p = new Proxy({}, handler);

p.a = 1;
p.b = undefined;

console.log(p.a, p.b);
console.log(p.c);*/

/*let validator = {
    set: function (obj, prop, value) {
        if(prop === 'age') {
            if(!Number.isInteger(value)) {
                throw new TypeError('error');
            }

            if(value > 200) {
                throw new RangeError('error');
            }

            obj[prop] = value;

            return true
        }
    }
}

let origin = {}

let person = new Proxy(origin, validator);

person.age = 110;

console.log('person', person.age);
console.log('origin', origin.age);*/


/*let products = new Proxy({
    browsers: ['Internet Explorer', 'Netscape']
}, {
    get: function(obj, prop) {
        // 附加一个属性
        if (prop === 'latestBrowser') {
            return obj.browsers[obj.browsers.length - 1];
        }

        // 默认行为是返回属性值
        return obj[prop];
    },
    set: function(obj, prop, value) {
        // 附加属性
        if (prop === 'latestBrowser') {
            obj.browsers.push(value);
            return;
        }

        // 如果不是数组，则进行转换
        if (typeof value === 'string') {
            value = [value];
        }

        // 默认行为是保存属性值
        obj[prop] = value;

        // 表示成功
        return true;
    }
});

console.log(products.browsers); // ['Internet Explorer', 'Netscape']
products.browsers = 'Firefox';  // 如果不小心传入了一个字符串
console.log(products.browsers); // ['Firefox'] <- 也没问题, 得到的依旧是一个数组

products.latestBrowser = 'Chrome';
console.log(products.browsers);      // ['Firefox', 'Chrome']
console.log(products.latestBrowser); // 'Chrome'*/


/*
let products = new Proxy([
    { name: 'Firefox'    , type: 'browser' },
    { name: 'SeaMonkey'  , type: 'browser' },
    { name: 'Thunderbird', type: 'mailer' }
], {
    get: function(obj, prop) {
        // 默认行为是返回属性值， prop ?通常是一个整数
        if (prop in obj) {
            return obj[prop];
        }

        // 获取 products 的 number; 它是 products.length 的别名
        if (prop === 'number') {
            return obj.length;
        }

        let result, types = {};

        for (let product of obj) {
            if (product.name === prop) {
                result = product;
            }
            if (types[product.type]) {
                types[product.type].push(product);
            } else {
                types[product.type] = [product];
            }
        }

        // 通过 name 获取 product
        if (result) {
            return result;
        }

        // 通过 type 获取 products
        if (prop in types) {
            return types[prop];
        }

        // 获取 product type
        if (prop === 'types') {
            return Object.keys(types);
        }

        return undefined;
    }
});

console.log(products[0]); // { name: 'Firefox', type: 'browser' }
console.log(products['Firefox']); // { name: 'Firefox', type: 'browser' }
console.log(products['Chrome']); // undefined
console.log(products.browser); // [{ name: 'Firefox', type: 'browser' }, { name: 'SeaMonkey', type: 'browser' }]
console.log(products.types); // ['browser', 'mailer']
console.log(products.number); // 3*/


/*function sum(a, b) {
    return a + b;
}

const handle = {
    apply: function (target, thisArg, argumentsList) {
        console.log(argumentsList);
        console.log(thisArg);

        return target(...argumentsList) * 10;
    }
}

const proxy1 = new Proxy(sum, handle);

console.log(sum(1, 2));
console.log(proxy1(1, 2));*/

/*
function monster1(disposition) {
    this.disposition = disposition;
}

const handler1 = {
    construct(target, args) {
        console.log('monster1 is called');

        return new target(...args)
    }
}

const proxy1 = new Proxy(monster1, handler1);

console.log('new Pro', new proxy1('a').disposition)*/

/*var p = new Proxy({}, {
    deleteProperty: function(target, prop) {
        console.log('called: ' + prop);
        delete target[prop];
        return true;
    }
});

p.a = 10;
delete p.a;
console.log('p', p.a);*/


function extend(sup, base) {
    var descriptor = Object.getOwnPropertyDescriptor(
        base.prototype, "constructor"
    );

    base.prototype = Object.create(sup.prototype);

    var handler = {
        construct: function(target, args) {
            console.log('construct called')
            var obj = Object.create(base.prototype);

            this.apply(target, obj, args);
            return obj;
        },
        apply: function(target, that, args) {
            console.log('apply called')
            sup.apply(that, args);
            base.apply(that, args);
        }
    };
    var proxy = new Proxy(base, handler);
    descriptor.value = proxy;
    Object.defineProperty(base.prototype, "constructor", descriptor);
    return proxy;
}

var Person = function (name) {
    this.name = name
};

var Boy = extend(Person, function (name, age) {
    this.age = age;
});

Boy.prototype.sex = "M";

var Peter = new Boy("Peter", 13);
console.log(Peter.sex);  // "M"
console.log(Peter.name); // "Peter"
console.log(Peter.age);  // 13