/**
 * @fileoverview 
 * @author liuduan
 * @Date 2020-06-08 16:04:13
 * @LastEditTime 2020-06-09 14:45:25
 */
/* import {
    // createStore,
    // combineReducers,
    // applyMiddleware,
} from 'redux'; */
/* import {
    createStore,
    combineReducers,
    applyMiddleware,
} from './core/redux'; */

import { createStore, combineReducers, applyMiddleware } from '../redux-new/src/index';

import * as reducers from './reducers';

/* thunk 中间件 */
function createThunkMiddleware(extraArgument) {
    return ({ dispatch, getState }) => (next) => (action) => {
        console.log('next1', next);
        console.log('action1', action);

        console.log('thunk-start');
        if (typeof action === 'function') {
            // console.log(next);
            // 这里参数使用dispatch而不是使用next，
            // 是因为next这里是logger中间，action方法中调用next就相当于往下走中间，而不是重头开始走
            // 如果接下来用next去dispatch的action扔是一个异步方法，就是会报错
            return action(dispatch, getState, extraArgument);
        }
        console.log('--------------thunk-sync-ing...------------');
        const res = next(action);
        console.log('thunk-end');
        return res;

    };
}
const thunk = createThunkMiddleware();

/* logger 中间件 */
function createLoggerMiddleware() {
    return ({ dispatch, getState }) => (next) => (action) => {
        console.log('next2', next);
        console.log('action2', action);
        console.log('logger-start')
        // 这里不能使用dispatch(action)，会造成死循环
        // logger是最后一个中间件时，这时的next是原始store.dispatch
        // 闭包中dispatch是中间件返回的dispatch
        // console.log('logger-next', next.toString());
        const res = next(action);
        console.log('logger-end');
        console.log('+++++++++++++++++++++走到这里表示：一次dispatch向下dps完全结束，开始往上走+++++++++++++++++++++');
        return res;
    };
}
const logger = createLoggerMiddleware();


/* 
const defaultState = 0;
const reducer = (state = defaultState, action) => {
    switch (action.type) {
        case 'ADD':
            return state + action.payload;
        default:
            return state;
    }
}; 
*/

/* 
const reducer = function (state = {}, action) {
    return {
        count: reducers.count(state.count, action),
    }
} 
// 等同于
const reducer = combineReducers(reducers)
*/
const reducer = combineReducers(reducers);

const store = createStore(
    reducer,
    {
        // 这里属性名就reducer的方法名
        count: 100,
        age: 1
    },
    // 作用是将所有中间件组成一个数组，依次执行，logger必须在最后
    // 执行顺序：thunk-start / next这里相当于logger执行，logger-start / 原始dispatch-action / logger-end / thunk-end
    // 执行顺序：同koa2的洋葱模型
    applyMiddleware(thunk, logger),
);


// let next = store.dispatch;
// store.dispatch = function dispatchAndLog(action) {
//     console.log('dispatching', action);
//     next(action);
//     console.log('next state', store.getState());
// }

export default store;


/*
import * as reducers from './reducers';
const reducer = combineReducers(reducers);
const chatReducer = combineReducers({
    chatLog,
    statusMessage,
    userName
})
// 或者
const reducer = combineReducers({
  a: doSomethingWithA,
  b: processB,
  c: c
})
// 等同于
function reducer(state = {}, action) {
    return {
        a: doSomethingWithA(state.a, action),
        b: processB(state.b, action),
        c: c(state.c, action)
    }
}
*/


/* actions */
/*
const ADD = 'ADD';
function add(payload) {
    return {
        type: ADD,
        payload
    }
}
*/

/* dispatch */
/*
store.dispatch(add(1));
// Store 允许使用store.subscribe方法设置监听函数，一旦 State 发生变化，就自动执行这个函数。
let unsubscribe = store.subscribe(() =>
    console.log(store.getState())
);
unsubscribe();
*/
