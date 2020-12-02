/**
 * @fileoverview React源码
 * @author liuduan
 * @Date 2020-06-20 20:31:33
 * @LastEditTime 2020-06-21 10:39:52
 */


/**
 * @description React.createElement JSX 转 虚拟dom对象
 * @param {object} options 处理 key, ref, ...props
 * @return {ReactElement}
 * 1. 从 options 中去除 key 和 ref
 * 2. 拿到 children 数组
 * 3. 创建一个 ReactElement 对象
 * 
 * 在@babel/preset-react中调用
 */
function createElement(type, options, ...children) {
    return ReactElement()
}
function ReactElement(type, options, ...children) {
    return {
        // react 会通过 isValidElement 方法 判断是不是正常的ReactElement，用于安全校验
        // 类型是Symbol类型，JSON.stringify() 无法转换Symbol，黑客无法模拟注入
        // 详见src/components/App.js
        $$typeof: REACT_ELEMENT_TYPE,
        type: type,
        props: {
            ...options,
            children,
        },
        ref: null,
        key: null,
    }
}




// React.Children.map 相比于 [].map 好处:
// ReactChildren.js
// 内部做了扁平化...各种好的处理，比如null、多维展平处理
// React.Children.map === mapChildren
// 1. 可以处理 children = null，undefined，boolean，number，string，object 类型
// 2. 防止内存抖动 先创建一个内存空间，池化内存，平滑的内存，每次map共同使用一个traverseContext处理，思想可以借鉴，内存优化
// 3. 有展平功能，原因：数组每个子元素递归调用traverseAllChildrenImpl
// 4. 迭代器也可以支持，元素具有[Symbol.iterator]方法 或 '@@iterator' 方法
/*
interface Iterabel {
    [Symbol.iterator](): Iterator;
}
interface Iterator {
    next(): IterationResult;
}
interface IterationResult {
    value: any;
    done: boolean;
}

let obj = {
    data: ['hello', 'world'],
    [Symbol.iterator]() {
        const self = this;
        let index = 0;
        return {
            next() {
                if (index < self.data.length) {
                    return {
                        value: self.data[index++],
                        done: false
                    };
                } else {
                    return { value: undefined, done: true };
                }
            }
        };
    }
};

for (const iterator of obj) {
    console.log(iterator)
}
*/

