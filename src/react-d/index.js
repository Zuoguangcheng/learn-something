/**
 * @fileoverview 
 * @author liuduan
 * @Date 2020-05-20 10:50:05
 * @LastEditTime 2020-06-20 23:11:41
 */
import React from './enter';
import ReactDOM from 'react-dom';
import {
    HashRouter,
    BrowserRouter,
    Switch,
    Route,
    Redirect,
} from 'react-router-dom/';


import App from '../components/App.js';
import Bpp from '../components/Bpp.js';
import Cpp from '../components/Cpp.js';

ReactDOM.render(
    <BrowserRouter basename="/basename">
        <Switch>

            <Route path="/a" component={App} />
            <Route path="/b" component={Bpp} exact strict sensitive />
            <Route path="/c/:type(view|edit)/:id(\d+)?" component={Cpp} exact strict sensitive></Route>

            <Redirect to={{ pathname: "/a" }} />
        </Switch>
    </BrowserRouter>,
    document.getElementById("root"),
);