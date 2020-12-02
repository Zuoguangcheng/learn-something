/**
 * @fileoverview 创建store
 * @author liuduan
 * @Date 2020-06-27 23:29:46
 * @LastEditTime 2020-06-28 00:19:31
 */
import createStore from './useHooksRedux';


const initialState = { count: 0 };

function middlewareLog(store, preState, nextState, action) {
    console.log(action.type);
    console.log('🐖', preState);
    console.log('🐒', nextState);
}

const { Provider, store } = createStore(initialState, [middlewareLog]);

export {
    Provider,
    store,
}