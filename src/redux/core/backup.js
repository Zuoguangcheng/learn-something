/**
 * @fileoverview 
 * @author liuduan
 * @Date 2020-06-09 14:46:41
 * @LastEditTime 2020-06-09 15:03:41
 */
function createStore(reducer, originState, middleware) {
    if (middleware) {
        return middleware(createStore)(reducer, originState);
    }

    let currentState = originState;
    let currentReducer = reducer;
    let listeners = [];


    function getState() {
        return currentState;
    }

    function dispatch(action) {
        if (typeof action !== 'object') {
            throw new Error('action must be object');
        }

        currentState = currentReducer(currentState, action);

        for (const listen of listeners) {
            listen();
        }

        return action;
    }

    function subscribe(fn) {
        listeners.push(fn);
    }

    return {
        getState,
        dispatch,
        subscribe,
    }
}

function combineReducers(reducers) {
    return function (state, action) {
        let newState = {};
        let hasChanged = false;
        for (const reducerKey of Object.keys(reducers)) {
            const oldS = state[reducerKey];
            const reducer = reducers[reducerKey];
            const newS = reducer(oldS, action);
            newState[reducerKey] = newS;
            hasChanged = hasChanged || oldS !== newS;
        }

        hasChanged = hasChanged || Object.keys(newState).length !== Object.keys(state).length;

        return hasChanged ? newState : state;
    }
}

function applyMiddleware(...middlewares) {
    return (createStore) => (reducer, ...args) => {
        const store = createStore(reducer, ...args);
        const _dispatch = () => {
            throw new Error('_dispatch not init');
        }
        const middlewaresApi = {
            getState: store.getState,
            dispatch: (...args) => _dispatch(...args),
        };

        const chain = middlewares.map(middleware => middleware(middlewaresApi));
        _dispatch = componse(chain)(store.dispatch);
        return {
            ...store,
            dispatch: _dispatch,
        }
    }
}

function componse(middlewares) {
    return middlewares.reduce((a, b) => (...args) => a(b(...args)));
}