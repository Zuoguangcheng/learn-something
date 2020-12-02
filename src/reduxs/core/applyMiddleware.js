/**
 * @fileoverview 
 * @author liuduan
 * @Date 2020-06-19 21:23:18
 * @LastEditTime 2020-06-19 22:59:08
 */

export default function applyMiddleware(...middlers) {
    return function (createStore) {
        return function (reducer, preloadedState) {
            const store = createStore(reducer, preloadedState);

            const {
                dispatch,
                getState,
            } = store;

            let _dispatch = function () {
                throw new Error('must over write');
            }

            const middlewareAPI = {
                getState,
                // 注意：这里不能直接dispatch: dispatch这么写，这么写dispatch属性值会被写死，不会动态修改过来
                dispatch: (action, ...args) => {
                    // console.log('middlewareAPI=====================', dispatch.toString())
                    return _dispatch(action, ...args);
                },
            };

            const chain = middlers.map(middler => middler(middlewareAPI));

            _dispatch = compose(...chain)(dispatch);

            return {
                ...store,
                dispatch: _dispatch,
            };
        }
    }
}

/* 函数组合 */
function compose(...chain) {
    if (chain.length === 0) {
        return arg => arg;
    }
    if (chain.length === 1) {
        return chain[0];
    }
    return chain.reduce((f, g) => (...args) => f(g(...args)));
}



export function loggerMiddleware(store) {
    return (next) => {
        return (action) => {
            console.log(`⏰，${new Date().valueOf()}`, store.getState())
            next(action);
            console.log('logger-end');
        }
    }
}

export function catchErrorMiddleware(store) {
    return (next) => {
        return (action) => {
            try {
                console.log('✅', action.type);
                next(action);
                console.log('trycatch-end');
                console.log('-----------------------')
            } catch (error) {
                console.error(error.message);
            }
        }
    }
}

export function asyncFetchMiddleware(store) {
    return (next) => {
        return (action) => {
            if (typeof action === 'function') {
                return action(store.dispatch, store.getState);
            }

            next(action);
        }
    }
}
