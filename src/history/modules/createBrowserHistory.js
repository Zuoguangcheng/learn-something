import warning from 'warning'
import invariant from 'invariant'
import { createLocation } from './LocationUtils'
import { stripPrefix, parsePath, createPath } from './PathUtils'
import createTransitionManager from './createTransitionManager'
import { canUseDOM } from './ExecutionEnvironment'
import {
  addEventListener,
  removeEventListener,
  getConfirmation,
  supportsHistory,
  supportsPopStateOnHashChange
} from './DOMUtils'

const PopStateEvent = 'popstate'
const HashChangeEvent = 'hashchange'

const getHistoryState = () => {
  try {
    return window.history.state || {}
  } catch (e) {
    // IE 11 sometimes throws when accessing window.history.state
    // See https://github.com/mjackson/history/pull/289
    return {}
  }
}

/**
 * Creates a history object that uses the HTML5 history API including
 * pushState, replaceState, and the popstate event.
 */
const createBrowserHistory = (props = {}) => {
  invariant(
    canUseDOM,
    'Browser history needs a DOM'
  )

  // 将window.history 赋值给 globalHistory
  const globalHistory = window.history

  // 判断环境是否支持history对象
  const canUseHistory = supportsHistory();


  // IE11 不支持 popstate hashchange
  const needsHashChangeListener = !supportsPopStateOnHashChange()

  const {
    basename = '',
    forceRefresh = false,
    // 获取一个 window.confirm 函数
    getUserConfirmation = getConfirmation,
    keyLength = 6
  } = props

  const getDOMLocation = (historyState) => {
    // todo
    const { key, state } = (historyState || {})

    // http://localhost:8080/abc?a=10&b=20#dddd=10
    // pathname: /abc  search: ?a=10&b=10  hash: #dddd=10
    const { pathname, search, hash } = window.location

    // /abc?a=10&b=20#dddd=10
    let path = pathname + search + hash

    /**
     * stripPrefix 方法的作用
     * 
     * path = /abc?a=10&b=20#dddd=10
     * 
     * if basename===/abc
     * path = "?a=10&b=20#dddd=10"
     * else 
     * path = path
     */
    if (basename)
      path = stripPrefix(path, basename)




      /**
       * 
       * 输入 /abc?a=10&b=20#dddd=10
       * 
       * 返回
       * {
       *   hash: "#dddd=10"
       *   pathname: "/abc"
       *   search: "?a=10&b=20"
       * }
       * 
       */
    // const a = parsePath(path);


    return {
      ...parsePath(path),
      state,
      key
    }
  }

  const createKey = () =>
    Math.random().toString(36).substr(2, keyLength)

  const transitionManager = createTransitionManager()

  const setState = (nextState) => {
    Object.assign(history, nextState)

    history.length = globalHistory.length

    transitionManager.notifyListeners(
      history.location,
      history.action
    )
  }

  const handlePopState = (event) => {
    if (event.state === undefined)
      return // Ignore extraneous popstate events in WebKit.

    handlePop(getDOMLocation(event.state))
  }

  const handleHashChange = () => {
    handlePop(getDOMLocation(getHistoryState()))
  }

  let forceNextPop = false

  const handlePop = (location) => {
    if (forceNextPop) {
      forceNextPop = false
      setState()
    } else {
      const action = 'POP'

      transitionManager.confirmTransitionTo(location, action, getUserConfirmation, (ok) => {
        if (ok) {
          setState({ action, location })
        } else {
          revertPop(location)
        }
      })
    }
  }

  /**
   * 如果使用history.block()进行拦截，并且拦截返回false(就是阻止跳转了)。调用该方法
   * 调用的目的将url修正过来
   * 
   * @param {}} fromLocation 
   */
  const revertPop = (fromLocation) => {
    /**
     * formLocation 获取的是window.location  url中展示的值
     * toLocation 获取的是history.location  就是导出的变量history中存储的值， 不是window.history
     **/
    const toLocation = history.location

    // TODO: We could probably make this more reliable by
    // keeping a list of keys we've seen in sessionStorage.
    // Instead, we just default to 0 for keys we don't know.

    let toIndex = allKeys.indexOf(toLocation.key)

    if (toIndex === -1)
      toIndex = 0

    let fromIndex = allKeys.indexOf(fromLocation.key)

    if (fromIndex === -1)
      fromIndex = 0

    const delta = toIndex - fromIndex

    if (delta) {
      forceNextPop = true
      go(delta)
    }
  }

  /**
       * 
       * 输入 /abc?a=10&b=20#dddd=10
       * 
       * 返回
       * {
       *   hash: "#dddd=10"
       *   pathname: "/abc"
       *   search: "?a=10&b=20"
       *   key: undefined,
       *   state: undefined
       * }
       * 
       */
  const initialLocation = getDOMLocation(getHistoryState())
  let allKeys = [ initialLocation.key ]

  // Public interface

  const push = (path, state) => {
    warning(
      !(typeof path === 'object' && path.state !== undefined && state !== undefined),
      'You should avoid providing a 2nd state argument to push when the 1st ' +
      'argument is a location-like object that already has state; it is ignored'
    )

    const action = 'PUSH'

    /**
     * 获取完整location
     * {
     *  hash: ""
     *  key: "uz22po"
     *  pathname: "/1"
     *  search: ""
     *  state: {page: 1}
     * }
     */
    const location = createLocation(path, state, createKey(), history.location)

    transitionManager.confirmTransitionTo(location, action, getUserConfirmation, (ok) => {
      if (!ok)
        return

      const url = basename + createPath(location)
      const { key, state } = location

      if (canUseHistory) {
        globalHistory.pushState({ key, state }, null, url)

        if (forceRefresh) {
          window.location.href = url
        } else {
          const prevIndex = allKeys.indexOf(history.location.key)
          const nextKeys = allKeys.slice(0, prevIndex === -1 ? 0 : prevIndex + 1)

          nextKeys.push(location.key)
          allKeys = nextKeys

          setState({ action, location })
        }
      } else {
        // 如果不支持的话 点击跳转使用window.location.href 跳转
        warning(
          state === undefined,
          'Browser history cannot push state in browsers that do not support HTML5 history'
        )

        window.location.href = url
      }
    })
  }

  const replace = (path, state) => {
    warning(
      !(typeof path === 'object' && path.state !== undefined && state !== undefined),
      'You should avoid providing a 2nd state argument to replace when the 1st ' +
      'argument is a location-like object that already has state; it is ignored'
    )

    const action = 'REPLACE'
    const location = createLocation(path, state, createKey(), history.location)

    transitionManager.confirmTransitionTo(location, action, getUserConfirmation, (ok) => {
      if (!ok)
        return

      const url = basename + createPath(location)
      const { key, state } = location

      if (canUseHistory) {
        globalHistory.replaceState({ key, state }, null, url)

        if (forceRefresh) {
          window.location.replace(url)
        } else {
          // 这个地方和push() 有一点区别是 allKeys存储的内容不同， replace会替换当前keys 而push 是要添加一个keys
          const prevIndex = allKeys.indexOf(history.location.key)

          if (prevIndex !== -1)
            // 替换keys
            allKeys[prevIndex] = location.key

          setState({ action, location })
        }
      } else {
        warning(
          state === undefined,
          'Browser history cannot replace state in browsers that do not support HTML5 history'
        )

        window.location.replace(url)
      }
    })
  }

  const go = (n) => {
    globalHistory.go(n)
  }

  const goBack = () =>
    go(-1)

  const goForward = () =>
    go(1)

  let listenerCount = 0

  /**
   * 
   * 如果页面有监听url变化， 则需要绑定popstate 和 hashchange 监听方法
   * @param {*} delta 
   * 
   */
  const checkDOMListeners = (delta) => {
    listenerCount += delta

    if (listenerCount === 1) {
      addEventListener(window, PopStateEvent, handlePopState)

      if (needsHashChangeListener)
        addEventListener(window, HashChangeEvent, handleHashChange)
    } else if (listenerCount === 0) {
      removeEventListener(window, PopStateEvent, handlePopState)

      if (needsHashChangeListener)
        removeEventListener(window, HashChangeEvent, handleHashChange)
    }
  }

  let isBlocked = false

  const block = (prompt = false) => {

    const unblock = transitionManager.setPrompt(prompt)

    if (!isBlocked) {
      checkDOMListeners(1)
      isBlocked = true
    }

    return () => {
      if (isBlocked) {
        isBlocked = false
        checkDOMListeners(-1)
      }

      return unblock()
    }
  }

  const listen = (listener) => {
    const unlisten = transitionManager.appendListener(listener)
    checkDOMListeners(1)

    return () => {
      checkDOMListeners(-1)
      return unlisten()
    }
  }

  const history = {
    length: globalHistory.length,
    action: 'POP',
    location: initialLocation,
    push,
    replace,
    go,
    goBack,
    goForward,
    block,
    listen
  }

  return history
}

export default createBrowserHistory
