import React, {
    useState,
    useEffect,
} from 'react'
import ReactDOM from "react-dom";


const App = () => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        setCount(count + 1);
        console.log(count);
        setCount(count + 2);
        console.log(count);
        setCount(count + 3);
        console.log(count);
    }, [])

    const click = () => {
        setCount(count + 1);
        console.log(count);
        setCount(count + 2);
        console.log(count);
        setCount(count + 3);
        console.log(count);
    }

    const asyncClick = () => {
        console.log('asyncClick0', count);
        setTimeout(() => {
            setCount(count + 1);
            console.log('asyncClick1', count);
            setCount(count + 2);
            console.log('asyncClick2', count);
            setCount(count + 3);
            console.log('asyncClick3', count);
        }, 0);
    }

    console.log('_______________redner___________________', count);

    return (
        <>
            <p>Has Clicked {count} Times</p>
            <button onClick={click}>Three Kill</button>
            <button onClick={asyncClick}>Three Async Kill</button>
        </>
    )
}


function render() {
    ReactDOM.render(<App />, document.getElementById('root'));
}


render();