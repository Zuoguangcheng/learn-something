/**
 * @fileoverview 
 * @author liuduan
 * @Date 2020-06-08 16:21:06
 * @LastEditTime 2020-06-09 14:41:18
 */

import React from 'react';
import ReactDOM from 'react-dom';
import store from './store';


const Counter = ({ value, onAdd, onReduce }) => (
    <div>
        <h1>{value}</h1>
        <button onClick={onAdd}>+</button>
        <button onClick={onReduce}>-</button>
    </div>
);

const render = () => {
    // 异步action
    function add(dispatch, getState) {
        setTimeout(() => {
            // 这个dispatch是经过中间修改后的store.dispatch，dispatch就又从头开始过一遍中间件方法
            /* dispatch((dispatch, getState) => {
                setTimeout(() => {
                    // 同步action
                    dispatch({ type: 'ADD' })
                }, 200);
            }); */

            dispatch({ type: 'ADD' })
        }, 300);
    }
    // console.log('redner state:', store.getState());
    ReactDOM.render(
        <Counter
            value={store.getState().count}
            onAdd={() => store.dispatch(add)}
            onReduce={() => store.dispatch({ type: 'REDUCE' })}
        />,
        document.getElementById("root"),
    );
};

render();
store.subscribe(render);