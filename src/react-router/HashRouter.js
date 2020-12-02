import React from "react";
import Router from "./Router.js";
import { createHashHistory as createHistory } from "../history/hashhistory.js";


class HashRouter extends React.Component {
    history = createHistory(this.props);

    render() {
        return <Router history={this.history} children={this.props.children} />;
    }
}

export default HashRouter;