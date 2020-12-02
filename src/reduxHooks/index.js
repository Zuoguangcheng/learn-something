/**
 * @fileoverview test react-hooks-redux
 * @author liuduan
 * @Date 2020-06-27 23:28:49
 * @LastEditTime 2020-06-28 00:13:56
 */
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider, store } from './store';



async function asyncRequeset(dispatch, getState) {
    const count = await Promise.resolve(getState().count + 1);
    dispatch({
        type: 'ADD',
        reducer(state) {
            return {
                ...state,
                count,
            }
        }
    });
}


const Counter = () => {
    // 从AppContext上获取value
    const state = store.useContext();

    function handleAdd() {
        // store.dispatch({ type: 'ADD' });

        // dispatch 一个 function
        store.dispatch(asyncRequeset)
    }

    return (
        <div>
            <h1>{state.count}</h1>
            <button onClick={handleAdd}>+</button>
        </div>
    );
};


ReactDOM.render(
    <Provider>
        <Counter />
    </Provider>,

    document.getElementById("root"),
);