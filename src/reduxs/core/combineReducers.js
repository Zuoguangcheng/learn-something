/**
 * @fileoverview 
 * @author liuduan
 * @Date 2020-06-19 20:54:43
 * @LastEditTime 2020-06-19 21:12:38
 */
export default function combineReducers(reducers) {
    let reducersKeys = Object.keys(reducers);
    return function reducer(preStore, action) {
        let nextStore = {};
        let ismodified = false;

        for (const reducerKey of reducersKeys) {
            const reducer = reducers[reducerKey];
            const preState = preStore[reducerKey];
            const newState = reducer(preState, action);
            nextStore[reducerKey] = newState;
            ismodified = ismodified || preState !== newState;
        }

        ismodified = ismodified || Object.keys(preStore).length !== Object.keys(nextStore).length;

        return ismodified ? nextStore : preStore;
    }
}