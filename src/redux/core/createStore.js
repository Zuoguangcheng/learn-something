/**
 * @fileoverview 
 * @author liuduan
 * @Date 2020-06-08 16:56:12
 * @LastEditTime 2020-06-09 14:41:40
 */



export default function createStore(reducer, preloadedState, enhancer) {

    // 如果有中间件, 先整中间件逻辑
    if (typeof enhancer === 'function') {
        return enhancer(createStore)(reducer, preloadedState);
    }

    // 以下是没有中间件的逻辑
    let currentReducer = reducer;
    let currentState = preloadedState;

    let currentListeners = []
    let nextListeners = currentListeners;
    let isDispatching = false;

    function getState() {
        // 触发dispatch期间不能getState
        if (isDispatching) {
            throw new Error(
                'You may not call store.getState() while the reducer is executing. ' +
                'The reducer has already received the state as an argument. ' +
                'Pass it down from the top reducer instead of reading it from the store.'
            )
        }

        return currentState;
    }


    function dispatch(action) {

        if (typeof action !== 'object' || action === null) {
            throw new Error(
                'Actions must be plain objects. ' +
                'Use custom middleware for async actions.'
            )
        }

        // 触发dispatch期间不能再次触发dispatch
        if (isDispatching) {
            throw new Error('Reducers may not dispatch actions.')
        }

        try {
            isDispatching = true;
            currentState = currentReducer(currentState, action);
        } finally {
            isDispatching = false;
        }

        const listeners = (currentListeners = nextListeners)
        for (let i = 0; i < listeners.length; i++) {
            const listener = listeners[i];
            listener();
        }

        return action;
    }

    // 初始调用dispatch
    dispatch({ type: '`@@redux/INIT' });


    /* 监听器 */
    function subscribe(listener) {
        if (typeof listener !== 'function') {
            throw new Error('Expected the listener to be a function.');
        }
        if (isDispatching) {
            throw new Error(
                'You may not call store.subscribe() while the reducer is executing. ' +
                'If you would like to be notified after the store has been updated, subscribe from a ' +
                'component and invoke store.getState() in the callback to access the latest state. ' +
                'See https://redux.js.org/api/store#subscribelistener for more details.'
            )
        }

        if (nextListeners === currentListeners) {
            nextListeners = currentListeners.slice()
        }

        let isSubscribed = true;

        nextListeners.push(listener);

        return function () {
            if (!isSubscribed) {
                return;
            }
            isSubscribed = false;

            nextListeners = nextListeners.filter(item => item !== listener);
            currentListeners = null;
        };
    }


    function replaceReducer(nextReducer) {
        currentReducer = nextReducer;
        // 更新调用dispatch
        dispatch({ type: '`@@redux/REPLACE' });
        return store;
    }


    const store = ({
        getState,
        dispatch,
        subscribe,
        replaceReducer,
    });
    return store
}