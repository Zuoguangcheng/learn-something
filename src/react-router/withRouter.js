import React from "react";
import RouterContext from "./RouterContext";
import hoistStatics from "hoist-non-react-statics"; // 什么鬼？？有时间再看

/**
 * A public higher-order component to access the imperative API
 */
function withRouter(Component) {
    const displayName = `withRouter(${Component.displayName || Component.name})`;
    const C = props => {
        const { wrappedComponentRef, ...remainingProps } = props;

        return (
            <RouterContext.Consumer>
                {context => {
                    return (
                        <Component
                            {...remainingProps}
                            {...context}
                            ref={wrappedComponentRef}
                        />
                    );
                }}
            </RouterContext.Consumer>
        );
    };

    C.displayName = displayName;
    C.WrappedComponent = Component;


    return hoistStatics(C, Component);
}

export default withRouter;
