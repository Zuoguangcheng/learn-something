import React from 'react';
import ReactDOM from 'react-dom';


let memoState = [];
let point = 0;
let unwillmounts = [];
let cursor = 0;
function useState(initialValue) {
    memoState[point] = memoState[point] || initialValue;
    const _cur = point;
    // console.log(memoState, _cur);
    function setState(newValue) {
        memoState[_cur] = newValue;
        point = 0; // 关键一步
        cursor = 0;

        // 执行willunmount
        for (const fn of unwillmounts) {
            fn();
        }
        render();
    }
    return [memoState[point++], setState];
}


// callback is function
// deps：undefined | [] | dep[]
// deps 没有值，每次render都执行回调
// deps = []，只有第一次render才执行回调
// deps = dep[]，只有依赖相关值变化才执行回调
function useEffect(callback, dependences) {
    // 获取缓存中的依赖
    const cacheDeps = memoState[point];

    // 默认diff了，因为第一次获取的缓存一定是undefined，第一次一定要执行回调的
    let noDiff = false;

    // 走到这里，一定是第二次+render了，这时这要对比下依赖了
    if (dependences && cacheDeps) {
        // 比较缓存依赖和当前依赖值，只要有一个不一样的就是给我render去
        noDiff = dependences.every((item, i) => item === cacheDeps[i]);
    }

    if (!dependences || !noDiff) {
        let unwillmount = callback();
        memoState[point] = dependences;

        if (unwillmount && (!dependences || dependences.length > 0)) {
            unwillmounts[cursor++] = unwillmount;
        }
    }

    // 最后一定要执行++，继续向下进行
    point++;
}


const App = () => {

    const [count, setCount] = useState(1);


    useEffect(() => {
        console.log('useEffect-------有数据更新我就执行', count);
        return () => {
            console.error('我是组件卸载前生命周期勾子。。。。：', count);
        }
    });

    useEffect(() => {
        console.log('useEffect-------我是didMount生命周期勾子：', count);
        return () => {
            console.error('我是组件卸载前生命周期勾子。。。。：', count);
        }
    }, []);

    useEffect(() => {
        console.log('useEffect-------count变化我就run：', count);
        return () => {
            console.warn('我是组件re-render前生命周期勾子：', count);
        }
    }, [count]);


    function add() {
        setCount(count + 1);
    }

    console.log('_______________redner___________________');

    return (
        <>
            <h1>手写useEffect</h1>
            <p>{count}</p>
            <button onClick={add}>add</button>
        </>
    )
}



function render() {
    ReactDOM.render(<App />, document.getElementById('root'));
}


render();
