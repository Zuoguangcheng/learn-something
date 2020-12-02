import React from 'react';
import ReactDOM from 'react-dom';

import { createBrowserHistory } from './browserhistory'
import { createHashHistory } from './hashhistory'

const P = props => {

    const browserhistory = createBrowserHistory(props);


    return (
        <div>12</div>
    )
}

ReactDOM.render(
    <P />,
    document.getElementById("root"),
);