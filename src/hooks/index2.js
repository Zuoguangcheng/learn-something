import React from 'react';
import ReactDOM from 'react-dom';

let state;
function useState(initialValue) {
    state = state || initialValue;
    function setState(newValue) {
        state = newValue;
        render();
    }
    return [state, setState];
}


const App = () => {

    const [count, setCount] = useState(1);
    const [random, setRandom] = useState(Math.random());


    function add() {
        setCount(count + 1);
    }

    function change() {
        setRandom(Math.random());
    }

    return (
        <>
            <h1>手写useState+</h1>
            <p>{count}</p>
            <button onClick={add}>add</button>
            <p>{random}</p>
            <button onClick={change}>换随机数</button>
        </>
    )
}



function render() {
    ReactDOM.render(<App />, document.getElementById('root'));
}


render();






// let memoState = [];
// let point = 0;
// function useState(initialValue) {
//     memoState[point] = memoState[point] || initialValue;
//     const _cur = point;
//     console.log(memoState, _cur);
//     function setState(newValue) {
//         memoState[_cur] = newValue;
//         // point = 0; // 关键一步
//         render();
//     }
//     return [memoState[point++], setState];
// }


