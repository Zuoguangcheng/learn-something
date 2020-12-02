import React from "react";
import RouterContext from "./RouterContext";
import matchPath from "./matchPath";

/**
 * The public API for matching a single path and rendering.
 */
class Route extends React.Component {
    render() {
        return (
            <RouterContext.Consumer>
                {context => {
                    const location = this.props.location || context.location;

                    const match = this.props.computedMatch // 有switch 就不用重新计算了，switch已经计算好传递过来了
                        ? this.props.computedMatch // <Switch> already computed the match for us
                        : this.props.path
                            ? matchPath(location.pathname, this.props)
                            : context.match;

                    const props = { ...context, location, match };

                    // children --> component --> render 降级调用
                    let { children, component, render } = this.props;

                    // Preact uses an empty array as children by
                    // default, so use null if that's the case.
                    if (Array.isArray(children) && children.length === 0) {
                        children = null;
                    }

                    return (
                        <RouterContext.Provider value={props}>
                            {
                                props.match
                                    ? children
                                        ? typeof children === "function"
                                            ? children(props)
                                            : children
                                        : component
                                            ? React.createElement(component, props)
                                            : render
                                                ? render(props)
                                                : null
                                    : null
                            }
                        </RouterContext.Provider>
                    );
                }}
            </RouterContext.Consumer>
        );
    }
}

export default Route;
