import React from "react";
import RouterContext from "./RouterContext";


let { forwardRef } = React;
/* 
function forwardRef(render) {
    return {
        $$typeof: Symbol.for('react.concurrent_mode'), // 防止xss攻击作用
        render: render
    };
} 
*/

function isModifiedEvent(event) {
    return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
}

const LinkAnchor = forwardRef(
    (
        {
            navigate,
            onClick,
            ...rest
        },
        forwardedRef
    ) => {
        const { target } = rest;

        let props = {
            ...rest,
            onClick: event => {
                try {
                    if (onClick) onClick(event);
                } catch (ex) {
                    event.preventDefault();
                    throw ex;
                }

                if (
                    !event.defaultPrevented && // onClick prevented default
                    event.button === 0 && // ignore everything but left clicks
                    (!target || target === "_self") && // let browser handle "target=_blank" etc.
                    !isModifiedEvent(event) // ignore clicks with modifier keys
                ) {
                    event.preventDefault();
                    navigate();
                }
            }
        };

        return <a {...props} />;
    }
);


/**
 * The public API for rendering a history-aware <a>.
 */
const Link = forwardRef(
    (
        {
            component = LinkAnchor,
            replace,
            to,
            ...rest
        }
    ) => {
        return (
            <RouterContext.Consumer>
                {context => {
                    const { history } = context;

                    const location = context.location;
                    {/* 
location = {
    pathname: "/b",
    search: "",
    hash: "",
    state: null,
}
                     */}

                    const href = location;
                    const props = {
                        ...rest,
                        href,
                        navigate() {
                            // link跳转to可以使一个function
                            const location = typeof to === "function" ? to(context.location) : to;
                            // link 跳转默认使用push，也可以replace
                            const method = replace ? history.replace : history.push;

                            method(location);
                        }
                    };

                    return React.createElement(component, props);
                }}
            </RouterContext.Consumer>
        );
    }
);


export default Link;
