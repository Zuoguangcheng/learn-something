/**
 * @fileoverview 
 * @author liuduan
 * @Date 2020-06-09 16:21:18
 * @LastEditTime 2020-06-09 16:45:14
 */
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';

/* 方式1 */
// const FancyButton = React.forwardRef((props, ref) => {
//     function handleClick() {
//         console.log('handleClick', ref.current);
//     }
//     return (
//         <button forwardedRef={ref} className="FancyButton" onClick={handleClick}>
//             {props.children}
//         </button>
//     );
// });

// const App = () => {
//     const ref = React.createRef();

//     useEffect(() => {
//         console.log('w', ref.current);
//     }, []);

//     return <FancyButton ref={ref}>Click me!</FancyButton>
// };

/* 方式2：通过forwardedRef转发, 这种更适用于组件写法 */
const FancyButton = (props) => {
    const ref = props.forwardedRef;
    function handleClick() {
        console.log('handleClick', ref.current);
    }
    return (
        <button ref={ref} className="FancyButton" onClick={handleClick}>
            {props.children}
        </button>
    );
};

const Wrapper = React.forwardRef((props, ref) => {
    return <FancyButton forwardedRef={ref} {...props}>Click me!</FancyButton >;
});

const App = () => {
    const ref = React.createRef();

    useEffect(() => {
        console.log('App', ref.current);
    }, []);

    return <Wrapper ref={ref} />;
};


ReactDOM.render(
    <App />,
    document.getElementById("root"),
);