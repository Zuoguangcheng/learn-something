import ActionTypes from './utils/actionTypes'
import warning from './utils/warning'
import isPlainObject from './utils/isPlainObject'

function getUndefinedStateErrorMessage(key, action) {
  const actionType = action && action.type
  const actionDescription =
    (actionType && `action "${String(actionType)}"`) || 'an action'

  return (
    `Given ${actionDescription}, reducer "${key}" returned undefined. ` +
    `To ignore an action, you must explicitly return the previous state. ` +
    `If you want this reducer to hold no value, you can return null instead of undefined.`
  )
}

function getUnexpectedStateShapeWarningMessage(
  inputState,
  reducers,
  action,
  unexpectedKeyCache
) {
  const reducerKeys = Object.keys(reducers)
  const argumentName =
    action && action.type === ActionTypes.INIT
      ? 'preloadedState argument passed to createStore'
      : 'previous state received by the reducer'

  if (reducerKeys.length === 0) {
    return (
      'Store does not have a valid reducer. Make sure the argument passed ' +
      'to combineReducers is an object whose values are reducers.'
    )
  }

  if (!isPlainObject(inputState)) {
    return (
      `The ${argumentName} has unexpected type of "` +
      {}.toString.call(inputState).match(/\s([a-z|A-Z]+)/)[1] +
      `". Expected argument to be an object with the following ` +
      `keys: "${reducerKeys.join('", "')}"`
    )
  }

  const unexpectedKeys = Object.keys(inputState).filter(
    key => !reducers.hasOwnProperty(key) && !unexpectedKeyCache[key]
  )

  unexpectedKeys.forEach(key => {
    unexpectedKeyCache[key] = true
  })

  if (action && action.type === ActionTypes.REPLACE) return

  if (unexpectedKeys.length > 0) {
    return (
      `Unexpected ${unexpectedKeys.length > 1 ? 'keys' : 'key'} ` +
      `"${unexpectedKeys.join('", "')}" found in ${argumentName}. ` +
      `Expected to find one of the known reducer keys instead: ` +
      `"${reducerKeys.join('", "')}". Unexpected keys will be ignored.`
    )
  }
}

/**
 * 
 * @param {*} reducers 
 * 
 * 这个方法用来确保每个reducer 都有一个default返回值
 * 没什么卵用，不影响大体思路
 */
function assertReducerShape(reducers) {
  Object.keys(reducers).forEach(key => {
    const reducer = reducers[key]
    const initialState = reducer(undefined, { type: ActionTypes.INIT })

    if (typeof initialState === 'undefined') {
      throw new Error(
        `Reducer "${key}" returned undefined during initialization. ` +
          `If the state passed to the reducer is undefined, you must ` +
          `explicitly return the initial state. The initial state may ` +
          `not be undefined. If you don't want to set a value for this reducer, ` +
          `you can use null instead of undefined.`
      )
    }

    if (
      typeof reducer(undefined, {
        type: ActionTypes.PROBE_UNKNOWN_ACTION()
      }) === 'undefined'
    ) {
      throw new Error(
        `Reducer "${key}" returned undefined when probed with a random type. ` +
          `Don't try to handle ${ActionTypes.INIT} or other actions in "redux/*" ` +
          `namespace. They are considered private. Instead, you must return the ` +
          `current state for any unknown actions, unless it is undefined, ` +
          `in which case you must return the initial state, regardless of the ` +
          `action type. The initial state may not be undefined, but can be null.`
      )
    }
  })
}

export default function combineReducers(reducers) {
  // reducerKeys  对应的就是 reducer 的 function 的name
  // eg: [count, age]
  const reducerKeys = Object.keys(reducers);

  /**
   * 下面一段没什么用， 用来校验reducer是否是可用的
   * =====================================
   */
  const finalReducers = {}

  for (let i = 0; i < reducerKeys.length; i++) {
    const key = reducerKeys[i]

    if (process.env.NODE_ENV !== 'production') {
      if (typeof reducers[key] === 'undefined') {
        warning(`No reducer provided for key "${key}"`)
      }
    }

    if (typeof reducers[key] === 'function') {
      finalReducers[key] = reducers[key]
    }
  }
  const finalReducerKeys = Object.keys(finalReducers)

  /**
   * =================================================
   */
  // This is used to make sure we don't warn about the same
  // keys multiple times.
  let unexpectedKeyCache
  if (process.env.NODE_ENV !== 'production') {
    unexpectedKeyCache = {}
  }

  /* 用来确定 每个reducer都有个default返回值，否则报错，写代码要严谨 */
  let shapeAssertionError
  try {
    assertReducerShape(finalReducers)
  } catch (e) {
    shapeAssertionError = e
  }


  /**
   * currentState = currentReducer(currentState, action);
   * 
   * 返回的这个 combination 实际上是在dispatch 中调用的， 传入的参数是当前state的值
   * 第二个参数为dispatch时候
  */
  return function combination(state = {}, action) {
    if (shapeAssertionError) {
      throw shapeAssertionError
    }

    if (process.env.NODE_ENV !== 'production') {
      const warningMessage = getUnexpectedStateShapeWarningMessage(
        state,
        finalReducers,
        action,
        unexpectedKeyCache
      )
      if (warningMessage) {
        warning(warningMessage)
      }
    }

    let hasChanged = false
    const nextState = {}
    for (let i = 0; i < finalReducerKeys.length; i++) {
      // reducer的key  eg: count
      const key = finalReducerKeys[i]

      // reducer的函数内容
      /**
       * (state = 0, action) => {
            switch (action.type) {
                case 'ADD': return state + 1;
                case 'REDUCE': return state - 1;
                default: return state;
            }
        };
       */
      const reducer = finalReducers[key]

      // 目前state 关于当前这次循环reducer的key的值；
      // 第一次 分别是 100 和 1 可见reducer的初始设置值
      // 如果初始值不设置，则都是undefined
      const previousStateForKey = state[key];


      /**
       * 执行 reducer action为{ type: 'REDUCE' }
       * 这里面循环执行了所有的reducer函数
       * 也就是说，当我们dispatch一个action 的时候，传入的参数为当前action 比如 {type: "REDUCE"}
       * 然后将这个参数传递个每一个reducer中去执行，所有 action 中的type 必须是全局统一的
       * 
       * reducer中 每一个case 返回的值 都会在这里赋值给nextStateForKey
       * 
       * previousStateForKey 是当前state中当前这个key存储的值，
       * 如果action没有匹配上，需要将previousStateForKey返回回来，‘
       * 这也是 reducer中default中需要将第一个参数返回来的原因。
       * 
       * 
       */
      const nextStateForKey = reducer(previousStateForKey, action);

      // 这里禁止返回undefined
      if (typeof nextStateForKey === 'undefined') {
        const errorMessage = getUndefinedStateErrorMessage(key, action)
        throw new Error(errorMessage)
      }


      // nextState 每一次dispatch都重新生成的
      // nextState 存储的是
      // 如果这次dispatch  reducer命中了，则返回reducer中对于该次命中处理的逻辑
      // 如果没有命中，则返回reducer 中default的逻辑
      // 最终将store 中的currentState 重新复制一遍 或者 reducer修改返回的值 存储到nextState中
      nextState[key] = nextStateForKey

      // 这次dispatch 如果执行reducer中有一次命中了 则 hasChange 为true
      // 正常dispatch都是为了修改，所以大部分情况都是true
      hasChanged = hasChanged || nextStateForKey !== previousStateForKey
    }

    // 有可能半路改了reducer了？
    // 不太明白什么时候 finalReducerKeys.length !== Object.keys(state).length
    hasChanged =
      hasChanged || finalReducerKeys.length !== Object.keys(state).length

      // 返回一个新的 state，直接复制给了store中的currentState
      // 也就是getState() 时候返回的值
    return hasChanged ? nextState : state
  }
}
