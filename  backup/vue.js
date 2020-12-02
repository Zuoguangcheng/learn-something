// 1. 首先我们先定义一个数据源
let vm = {
    value: 0
}

// 2. 然后定义一个Dep，用于存储watcher，用于管理watcher的Dep对象
let Dep = function () {
    this.list = [];
    this.add = function (watcher) {
        this.list.push(watcher)
    };
    this.notify = function (newValue) {
        this.list.forEach(function (fn) {
            fn(newValue)
        })
    }
};



// 3. 模拟Compile出来的watchers，该demo涉及到两个地方的重新render，一个是title，另一个是输入框。所以写两个watcher，然后存入Dep
// 模拟compile,通过对Html的解析生成一系列订阅者（watcher）
function renderInput(newValue) {
    let el = document.getElementById('inp');
    if (el) {
        el.value = newValue
    }
}

function renderTitle(newValue) {
    let el = document.getElementById('h1');
    if (el) {
        el.innerHTML = newValue
    }
}

//将解析出来的watcher存入Dep中待用
let dep = new Dep();
dep.add(renderInput);
dep.add(renderTitle)



// 4. 使用 Object.defineProperty 定义一个Observer
function observer(vm, key, value) {
    Object.defineProperty(vm, key, {
        enumerable: true,
        configurable: true,
        get: function () {
            console.log('defineProperty-Get', key, value);
            return value
        },
        set: function (newValue) {
            console.log('defineProperty-Set', key, newValue, value)
            if (value !== newValue) {
                value = newValue
                //将变动通知给相关的订阅者
                dep.notify(newValue)
            }
        }
    })
}

// 5. 再将页面使用的两个方法写出来。(Vue使用的是指令对事件进行绑定，但是本文不涉及指令，所以用最原始的方法绑定事件)
function inputChange(ev) {
    let value = Number.parseInt(ev.target.value);
    vm.value = (Number.isNaN(value)) ? 0 : value;
}

function btnAdd() {
    vm.value = vm.value + 1;
}



//数据初始化方法
function initMVVM(vm) {
    Object.keys(vm).forEach(function (key) {
        observer(vm, key, vm[key])
    })
}

//初始化数据源
// initMVVM(vm)

//初始化页面，将数据源渲染到UI
dep.notify(vm.value);


// Object.defineProperty 只能监听开始添加数组的内存段key，如果新增内存段，新增的内存段不会被监听，如果删除开始监听的内存段之后补充当前位置的内纯段也不会被监听到
var arr = [8, 9, 100];
initMVVM(arr);
// arr[1] = 2 // 会被监听
// arr[2] // 会被监听
// arr.push(1); // 不会被监听
// arr.push(12); // 不会被监听
// console.log('++++++++++++++')
// arr.unshift(1) // 新增的不会被监听
// console.log('++++++++++++++')
// arr.pop() // 不会被监听

// 注意：sort / reverse 也是删除新增数组，所以也不会被监听，也需要被重写
// splice sort reverse unshift shift pop push




// 而Proxy刚好可以解决上面Object.defineProperty新增删除不能被监听的问题
// const pa = new Proxy(arr, {
//     get(target, key, receiver) {
//         console.log('proxy get', target, key, receiver);
//         return Reflect.get(target, key, receiver);
//     },
//     set(target, key, value, receiver) {
//         console.log('proxy set', target, key, value, receiver);
//         return Reflect.set(target, key, value, receiver);
//     }
// })

// pa.unshift(999)
// pa.shift()
