import React from "react";
import Router from "./Router.js";
import { createBrowserHistory as createHistory } from "../history/browserhistory.js";

class BrowserRouter extends React.Component {
    history = createHistory(this.props);

    render() {
        return <Router history={this.history} children={this.props.children} />;
    }
}

export default BrowserRouter;
