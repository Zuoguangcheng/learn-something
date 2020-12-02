import React from "react";
import RouterContext from "./RouterContext";
import matchPath from "./matchPath";



/*
React.isValidElement:
const REACT_ELEMENT_TYPE = Symbol.for('react.element')
function isValidElement(object) {
    return typeof object === 'object' && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
}
*/



/**
 * The public API for rendering the first <Route> that matches.
 */
class Switch extends React.Component {
    render() {
        return (
            <RouterContext.Consumer>
                {context => {
                    const location = this.props.location || context.location;

                    let element, match; // match作为标识只能匹配到一个，匹配到就不再匹配了

                    // We use React.Children.forEach instead of React.Children.toArray().find()
                    // here because toArray adds keys to all child elements and we do not want
                    // to trigger an unmount/remount for two <Route>s that render the same
                    // component at different URLs.
                    React.Children.forEach(this.props.children, child => {
                        if (match == null && React.isValidElement(child)) {
                            element = child;

                            const path = child.props.path || child.props.from;

                            match = path
                                ? matchPath(location.pathname, { ...child.props, path })
                                : context.match;
                        }
                    });

                    return match
                        ? React.cloneElement(element, { location, computedMatch: match })
                        : null;
                }}
            </RouterContext.Consumer>
        );
    }
}


export default Switch;
