/**
 * @fileoverview 
 * @author liuduan
 * @Date 2020-06-19 20:21:44
 * @LastEditTime 2020-06-19 22:37:26
 */
import createStore from './core/createStore';
import combineReducers from './core/combineReducers';
import applyMiddleware, { loggerMiddleware, catchErrorMiddleware, asyncFetchMiddleware } from './core/applyMiddleware';

function count(preState = 0, action) {
    switch (action.type) {
        case 'ADD':
            return preState + 1;
        case 'REDUCE':
            return preState - 1;
        default:
            return preState;
    }
}

// function reducer(store = {}, action) {
//     return {
//         count: count(store.count, action),
//     }
// }
const reducer = combineReducers({
    count,
});

let store = createStore(reducer, undefined, applyMiddleware(catchErrorMiddleware, asyncFetchMiddleware, loggerMiddleware));


store.subscribe(function () {
    console.log('subscribe-1', store.getState())
});

store.subscribe(function () {
    console.log('subscribe-2', store.getState())
});

// store.changeState({
//     ...store.getState(),
//     name: '王者之志',
// });

store.dispatch({
    type: 'ADD',
});

setTimeout(() => {
    store.dispatch(function (dispatch, getState) {
        setTimeout(() => {
            // 同步action
            dispatch({ type: 'REDUCE' });
        }, 200);
    });
}, 2000);