import React, {
    useState,
} from 'react';
import ReactDOM from 'react-dom';


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
            <h1>React.useState</h1>
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