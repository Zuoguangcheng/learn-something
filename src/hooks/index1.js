import React from 'react';
import ReactDOM from 'react-dom';


function useState(initialValue) {
    let state = state || initialValue;
    function setState(newValue) {
        state = newValue;
        render();
    }
    return [state, setState];
}


const App = () => {

    const [count, setCount] = useState(1);


    function add() {
        setCount(count + 1);
    }

    return (
        <>
            <h1>手写useState</h1>
            <p>{count}</p>
            <button onClick={add}>add</button>
        </>
    )
}



function render() {
    ReactDOM.render(<App />, document.getElementById('root'));
}


render();






// let state;
// function useState(initialValue) {
//     state = state || initialValue;
//     function setState(newValue) {
//         state = newValue;
//         render();
//     }
//     return [state, setState];
// }
