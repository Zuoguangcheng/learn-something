/**
 * @fileoverview history hashchange popchange pushState replaceState
 * @author liuduan
 * @Date 2020-05-23 15:02:55
 * @LastEditTime 2020-05-23 16:11:43
 */


import React from 'react';
import ReactDOM from 'react-dom';


window.addEventListener('hashchange', handleHashChange);
window.addEventListener('popstate', handlePopChange);


function handleHashChange(e) {
    console.log('-----handleHashChange', e);
}

function handlePopChange(e) {
    console.log('+++++handlePopChange', e);
}


class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            path: '/',
            // location: props.history.location
        }
    }

    changeHash = (e) => {
        e.preventDefault();
        window.location.hash = '/hashchange';
        this.setState({
            path: '/hashchange',
        });
    }

    render() {
        console.log(this.state.path);
        return (
            <button onClick={this.changeHash}>切换hash</button>
        )
    }
}


ReactDOM.render(<App />, document.getElementById('root'));