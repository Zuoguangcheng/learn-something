import warning from 'warning'
import invariant from 'invariant'
import { createLocation, locationsAreEqual } from './LocationUtils'
import { addLeadingSlash, stripLeadingSlash, stripPrefix, parsePath, createPath } from './PathUtils'
import createTransitionManager from './createTransitionManager'
import { canUseDOM } from './ExecutionEnvironment'
import {
  addEventListener,
  removeEventListener,
  getConfirmation,
  supportsGoWithoutReloadUsingHash
} from './DOMUtils'

const HashChangeEvent = 'hashchange'

const HashPathCoders = {
  hashbang: {
    encodePath: (path) => path.charAt(0) === '!' ? path : '!/' + stripLeadingSlash(path),
    decodePath: (path) => path.charAt(0) === '!' ? path.substr(1) : path
  },
  noslash: {
    encodePath: stripLeadingSlash,
    decodePath: addLeadingSlash
  },
  slash: {
    encodePath: addLeadingSlash,
    decodePath: addLeadingSlash
  }
}

const getHashPath = () => {
  // We can't use window.location.hash here because it's not
  // consistent across browsers - Firefox will pre-decode it!
  const href = window.location.href
  const hashIndex = href.indexOf('#')
  return hashIndex === -1 ? '' : href.substring(hashIndex + 1)
}

const pushHashPath = (path) =>
  window.location.hash = path

const replaceHashPath = (path) => {
  const hashIndex = window.location.href.indexOf('#')

  window.location.replace(
    window.location.href.slice(0, hashIndex >= 0 ? hashIndex : 0) + '#' + path
  )
}

const createHashHistory = (props = {}) => {
  invariant(
    canUseDOM,
    'Hash history needs a DOM'
  )

  const globalHistory = window.history
  // firefox => false  other -> true
  const canGoWithoutReload = supportsGoWithoutReloadUsingHash()

  const {
    basename = '',
    getUserConfirmation = getConfirmation,
    hashType = 'slash'
  } = props

  //  获取 encodePath  decodePath path不是以'/'开头 默认会在path前面增加一个 '/' 字符串
  const { encodePath, decodePath } = HashPathCoders[hashType]

  const getDOMLocation = () => {
    
    // 获取hash部分， 并且path不是以'/'开头的 默认会在path前面增加一个 '/' 字符串
    // http://localhost:8080/#/1 -> /1
    let path = decodePath(getHashPath())

    if (basename)
      path = stripPrefix(path, basename)

    return parsePath(path)
  }

  const transitionManager = createTransitionManager()

  const setState = (nextState) => {
    Object.assign(history, nextState)

    history.length = globalHistory.length

    transitionManager.notifyListeners(
      history.location,
      history.action
    )
  }

  let forceNextPop = false
  // ignorePath  handleHashChange 当push 或者replace时候也会触发 handleHashChange
  // 因此 当push 和 replace 时候要赋值ignorePath
  // handleHashChange 触发的时候对于 ignorePath 的路由就不做处理了，因为在push 和 replace中处理了
  let ignorePath = null

  const handleHashChange = () => {
    const path = getHashPath()
    const encodedPath = encodePath(path)

    if (path !== encodedPath) {
      // Ensure we always have a properly-encoded hash.


      // replaceHashPath
      // http://localhost:8080/?a=10&b=10/#abc/1 -> http://localhost:8080/?a=10&b=10/#/abc/1
      replaceHashPath(encodedPath)
    } else {
      const location = getDOMLocation()
      const prevLocation = history.location

      if (!forceNextPop && locationsAreEqual(prevLocation, location))
        return // A hashchange doesn't always == location change.

      if (ignorePath === createPath(location))
        return // Ignore this change; we already setState in push/replace.

      ignorePath = null

      handlePop(location)
    }
  }

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

  const revertPop = (fromLocation) => {
    const toLocation = history.location

    // TODO: We could probably make this more reliable by
    // keeping a list of paths we've seen in sessionStorage.
    // Instead, we just default to 0 for paths we don't know.

    let toIndex = allPaths.lastIndexOf(createPath(toLocation))

    if (toIndex === -1)
      toIndex = 0

    let fromIndex = allPaths.lastIndexOf(createPath(fromLocation))

    if (fromIndex === -1)
      fromIndex = 0

    const delta = toIndex - fromIndex

    if (delta) {
      forceNextPop = true
      go(delta)
    }
  }


  // Ensure the hash is encoded properly before doing anything else.
  /**
   * http://localhost:8080/#/abc/1
   * 
   * path:  /abc/1
   */
  const path = getHashPath()
  const encodedPath = encodePath(path)

  // replaceHashPath
      // http://localhost:8080/?a=10&b=10/#abc/1 -> http://localhost:8080/?a=10&b=10/#/abc/1
  if (path !== encodedPath)
    replaceHashPath(encodedPath)

  const initialLocation = getDOMLocation()
  let allPaths = [ createPath(initialLocation) ]

  // Public interface

  const push = (path, state) => {
    warning(
      state === undefined,
      'Hash history cannot push state; it is ignored'
    )

    const action = 'PUSH'
    const location = createLocation(path, undefined, undefined, history.location)

    transitionManager.confirmTransitionTo(location, action, getUserConfirmation, (ok) => {
      if (!ok)
        return

      const path = createPath(location)
      const encodedPath = encodePath(basename + path)
      const hashChanged = getHashPath() !== encodedPath

      if (hashChanged) {
        // We cannot tell if a hashchange was caused by a PUSH, so we'd
        // rather setState here and ignore the hashchange. The caveat here
        // is that other hash histories in the page will consider it a POP.
        ignorePath = path
        pushHashPath(encodedPath)

        const prevIndex = allPaths.lastIndexOf(createPath(history.location))
        const nextPaths = allPaths.slice(0, prevIndex === -1 ? 0 : prevIndex + 1)

        nextPaths.push(path)
        allPaths = nextPaths

        setState({ action, location })
      } else {
        warning(
          false,
          'Hash history cannot PUSH the same path; a new entry will not be added to the history stack'
        )

        setState()
      }
    })
  }

  const replace = (path, state) => {
    warning(
      state === undefined,
      'Hash history cannot replace state; it is ignored'
    )

    const action = 'REPLACE'
    const location = createLocation(path, undefined, undefined, history.location)

    transitionManager.confirmTransitionTo(location, action, getUserConfirmation, (ok) => {
      if (!ok)
        return

      const path = createPath(location)
      const encodedPath = encodePath(basename + path)
      const hashChanged = getHashPath() !== encodedPath

      if (hashChanged) {
        // We cannot tell if a hashchange was caused by a REPLACE, so we'd
        // rather setState here and ignore the hashchange. The caveat here
        // is that other hash histories in the page will consider it a POP.
        ignorePath = path
        replaceHashPath(encodedPath)
      }

      const prevIndex = allPaths.indexOf(createPath(history.location))

      if (prevIndex !== -1)
        allPaths[prevIndex] = path

      setState({ action, location })
    })
  }

  const go = (n) => {
    warning(
      canGoWithoutReload,
      'Hash history go(n) causes a full page reload in this browser'
    )

    globalHistory.go(n)
  }

  const goBack = () =>
    go(-1)

  const goForward = () =>
    go(1)

  let listenerCount = 0

  const checkDOMListeners = (delta) => {
    listenerCount += delta

    if (listenerCount === 1) {
      addEventListener(window, HashChangeEvent, handleHashChange)
    } else if (listenerCount === 0) {
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

export default createHashHistory
