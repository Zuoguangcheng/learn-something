import React, {
    useState,
    useEffect,
} from 'react';
import ReactDOM from 'react-dom';


const App = () => {
    const [count, setCount] = useState(1);
    // const [count1, setCount1] = useState(0);

    

    useEffect(() => {
        console.log('我是didMount生命周期勾子：', count);
        return () => {
            console.error('我是组件卸载前生命周期勾子。。。。：', count);
        }
    }, []);

    useEffect(() => {
        console.log('count变化我就run：', count);
        return () => {
            console.warn('我是组件re-render前生命周期勾子：', count);
        }
    }, [count]);

    useEffect(() => {
        console.log('有数据更新我就执行', count);
        return () => {
            console.error('我是组件卸载前生命周期勾子。。。。：', count);
        }
    });


    function add() {
        setCount(count + 1);
    }

    // setTimeout(() => {
    //     setCount1(100);
    // }, 2000);


    console.log('_______________redner___________________');


    return (
        <>
            <h1>React.useEffect</h1>
            <p>{count}</p>
            <button onClick={add}>add</button>

            {/* <br />
            <br />
            <br />
            <p>{count1}</p> */}
        </>
    )
}



function render() {
    ReactDOM.render(<App />, document.getElementById('root'));
}


render();
