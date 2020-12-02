import React, {
    useReducer,
} from 'react';
import ReactDOM from 'react-dom';


const initialCount = 0;


// 这么做可以将用于计算 state 的逻辑提取到 reducer 外部
// 也为将来对重置 state 的 action 做处理提供了便利：
function init(initialCount) {
    return { count: initialCount + 10 };
}


const ACTION_PLUS = 'PLUS';
const ACTION_MINUS = 'MINUS';
const ACTION_RESET = 'RESET';
const actions = {
    plus: {
        type: ACTION_PLUS
    },
    minus: {
        type: ACTION_MINUS
    },
    reset: {
        type: ACTION_RESET,
        payload: initialCount
    }
}


function reducer(state, action) {
    switch (action.type) {
        case ACTION_PLUS:
            return { count: state.count + 1 };
        case ACTION_MINUS:
            return { count: state.count - 1 };
        case ACTION_RESET:
            return init(action.payload)
        default:
            throw new Error();
    }
}


function App() {
    const [state, dispatch] = useReducer(reducer, initialCount, init);

    return (
        <>
            Count: {state.count}
            <button onClick={() => dispatch(actions.plus)}>
                +
            </button>
            <button onClick={() => dispatch(actions.minus)}>
                -
             </button>
            <button onClick={() => dispatch(actions.reset)}>
                Reset
            </button>
        </>
    );
}


function render() {
    ReactDOM.render(<App />, document.getElementById('root'));
}


render();