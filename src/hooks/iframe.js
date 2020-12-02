/**
 * @fileoverview 
 * @author liuduan
 * @Date 2020-06-19 15:19:04
 * @LastEditTime 2020-06-19 15:42:59
 */
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';

window.onmessage = function(e) {
    if (e.source !== window) {
        console.log(e.data);
    }
}

let read = false;
const App = () => {
    useEffect(() => {
        postData();
    }, [])

    const postData = () => {
        const iframe = document.getElementById('iframe');
        if (read) {
            iframe.contentWindow.postMessage('test', 'http://127.0.0.1:8081');
            return;
        }
        
        // 这里需要等待iframe onload, 否则无法发送消息
        iframe.onload = function() {
            read = true;
            iframe.contentWindow.postMessage('test', 'http://127.0.0.1:8081');
        } 
    }

    return (
        <div>
            <iframe src="http://127.0.0.1:8081/iframe.html" id="iframe" frameBorder="0"></iframe>
            <button onClick={postData}>发消息</button>
        </div>
    )
}

ReactDOM.render(
    <App />,
    document.getElementById("root"),
);