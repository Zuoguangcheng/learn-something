/**
 * @fileoverview 
 * @author liuduan
 * @Date 2020-06-08 18:09:28
 * @LastEditTime 2020-06-09 10:34:48
 */

/*
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

export default function combineReducers(reducers) {
    return function (state = {}, action) {
        let nextState = {};
        let hasChanged = false;
        for (const key of Object.keys(reducers)) {
            const reducer = reducers[key];
            const previousStateForKey = state[key];
            const nextStateForKey = reducer(previousStateForKey, action);
            nextState[key] = nextStateForKey;
            hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
        }

        hasChanged = hasChanged || Object.keys(state).length !== Object.keys(nextState).length

        return hasChanged ? nextState : state;
    }
}