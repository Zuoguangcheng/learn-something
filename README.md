# learn-react-router5
学习react-router5源码

## 启动项目
```sh
npm i
npm start
```

# history

## action
* POP: goBack，go, goForward事件触发跳转
* PUSH: history.push 触发的跳转，如Link默认跳转
* REPLACE: history.replace 触发的跳转

## length
* history.length返回一个整数，表示历史状态（history state）列表长度
* history.length是一个只读属性
* 由网页加载生成的历史状态，即向服务器请求新的页面
* 通过history.pushState()方法生成历史状态，这种方式不会向服务器发起请求
* 刷新、goBack操作不会生成历史状态
* 有了历史状态，浏览器的前进后退按钮就处于可用状态，可以在历史状态之间来回切换
* history.length === window.history.length

## hashhistory
 * history.push    --> window.location.hash = newHashPath   --> update allPaths --> history.setState --> react.setState --> render --> handleHashChange
 * history.replace --> window.location.replace(newHrefPath) --> update allPaths --> history.setState --> react.setState --> render --> handleHashChange
 * history.goBack  --> window.history.go(-1)                ----------------------> handleHashChange --> history.setState --> react.setState --> render
 * Link 默认走 history.push，可以设置replace属性，则用replace跳转



## browserhistory
* push: history.pushState({key, state}, title, href)完成路径更新，通过Router组件setState更新，这里不会触发popState事件，只有浏览器的back，go事件才会触发
* replace: 同push，只是调用的history.repaceState()方法
* goBack: 通过监听 window.addEventListener('popstate', handlePopState) 触发Router组件setState更新
```js
var globalHistory = window.history;
globalHistory.replaceState({
                key: key,
                state: state
            }, null, href);
```

### webpack-dev server config
```js
    devServer: { // 默认热更新
        port: 3000,
        historyApiFallback: true,
        before(app) {
            app.get("/api/test", (req, res) => {
                res.json({
                    code: 0,
                    msg: "hello world"
                });
            });
        },
    }
```

### node server
```js
module.exports = () => {
    return async function (ctx, next) {
        const accept = ctx.header.accept || '';
        if (accept.indexOf('text/html') > -1 || !accept) { // 判断是页面请求
            try {
                const body = await fs.readFile(Path.join(rootPath, 'public/' + pageName + '.html'));
                ctx.body = body.toString();
            } catch (error) {
                ctx.status = 302;
                ctx.redirect('/');
            }
        } else {
            await next();
        }
    };
};
```




## Route 属性 
* path: /:paramName(pattern正则)[?*+]
* exact: 在正则结尾加$符号，只匹配到当前path结束
* strict: 校验结尾是否需要匹配 '/'，严格匹配，有则有，无则无
* sensitive: 大小写严格匹配
* 优先级: children > component > render 
* location的search、hash配置不受exact strict sensitive配置影响，样例见下面Link说明

```js
// props.match
        return {
            path, // Route props path
            url: path === "/" && url === "" ? "/" : url, // location hash path 和 正则exec匹配后得出的数组[0]
            isExact, // pathname === url, pathname就是location hash path
            params: keys.reduce((memo, key, index) => {
                memo[key.name] = values[index];
                return memo;
            }, {})
        };
```

1. exact
```
path="/c/:type(view|edit)/:id(\d+)?"
var regexp0 = /^\/c\/((?:view|edit))(?:\/((?:\d+)))?(?:\/(?=$))?(?=\/|$)/i
var regexp1 = /^\/c\/((?:view|edit))(?:\/((?:\d+)))?(?:\/(?=$))?$/i
```


2. exact strict
```
path="/c/:type(view|edit)/:id(\d+)?/"
var regexp0 = /^\/c\/((?:view|edit))(?:\/((?:\d+)))?(?:\/(?=$))?(?=\/|$)/i
var regexp1 = /^\/c\/((?:view|edit))(?:\/((?:\d+)))?(?:\/(?=$))?$/i
var regexp3 = /^\/c\/((?:view|edit))(?:\/((?:\d+)))?\/$/i


path="/c/:type(view|edit)/:id(\d+)?"
regexp = /^\/c\/((?:view|edit))(?:\/((?:\d+)))?$/i
```



3. exact strict sensitive 
```
regexp = /^\/c\/((?:view|edit))(?:\/((?:\d+)))?$/
```


## Link 
* to 属性可以是string or object
```jsx
// 此种方式可以通过 history.location.state 传递参数
            <Link to={{
                pathname: '/b',
                search: '?c=1&x=d',
                hash: '#a',
                state: {
                    test: 1
                }
            }}>Link跳转到bpp</Link>
```
* browserhistory 传递的state是保存在window.history.state.state上，所以页面刷新时不会清空state
* hashhistory 传递的state是存在自定义history对象的属性中，也就是内存中，所以页面刷新时，就会清空state



## React Hooks
> hooks lazy memo fiber

### 组件类型
* class (生命周期)
* functional (函数组件 hooks，没有hooks时代不能处理副作用，大多用于UI组件)
* hoc (高阶组件，是对组价功能的扩展，状态扩展，管理副作用代码)
* render-props (状态复用，UI不复用，管理副作用代码)


### 为什么使用Hooks
* 状态逻辑复用差，需要把代码写在不同的生命周期里，没有hooks之前是通过render-props | hoc 解决的，
* 复杂组件难以理解
* class类组件，this不好维护，class编译之后的代码太多


### Hooks Api
* useState
* useEffect
    - 控制副作用
* useContext
    - 不用使用组件，直接使用函数
* useRef
    - 返回一个ref的可变对象
* useReducer 
    - 管理本地复杂state
* useMemo
    - Memozied pure
* useCallback
    - Memozied callback

    
    
### 什么事副作用？
> 对于一个函数不可确定输出的，不是纯函数的
* dom操作
* 浏览器事件绑定
* http请求
* io操作



### 为什么hooks不能在if/for中使用
* 因为状态和数据都存到链表里面的，如果循环数目变更，下次再来取数据，就会混乱
* useState，useEffect 调用按顺序从`memoizedState[]`中取，所以cursor就是`memoizedState[]`的index，if/for会打乱hooks执行顺序，造成index取值错误

```js
// hooks state 是存在链表里面的，类似于数组
var a = {
    value: 1,
    next: {
        value: 2,
        next: {

        }
    }
}
```


## hooks源码
```js
export type Hook = {
  memoizedState: any,//记录当前useState应该返回的结果

  baseState: any,//基础数据
  baseQueue: Update<any, any> | null,
  queue: UpdateQueue<any, any> | null,//缓存队列，缓存多次的行为


  next: Hook | null,//指向下一个hook对象：useState、useEffect等
};

```



---


# Webpack-config

## 1.babel-polyfill
### 优雅的babel-polyfill
> https://blog.hhking.cn/2019/04/02/babel-v7-update/
```sh
npm i -D core-js@3 @babel/plugin-transform-runtime
```
```js
{
  "presets": [
    [
      "@babel/preset-env",
      {
        "useBuiltIns": "usage",// usage 会根据配置的浏览器兼容，以及你代码中用到的 API 来进行 polyfill，实现了按需添加。
        "corejs": 3,
        "targets": {
          "ie": 10
        }
      }
    ]
  ],
  "plugins": [
    // 这个插件是用来复用辅助函数的
    "@babel/plugin-transform-runtime",
  ]
}
```

### 比上面更优雅的babel-polyfill，避免全局变量污染，通过闭包形式传入, 更适合npm组件
> https://blog.hhking.cn/2019/04/02/babel-v7-update/
```sh
npm i -D @babel/plugin-transform-runtime @babel/runtime-corejs3
```
```js
{
  "presets": [
    [
      "@babel/preset-env",
      {
        "targets": {
          "ie": 18
        }
      }
    ]
  ],
  "plugins": [
    // 1. 这个插件是用来复用辅助函数的
    // 2. 以闭包形式注入, 避免全局污染
    // 3. 缺点：不能指定目标浏览器版本，如果有指定浏览器版本，还是建议使用上面的方式
    [
        "@babel/plugin-transform-runtime",
        {
            "corejs": 3,
        },
    ]
  ]
}
```



## 2.开启热更新
1. wepackdevserver启动服务
2. wepackdevserver配置hot:true
3. plugins配置new webpack.HotModuleReplacementPlugin()
4. js代码中添加如下代码:
```js
if (module.hot) {
  module.hot.accept('./library.js', function() {
    // 使用更新过的 library 模块执行某些操作...
  });
  // 断开热更新
  module.hot.decline('./library.js');
}
```