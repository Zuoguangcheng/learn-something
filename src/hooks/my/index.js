import React, { useState, useRef, useEffect } from 'react';


function Counter() {
    const [ count, setCount ] = useState(0);


    useEffect(() => {
        console.log('effect');
    });

    console.log('couter');


    const log = () => {
        setCount(count + 1);
    };

    return (
        <div>
            <p>You clicked {count.current} times</p>
            <button onClick={log}>Click me</button>
        </div>
    );
}

export default Counter;
