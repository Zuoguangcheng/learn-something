/**
 * @fileoverview 
 * @author liuduan
 * @Date 2020-05-20 10:50:05
 * @LastEditTime 2020-06-08 16:24:19
 */
import React from 'react';
import ReactDOM from 'react-dom';
import {
    HashRouter,
    BrowserRouter,
    Switch,
    Route,
    Redirect,
} from 'react-router-dom';

import App from './components/App.js';
import Bpp from './components/Bpp.js';
import Cpp from './components/Cpp.js';

import DemoClass from './demo/class.js';
import DemoFunc from './demo/functional.js';
import DemoHoc from './demo/hoc.js';
import DemoRender from './demo/render-props.js';
// window.addEventListener('popstate', handlePop);
// function handlePop(event) {
//     console.warn("location: " + document.location + ", state: " + JSON.stringify(event.state));
// };
// window.addEventListener('scroll', function (e) {
//     console.log('+++++handleScroll', e);
// });

ReactDOM.render(
    <BrowserRouter basename="/basename">
        <Switch>

            <Route path="/a" component={App} />
            <Route path="/b" component={Bpp} exact strict sensitive />
            <Route path="/c/:type(view|edit)/:id(\d+)?" component={Cpp} exact strict sensitive></Route>

            {/* demo */}
            <Route path="/demo/class" component={DemoClass} />
            <Route path="/demo/func" component={DemoFunc} />
            <Route path="/demo/hoc" component={DemoHoc} />
            <Route path="/demo/render" component={DemoRender} />

            <Redirect to={{ pathname: "/a" }} />
        </Switch>
    </BrowserRouter>,
    document.getElementById("root"),
);