// 是否支持 history.pushState
function supportsHistory() {
    var ua = window.navigator.userAgent;
    if ((ua.indexOf('Android 2.') !== -1 || ua.indexOf('Android 4.0') !== -1) && ua.indexOf('Mobile Safari') !== -1 && ua.indexOf('Chrome') === -1 && ua.indexOf('Windows Phone') === -1) return false;
    return window.history && 'pushState' in window.history;
}

// 是否支持popState事件，Trident：IE6-11 不支持
function supportsPopStateOnHashChange() {
    return window.navigator.userAgent.indexOf('Trident') === -1;
}

function hasBasename(path, prefix) {
    return path.toLowerCase().indexOf(prefix.toLowerCase()) === 0 && '/?#'.indexOf(path.charAt(prefix.length)) !== -1;
}

function stripBasename(path, prefix) {
    return hasBasename(path, prefix) ? path.substr(prefix.length) : path;
}


function createLocation(path, state, key, currentLocation) { // path = '/a'
    var location;

    if (typeof path === 'string') {
        // Two-arg form: push(path, state)
        location = parsePath(path);
        location.state = state;
    } else {
        // One-arg form: push(location)
        location = Object.assign({}, path);
        if (location.pathname === undefined) location.pathname = '';

        if (location.search) {
            if (location.search.charAt(0) !== '?') location.search = '?' + location.search;
        } else {
            location.search = '';
        }

        if (location.hash) {
            if (location.hash.charAt(0) !== '#') location.hash = '#' + location.hash;
        } else {
            location.hash = '';
        }

        if (state !== undefined && location.state === undefined) location.state = state;
    }

    location.pathname = decodeURI(location.pathname);

    if (key) location.key = key;

    if (currentLocation) {
    } else {
        if (!location.pathname) {
            location.pathname = '/';
        }
    }

    return location;
}



// 订阅 && 触发 事件
function createTransitionManager() {
    var prompt = null;

    function setPrompt(nextPrompt) {
        prompt = nextPrompt;
        return function () {
            if (prompt === nextPrompt) prompt = null;
        };
    }

    var listeners = [];

    function appendListener(fn) {
        var isActive = true;

        function listener() {
            if (isActive) fn.apply(void 0, arguments);
        }

        listeners.push(listener);
        return function () {
            isActive = false;
            listeners = listeners.filter(function (item) {
                return item !== listener;
            });
        };
    }

    function notifyListeners() {
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        // 便利执行所有的订阅事件，Router组件执行setState location，走render更新组件
        listeners.forEach(function (listener) {
            return listener.apply(void 0, args);
        });
    }

    return {
        setPrompt: setPrompt,
        appendListener: appendListener,
        notifyListeners: notifyListeners
    };
}



export function createBrowserHistory(props) {
    var globalHistory = window.history;
    var canUseHistory = supportsHistory();
    var needsHashChangeListener = !supportsPopStateOnHashChange();

    var _props = props,

        _props$forceRefresh = _props.forceRefresh,
        forceRefresh = _props$forceRefresh === void 0 ? false : _props$forceRefresh,

        _props$keyLength = _props.keyLength, // TODO: 什么鬼？先往下看
        keyLength = _props$keyLength === void 0 ? 6 : _props$keyLength;

    var basename = props.basename || '';

    function getDOMLocation(historyState) {
        var _ref = historyState || {},
            key = _ref.key,
            state = _ref.state;

        var _window$location = window.location,
            pathname = _window$location.pathname,
            search = _window$location.search,
            hash = _window$location.hash;
        var path = pathname + search + hash;

        if (basename) path = stripBasename(path, basename);

        return createLocation(path, state, key);
    }

    function createKey() {
        return Math.random().toString(36).substr(2, keyLength);
    }

    var transitionManager = createTransitionManager();

    function setState(nextState) {
        Object.assign(history, nextState);

        history.length = globalHistory.length;
        transitionManager.notifyListeners(history.location, history.action);
    }

    
    /*
     * addEventListener popState
     * 当活动历史记录条目更改时，将触发popstate事件。如果被激活的历史记录条目是通过对history.pushState（）的调用创建的，或者受到对history.replaceState（）的调用的影响，popstate事件的state属性包含历史条目的状态对象的副本。
     */
    function handlePopState(event) {
        // Ignore extraneous popstate events in WebKit.
        if (event.state === undefined && navigator.userAgent.indexOf('CriOS') === -1) return;
        // 这里相对hashhistory少了判断ignorePath这一步，这是因为调用history.pushState()或history.replaceState()不会触发popstate事件。
        // 只有在做出浏览器动作时，才会触发该事件，
        // 如用户点击浏览器的回退按钮（或者在Javascript代码中调用history.back()或者history.forward()方法）
        handlePop(getDOMLocation(event.state));
    }

    // addEventListener hashchange 这是监听popState的降级方案
    // function handleHashChange() {
    //     handlePop(getDOMLocation(getHistoryState()));
    // }

    var forceNextPop = false;

    function handlePop(location) {
        if (forceNextPop) {
            forceNextPop = false;
            setState();
        } else {
            setState({
                action: 'POP',
                location: location
            });
        }
    }

    var initialLocation = getDOMLocation(getHistoryState());
    var allKeys = [initialLocation.key]; // Public interface

    function createHref(location) {
        return basename + createPath(location);
    }

    function push(path, state) {
        var location = createLocation(path, state, createKey(), history.location);

        var href = createHref(location);
        var key = location.key,
            state = location.state;

        if (canUseHistory) {
            // pushState-params: state<Object> | title<String> | url<String>
            globalHistory.pushState({
                key: key,
                state: state
            }, null, href);

            if (forceRefresh) {
                window.location.href = href;
            } else {
                var prevIndex = allKeys.indexOf(history.location.key);
                var nextKeys = allKeys.slice(0, prevIndex + 1);
                
                nextKeys.push(location.key);
                allKeys = nextKeys;

                setState({
                    action: 'PUSH',
                    location: location
                });
            }
        } else {
            window.location.href = href;
        }
    }

    function replace(path, state) {
        var location = createLocation(path, state, createKey(), history.location);
        var href = createHref(location);
        var key = location.key,
            state = location.state;

        if (canUseHistory) {
            globalHistory.replaceState({
                key: key,
                state: state
            }, null, href);

            if (forceRefresh) {
                window.location.replace(href);
            } else {
                var prevIndex = allKeys.indexOf(history.location.key);
                if (prevIndex !== -1) allKeys[prevIndex] = location.key;
                setState({
                    action: 'REPLACE',
                    location: location
                });
            }
        } else {
            window.location.replace(href);
        }
    }

    function go(n) {
        globalHistory.go(n);
    }

    function goBack() {
        go(-1);
    }

    function goForward() {
        go(1);
    }

    var listenerCount = 0;

    function checkDOMListeners(delta) {
        listenerCount += delta;

        if (listenerCount === 1 && delta === 1) {
            window.addEventListener('popstate', handlePopState);
            // if (needsHashChangeListener) window.addEventListener('hashchange', handleHashChange);
        } else if (listenerCount === 0) {
            window.removeEventListener('popstate', handlePopState);
            // if (needsHashChangeListener) window.removeEventListener('hashchange', handleHashChange);
        }
    }

    var isBlocked = false;

    function block(prompt) {
        if (prompt === void 0) {
            prompt = false;
        }

        var unblock = transitionManager.setPrompt(prompt);

        if (!isBlocked) {
            checkDOMListeners(1);
            isBlocked = true;
        }

        return function () {
            if (isBlocked) {
                isBlocked = false;
                checkDOMListeners(-1);
            }

            return unblock();
        };
    }

    function listen(listener) {
        var unlisten = transitionManager.appendListener(listener);
        checkDOMListeners(1);
        return function () {
            checkDOMListeners(-1);
            unlisten();
        };
    }

    var history = {
        length: globalHistory.length,
        action: 'POP',
        location: initialLocation,
        createHref: createHref,
        push: push,
        replace: replace,
        go: go,
        goBack: goBack,
        goForward: goForward,
        block: block,
        listen: listen
    };
    return history;
}