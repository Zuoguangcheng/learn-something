import compose from './compose'

/**
 * Creates a store enhancer that applies middleware to the dispatch method
 * of the Redux store. This is handy for a variety of tasks, such as expressing
 * asynchronous actions in a concise manner, or logging every action payload.
 *
 * See `redux-thunk` package as an example of the Redux middleware.
 *
 * Because middleware is potentially asynchronous, this should be the first
 * store enhancer in the composition chain.
 *
 * Note that each middleware will be given the `dispatch` and `getState` functions
 * as named arguments.
 *
 * @param {...Function} middlewares The middleware chain to be applied.
 * @returns {Function} A store enhancer applying the middleware.
 */
export default function applyMiddleware(...middlewares) {
  /**
   * enhancer(createStore)(reducer, preloadedState)
   * 
   * enhancer(createStore)  即执行了下面的函数
   * 
   * 
   * ...args  -> 是上面的  reducer  preloadedState
   * 这个时候生成了store
   * 
   * 函数 reture 
   * 
   * return {
   *  ...store,
   *  dispatch
   * }
   * 
   * 这里面相当于  执行 createStore 生成一个store 并且返回出去
   * 
   * 通过中间件 去修改 dispatch 方法，生成新的dispatch方法 并且返回回去
   * 
   * 
  */
  return createStore => (...args) => {
    const store = createStore(...args);


    let dispatch = () => {
      throw new Error(
        'Dispatching while constructing your middleware is not allowed. ' +
          'Other middleware would not be applied to this dispatch.'
      )
    }

    const middlewareAPI = {
      getState: store.getState,
      dispatch: (...args) => dispatch(...args)
    }


    /**
     * middlewareAPI 相当于中间件中的({ dispatch, getState }) 
     */
    const chain = middlewares.map(middleware => middleware(middlewareAPI));

    /**
     * chain
     * 
     * [next => action => {
            if (typeof action === 'function') {
                return action(dispatch, getState);
            } else {
                next(action);
            }
        },
        next => action => {
              if (typeof action === 'function') {
                  return action(dispatch, getState);
              } else {
                  next(action);
              }
          }
        ]
     * 
    */

    /**
     * 
     * 
    */

    // 这个componse 方法有点迷，不过最终生成了一个新的dispatch方法
    // 类似koa的洋葱模型，执行完一个中间件后  next(action)后会执行下一个中间件
    // 并且将action传递给下一个中间件
    // next最后执行的方法是store.dispatch
    // 这里的dispatch是被中间件修饰过的
    // 而dispatch则是redux store中最原始的dispatch方法
    dispatch = compose(...chain)(store.dispatch)

    return {
      ...store,
      dispatch
    }
  }
}


// thunk中间件
function thunk() {
  /**
   * 这里next 是下一个中间件
   * 
   * 因为 这里是这样调用的  dispatch = compose(...chain)(store.dispatch)
   * 
   * 最后一个中间件走完之后  会调用store.dispatch，执行最终的dispatch
   * 
   * 如果action是一个function 则会执行该action，并且再该action中会执行dispatch，而这个dispatch是被
   * 中间件修饰过的， 因此还会重新执行一次所有的中间件
  */
  return ({ dispatch, getState }) => next => action => {
      if (typeof action === 'function') {
          return action(dispatch, getState);
      } else {
          next(action);
      }
  }
}