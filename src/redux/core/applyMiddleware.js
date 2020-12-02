/**
 * @fileoverview 
 * @author liuduan
 * @Date 2020-06-09 10:37:23
 * @LastEditTime 2020-06-09 14:39:00
 */
import compose from './compose';
export default function applyMiddleware(...middlewares) {
    return (createStore) => (reducer, preloadedState) => {
        var store = createStore(reducer, preloadedState);


        /* 
        // 最初始中间件模型
        let next = store.dispatch;
        store.dispatch = function dispatchAndLog(action) {
            console.log('dispatching', action);
            next(action);
            console.log('next state', store.getState());
        } 
        */

        let _dispatch = () => {
            throw new Error(
                'Dispatching while constructing your middleware is not allowed. ' +
                'Other middleware would not be applied to this dispatch.'
            )
        }
        var middlewareAPI = {
            getState: store.getState,
            // 注意：这里不能直接dispatch: dispatch这么写，这么写dispatch属性值会被写死，不会动态修改过来
            dispatch: (action, ...args) => {
                // console.log('middlewareAPI=====================', dispatch.toString())
                return _dispatch(action, ...args);
            },
        };
        var chain = middlewares.map(middleware => middleware(middlewareAPI));
        _dispatch = compose(...chain)(store.dispatch);

        return { ...store, dispatch: _dispatch };
    }
}


// thunk中间件
function thunk() {
    return ({ dispatch, getState }) => next => action => {
        if (typeof action === 'function') {
            return action(dispatch, getState);
        } else {
            next(action);
        }
    }
}