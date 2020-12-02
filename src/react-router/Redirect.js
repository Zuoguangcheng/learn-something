import React from "react";
import { createLocation, locationsAreEqual } from "history";

import RouterContext from "./RouterContext";
import generatePath from "./generatePath"; // 这里就不care了



class Lifecycle extends React.Component {
    componentDidMount() {
        if (this.props.onMount) this.props.onMount.call(this, this);
    }

    componentDidUpdate(prevProps) {
        if (this.props.onUpdate) this.props.onUpdate.call(this, this, prevProps);
    }

    componentWillUnmount() {
        if (this.props.onUnmount) this.props.onUnmount.call(this, this);
    }

    render() {
        return null;
    }
}


/**
 * The public API for navigating programmatically with a component.
 */
function Redirect({ computedMatch, to, push = false }) {
    return (
        <RouterContext.Consumer>
            {context => {
                const { history, staticContext } = context;

                const method = push ? history.push : history.replace;
                const location = createLocation(
                    computedMatch
                        ? typeof to === "string"
                            ? generatePath(to, computedMatch.params)
                            : {
                                ...to,
                                pathname: generatePath(to.pathname, computedMatch.params)
                            }
                        : to
                );

                // When rendering in a static context,
                // set the new location immediately.
                if (staticContext) {
                    method(location);
                    return null;
                }

                return (
                    <Lifecycle
                        onMount={() => {
                            method(location);
                        }}
                        onUpdate={(self, prevProps) => {
                            const prevLocation = createLocation(prevProps.to);
                            if (
                                !locationsAreEqual(prevLocation, {
                                    ...location,
                                    key: prevLocation.key
                                })
                            ) {
                                method(location);
                            }
                        }}
                        to={to}
                    />
                );
            }}
        </RouterContext.Consumer>
    );
}

export default Redirect;
