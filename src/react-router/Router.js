import React from "react";
import RouterContext from "./RouterContext";

/**
 * The public API for putting history on context.
 */
class Router extends React.Component {
    static computeRootMatch(pathname) {
        return { path: "/", url: "/", params: {}, isExact: pathname === "/" };
    }

    constructor(props) {
        super(props);

        this.state = {
            location: props.history.location
            /*  
                props.history.location = initialLocation;
                location = initialLocation =  {
                    pathname: "/a",
                    search: "",
                    hash: "",
                    state: undefined
                }
            */
        };

        // This is a bit of a hack. We have to start listening for location
        // changes here in the constructor in case there are any <Redirect>s
        // on the initial render. If there are, they will replace/push when
        // they mount and since cDM fires in children before parents, we may
        // get a new location before the <Router> is mounted.
        this._isMounted = false;
        this._pendingLocation = null;

        if (!props.staticContext) {
            // listen 回调参数：路由更新后的 history.location, history.action
            this.unlisten = props.history.listen(location => {
                if (this._isMounted) {
                    this.setState({ location });
                } else {
                    this._pendingLocation = location;
                }
            });

            /* 
            
            * hash-history.listen  
            function listen(listener) {
                // 订阅listner消息，返回取消订阅勾子
                var unlisten = transitionManager.appendListener(listener);
                
                checkDOMListeners(1); // 开启hash监听事件 window.addEventListener(HashChangeEvent$1, handleHashChange);
                
                return function() {
                    checkDOMListeners(-1); // 解除hash监听事件
                    unlisten(); // 取消订阅事件
                };
            }


    // appendListener
    () => {
        var listeners = [];
        return function appendListener(fn) {
            var isActive = true;

            function listener() {
                if (isActive) fn.apply(void 0, arguments);
            }

            listeners.push(listener);
            return function() {
                isActive = false;
                listeners = listeners.filter(function(item) {
                    return item !== listener;
                });
            };
        }
    }

    function checkDOMListeners(delta) {
        listenerCount += delta;

        if (listenerCount === 1 && delta === 1) {
            window.addEventListener('hashchange', handleHashChange);
        } else if (listenerCount === 0) {
            window.removeEventListener('hashchange', handleHashChange);
        }
    }

    
            
            */
        }
    }

    componentDidMount() {
        this._isMounted = true;

        if (this._pendingLocation) {
            this.setState({ location: this._pendingLocation });
        }
    }

    componentWillUnmount() {
        if (this.unlisten) this.unlisten();
    }

    render() {
        return (
            <RouterContext.Provider
                children={this.props.children || null}
                value={{
                    history: this.props.history,
                    location: this.state.location,
                    match: Router.computeRootMatch(this.state.location.pathname),
                    staticContext: this.props.staticContext
                }}
            />
        );
    }
}


export default Router;
