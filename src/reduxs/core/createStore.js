/**
 * @fileoverview 
 * @author liuduan
 * @Date 2020-06-19 20:21:44
 * @LastEditTime 2020-06-19 21:30:27
 */

function createStore(reducer, initialStore = {}, middleware) {
    // 如果有中间件, 先整中间件逻辑
    if (typeof middleware === 'function') {
        return middleware(createStore)(reducer, initialStore);
    }

    let store = initialStore;
    let listeners = [];

    // middleware 

    // 1. getStore
    function getState(params) {
        return store;
    }

    // 2. subscribe
    function subscribe(cb) {
        listeners.push(cb);
    }

    // 2.5 简版dispatch
    function changeState(newState) {
        store = newState;
        for (const listen of listeners) {
            listen();
        }
    }

    // 3. dispatch
    function dispatch(action) {
        store = reducer(store, action);
        for (const listen of listeners) {
            listen();
        }
        return action;
    }

    // 初始调用dispatch
    dispatch({ type: Symbol('@@redux/INIT') });


    // 4. replace reducer
    function replaceReducer(nextReducer) {
        reducer = nextReducer;
        dispatch({ type: Symbol('@@redux/REPLACE') });

        return store;
    }


    return {
        getState,
        subscribe,
        changeState,
        dispatch,
        replaceReducer,
    }
}


export default createStore;