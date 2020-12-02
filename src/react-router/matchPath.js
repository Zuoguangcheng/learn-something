// 该文件属于react-router
// import pathToRegexp from "path-to-regexp";

const cache = {};
const cacheLimit = 10000;
let cacheCount = 0;


/**
 * Normalize the given path string, returning a regular expression.
 *
 * An empty array can be passed in for the keys, which will hold the
 * placeholder key descriptions. For example, using `/user/:id`, `keys` will
 * contain `[{ name: 'id', delimiter: '/', optional: false, repeat: false }]`.
 *
 * @param  {(string|RegExp|Array)} path
 * @param  {Array}  keys
 * @param  {Object} options
 * @return {!RegExp}
 */
function pathToRegexp(path, keys, options) {
    if (path instanceof RegExp) {
        return regexpToRegexp(path, keys)
    }

    if (isarray(path)) {
        return arrayToRegexp(path, keys, options)
    }

    return stringToRegexp(path, keys, options)
}


/**
 * Create a path regexp from string input.
 *
 * @param  {string}  path
 * @param  {!Array}  keys
 * @param  {!Object} options
 * @return {!RegExp}
 */
function stringToRegexp(path, keys, options) {
    return tokensToRegExp(parse(path, options), keys, options)
}




/**
 * Expose a function for taking tokens and returning a RegExp.
 *
 * @param  {!Array}          tokens
 * @param  {(Array|Object)=} keys
 * @param  {Object=}         options
 * @return {!RegExp}
 */
function tokensToRegExp(tokens, keys, options) {
    if (!isarray(keys)) {
        options = /** @type {!Object} */ (keys || options)
        keys = []
    }

    options = options || {}

    var strict = options.strict
    var end = options.end !== false
    var route = ''

    // Iterate over the tokens and create our regexp string.
    for (var i = 0; i < tokens.length; i++) {
        var token = tokens[i]

        if (typeof token === 'string') {
            route += escapeString(token)
        } else {
            var prefix = escapeString(token.prefix)
            var capture = '(?:' + token.pattern + ')'

            keys.push(token)

            if (token.repeat) {
                capture += '(?:' + prefix + capture + ')*'
            }

            if (token.optional) {
                if (!token.partial) {
                    capture = '(?:' + prefix + '(' + capture + '))?'
                } else {
                    capture = prefix + '(' + capture + ')?'
                }
            } else {
                capture = prefix + '(' + capture + ')'
            }

            route += capture
        }
    }

    var delimiter = escapeString(options.delimiter || '/')
    var endsWithDelimiter = route.slice(-delimiter.length) === delimiter

    // In non-strict mode we allow a slash at the end of match. If the path to
    // match already ends with a slash, we remove it for consistency. The slash
    // is valid at the end of a path match, not in the middle. This is important
    // in non-ending mode, where "/test/" shouldn't match "/test//route".
    if (!strict) {
        route = (endsWithDelimiter ? route.slice(0, -delimiter.length) : route) + '(?:' + delimiter + '(?=$))?'
    }

    if (end) {
        route += '$'
    } else {
        // In non-ending mode, we need the capturing groups to match as much as
        // possible by using a positive lookahead to the end or next path segment.
        route += strict && endsWithDelimiter ? '' : '(?=' + delimiter + '|$)'
    }

    return attachKeys(new RegExp('^' + route, flags(options)), keys)
}



var PATH_REGEXP = new RegExp([
    // Match escaped characters that would otherwise appear in future matches.
    // This allows the user to escape special characters that won't transform.
    '(\\\\.)',
    // Match Express-style parameters and un-named parameters with a prefix
    // and optional suffixes. Matches appear as:
    //
    // "/:test(\\d+)?" => ["/", "test", "\d+", undefined, "?", undefined]
    // "/route(\\d+)"  => [undefined, undefined, undefined, "\d+", undefined, undefined]
    // "/*"            => ["/", undefined, undefined, undefined, undefined, "*"]
    '([\\/.])?(?:(?:\\:(\\w+)(?:\\(((?:\\\\.|[^\\\\()])+)\\))?|\\(((?:\\\\.|[^\\\\()])+)\\))([+*?])?|(\\*))'
].join('|'), 'g')


/**
 * Parse a string for the raw tokens.
 *
 * @param  {string}  str
 * @param  {Object=} options
 * @return {!Array}
 */
function parse(str, options) { // str = "/c", options = {end: false, strict: false, sensitive: false}
    var tokens = []
    var key = 0
    var index = 0
    var path = ''
    var defaultDelimiter = options && options.delimiter || '/'
    var res

    while ((res = PATH_REGEXP.exec(str)) != null) {
        var m = res[0]
        var escaped = res[1]
        var offset = res.index
        path += str.slice(index, offset)
        index = offset + m.length

        // Ignore already escaped sequences.
        if (escaped) {
            path += escaped[1]
            continue
        }

        var next = str[index]
        var prefix = res[2]
        var name = res[3]
        var capture = res[4]
        var group = res[5]
        var modifier = res[6]
        var asterisk = res[7]

        // Push the current path onto the tokens.
        if (path) {
            tokens.push(path)
            path = ''
        }

        var partial = prefix != null && next != null && next !== prefix
        var repeat = modifier === '+' || modifier === '*'
        var optional = modifier === '?' || modifier === '*'
        var delimiter = res[2] || defaultDelimiter
        var pattern = capture || group

        tokens.push({
            name: name || key++,
            prefix: prefix || '',
            delimiter: delimiter,
            optional: optional,
            repeat: repeat,
            partial: partial,
            asterisk: !!asterisk,
            pattern: pattern ? escapeGroup(pattern) : (asterisk ? '.*' : '[^' + escapeString(delimiter) + ']+?')
        })
    }

    // Match any characters still remaining.
    if (index < str.length) {
        path += str.substr(index)
    }

    // If the path exists, push it onto the end.
    if (path) {
        tokens.push(path)
    }

    return tokens
}





function compilePath(path, options) {
    const cacheKey = `${options.end}${options.strict}${options.sensitive}`; // 'falsefalsefalse'
    const pathCache = cache[cacheKey] || (cache[cacheKey] = {}); // {}

    if (pathCache[path]) return pathCache[path]; // undefined

    const keys = [];
    const regexp = pathToRegexp(path, keys, options);
    const result = { regexp, keys };

    // 缓存 && 缓存限制1万个path
    if (cacheCount < cacheLimit) {
        pathCache[path] = result;
        cacheCount++;
        /* 
        {
            'falsefalsefalse': {
                '/c': {
                    regexp: ,
                    keys: ,
                }
            }
        }
        
        */
    }

    return result;
}

/**
 * Public API for matching a URL pathname to a path.
 */
function matchPath(pathname, options = {}) {
    /* 
        pathname: '/'
        options: { path: "/c", component: App }
    */
    if (typeof options === "string" || Array.isArray(options)) {
        options = { path: options };
    }

    // 这些都是Route组件上的可配置属性，并给于默认值 false了都
    const {
        path,  // '/c'
        exact = false,
        strict = false,
        sensitive = false
    } = options;

    const paths = [].concat(path); // ['/c']

    return paths.reduce((matched, path) => {
        if (!path && path !== "") return null;
        if (matched) return matched;

        const { regexp, keys } = compilePath(path, {
            end: exact, // false
            strict,  // false
            sensitive // false
        });
        const match = regexp.exec(pathname);

        if (!match) return null;

        const [url, ...values] = match;
        const isExact = pathname === url;

        if (exact && !isExact) return null;

        return {
            path, // the path used to match
            url: path === "/" && url === "" ? "/" : url, // the matched portion of the URL
            isExact, // whether or not we matched exactly
            params: keys.reduce((memo, key, index) => {
                memo[key.name] = values[index];
                return memo;
            }, {})
        };
    }, null);
}

export default matchPath;
