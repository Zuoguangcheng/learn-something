/**
 * @fileoverview 
 * @author liuduan
 * @Date 2020-06-23 21:44:45
 * @LastEditTime 2020-06-28 00:21:44
 */
import React, { createContext, useContext, useReducer } from 'react';


export default function createStore(initialState, middlewares = []) {
    const AppContext = createContext(initialState);

    const store = {
        _state: initialState,
        dispatch: undefined,
        getState: () => store._state,
        useContext: () => useContext(AppContext),
    };

    function reducers(preState, action) {
        // switch (action.type) {
        //     case 'ADD':

        //         return store._state = {
        //             ...preState,
        //             count: action.payload !== undefined ? action.payload : preState.count + 1,
        //         };

        //     default:
        //         return store._state = preState;
        // }
        
        let nextState = preState;
        if (typeof action.reducer === 'function') {
            nextState = action.reducer(preState);
        }

        for (let middleware of middlewares) {
            const newState = middleware(store, preState, nextState, action);
            if (newState) {
                nextState = newState;
            }
        }

        //store中的数据 实时更新
        store._state = nextState;
        return nextState;
    }

    function Provider(props) {
        const [state, dispatch] = useReducer(reducers, initialState);

        if (!store.dispatch) {
            store.dispatch = action => {
                // 实现异步action-thunk
                if (typeof action === 'function') {
                    action(dispatch, store.getState);
                } else {
                    dispatch(action);
                }
            }
        }

        return <AppContext.Provider value={state} {...props} />;
    }

    return {
        Provider,
        store,
    }
}
