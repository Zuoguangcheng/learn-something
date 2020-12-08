/**
 * @fileoverview 
 * @author liuduan
 * @Date 2020-06-08 16:21:06
 * @LastEditTime 2020-06-09 14:41:18
 */

import React from 'react';
import ReactDOM from 'react-dom';
import { connect, Provider } from './react-redux/src'
import store from './store';

let Counter = (props) => {
    return (
        <div>
            <h1>{props.countNew}</h1>
            <button onClick={props.onAdd}>+</button>
            <button onClick={props.onReduce}>-</button>
        </div>
    )
};

const mapStateToProps = (state) => {
    return {
      countNew: state.count
    }
  }

  const mapDispathcToProps = (dispatch, ownProps) => {
    return {
      onReduce: () => {
        dispatch({
          type: 'REDUCE',
        });
      }
    };
  }

const CounterRedux = connect(mapStateToProps, mapDispathcToProps)(Counter);

// ==========================================================


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
        <Provider store={store}>
            <CounterRedux
                // value={store.getState().count}
                store={1}
                onAdd={() => store.dispatch(add)}
                // onReduce={() => store.dispatch({ type: 'REDUCE' })}
            />
        </Provider>,
        document.getElementById("root"),
    );
};

render();
store.subscribe(render);