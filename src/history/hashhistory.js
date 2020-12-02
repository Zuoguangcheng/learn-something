/**
 * history.push    --> window.location.hash = newHashPath   --> update allPaths --> history.setState --> react.setState --> render --> handleHashChange
 * history.replace --> window.location.replace(newHrefPath) --> update allPaths --> history.setState --> react.setState --> render --> handleHashChange
 * history.goBack  --> window.history.go(-1)                ----------------------> handleHashChange --> history.setState --> react.setState --> render
 * Link 默认走 history.push
 */

 
var encodePath = function addLeadingSlash(path) {
    return path.charAt(0) === '/' ? path : '/' + path;
};

function createPath(location) {
    var pathname = location.pathname,
        search = location.search,
        hash = location.hash;
    var path = pathname || '/';
    if (search && search !== '?') path += search.charAt(0) === '?' ? search : "?" + search;
    if (hash && hash !== '#') path += hash.charAt(0) === '#' ? hash : "#" + hash;
    return path;
}

function getHashPath() {
    // We can't use window.location.hash here because it's not
    // consistent across browsers - Firefox will pre-decode it!
    var href = window.location.href;
    var hashIndex = href.indexOf('#');
    return hashIndex === -1 ? '' : href.substring(hashIndex + 1);
}

function hasBasename(path, prefix) {
    return path.toLowerCase().indexOf(prefix.toLowerCase()) === 0 && '/?#'.indexOf(path.charAt(prefix.length)) !== -1;
}

function stripBasename(path, prefix) {
    return hasBasename(path, prefix) ? path.substr(prefix.length) : path;
}

// string to obj
function parsePath(path) {
    var pathname = path || '/';
    var search = '';
    var hash = '';
    var hashIndex = pathname.indexOf('#');

    if (hashIndex !== -1) {
        hash = pathname.substr(hashIndex);
        pathname = pathname.substr(0, hashIndex);
    }

    var searchIndex = pathname.indexOf('?');

    if (searchIndex !== -1) {
        search = pathname.substr(searchIndex);
        pathname = pathname.substr(0, searchIndex);
    }

    return {
        pathname: pathname,
        search: search === '?' ? '' : search,
        hash: hash === '#' ? '' : hash
    };
}

function createLocation(path, state, key, currentLocation) { // path = '/a'
    var location;

    if (typeof path === 'string') {
        // Two-arg form: push(path, state)
        location = parsePath(path);
        location.state = state;
    } else {
        // One-arg form: push(location)
        /* location = _extends({}, path);
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

        if (state !== undefined && location.state === undefined) location.state = state; */
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

// 判断2个location的路由是否相等
function locationsAreEqual$$1(a, b) {
    return a.pathname === b.pathname && a.search === b.search && a.hash === b.hash;
}

// hashHistory
export function createHashHistory(props) {
    var globalHistory = window.history;

    var basename = props.basename || '';

    function getDOMLocation() {
        var path = getHashPath(); // 获取hash路径 #/test/a ==> /test/a
        if (basename) path = stripBasename(path, basename); // /test/a ==> /a
        return createLocation(path);
        /* 
        return {
            pathname: "/a",
            search: "",
            hash: "",
            state: undefined
        }
        */
    }

    // 订阅消息对象，里面是一个闭包，所有的监听事件放在 listeners=[] 管理
    var transitionManager = createTransitionManager();

    // 1. 更新history对象属性
    // 2.触发订阅事件回调勾子：可以理解为Router的setState location
    function setState(nextState) {
        /* 
        nextState = {
            action: 'POP', // action: POP | PUSH| RPACE
            location: {
                pathname: "/b",
                search: "",
                hash: "",
                state: undefined
            }
        } 
        */
        Object.assign(history, nextState);

        // 重置history.length，永远等于window.history.length
        history.length = globalHistory.length;
        // 触发订阅事件
        transitionManager.notifyListeners(history.location, history.action);
    }

    var forceNextPop = false;
    var ignorePath = null;

    // 监听浏览器hashchange事件
    // 注意：
    // 1. history.push 方法在组件已经render后才会执行handleHashChange事件, window.location.hash是一个同步执行, 执行到这时页面已经render好了，已经完成Router的setState了
    //    history.push 方法是先执行window.location.hash，虽然hashchange，但是先执行setState，最后执行的handleHashChange事件，但是这个hash被标记为ignore，就没有再次被触发Router的setState
    // 2. history.goBack 方法是先触发浏览器hashchange，再触发Router组件的setState
    // 3. 所以通过hashChange事件触发的setState action都是 POP
    function handleHashChange() {
        var location = getDOMLocation();
        /* 
        location = {
            pathname: "/b",
            search: "",
            hash: "",
            state: undefined
        }
        */
        var prevLocation = history.location;
        /* 
        prevLocation = {
            pathname: "/a",
            search: "",
            hash: "",
            state: undefined
        }
        */
        // 比对两次hash全路径是否相等，相等就return了
        if (!forceNextPop && locationsAreEqual$$1(prevLocation, location)) return; // A hashchange doesn't always == location change.

        // ignorePath干啥的？在哪设置的，请看push方法
        if (ignorePath === createPath(location)) return; // Ignore this change; we already setState in push/replace.

        ignorePath = null;
        handlePop(location);
    }


    // 进行真正的跳转页面操作
    function handlePop(location) {
        if (forceNextPop) {
            forceNextPop = false;
            setState();
        } else {
            var action = 'POP'; // 弹栈
            setState({
                action: action,
                location: location
            });
        }
    }


    var initialLocation = getDOMLocation();
    /* 
        initialLocation =  {
            pathname: "/a",
            search: "",
            hash: "",
            state: undefined
        }
    */
    // createPath路径拼接 pathname + ？+ search + # + hash
    // allPaths: string[] 用来缓存push的路径，类似history.pushState
    var allPaths = [createPath(initialLocation)]; // return ['/a']

    function push(path, state) { // path = Link to path        
        // merge location.pathname
        var location = createLocation(path, undefined, undefined, history.location);
        /* location = { 
            pathname: "/b"
            search: ""
            hash: ""
            state: undefined 
        } */

        // 这块磨磨唧唧的对比了下全路径hash值，注意是全的路径哦，带?的，就是说hash？后面的变了也算hashChange
        var path = createPath(location); // 全路径hash带?的
        var encodedPath = encodePath(basename + path); // --> "/test/b"
        var hashChanged = getHashPath() !== encodedPath;

        if (hashChanged) {
            // We cannot tell if a hashchange was caused by a PUSH, so we'd
            // rather setState here and ignore the hashchange. The caveat here
            // is that other hash histories in the page will consider it a POP.
            ignorePath = path; // 这里对呼应了hashchange事件，让hashchange事件忽略处理这个change

            // 在这完成hash跳转
            window.location.hash = encodedPath;
            
            var prevIndex = allPaths.lastIndexOf(createPath(history.location));
            var nextPaths = allPaths.slice(0, prevIndex + 1);
            
            nextPaths.push(path);
            allPaths = nextPaths; // ['/a', '/b']
            
            setState({
                action: 'PUSH', // 弹栈
                location: location
            });
        } 
    }

    function replace(path, state) {
        var location = createLocation(path, undefined, undefined, history.location);
        var path = createPath(location);
        var encodedPath = encodePath(basename + path);
        var hashChanged = getHashPath() !== encodedPath;

        if (hashChanged) {
            // We cannot tell if a hashchange was caused by a REPLACE, so we'd
            // rather setState here and ignore the hashchange. The caveat here
            // is that other hash histories in the page will consider it a POP.
            ignorePath = path;

            function stripHash(url) {
                var hashIndex = url.indexOf('#');
                return hashIndex === -1 ? url : url.slice(0, hashIndex);
            }
            window.location.replace(stripHash(window.location.href) + '#' + encodedPath);
        }

        var prevIndex = allPaths.indexOf(createPath(history.location));
        if (prevIndex !== -1) allPaths[prevIndex] = path;

        setState({
            action: 'REPLACE',
            location: location
        });
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
            window.addEventListener('hashchange', handleHashChange);
        } else if (listenerCount === 0) {
            window.removeEventListener('hashchange', handleHashChange);
        }
    }

    var isBlocked = false;
    // TODO: 没看懂这是做啥事的，没用过
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