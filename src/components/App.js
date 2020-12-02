/**
 * @fileoverview 
 * @author liuduan
 * @Date 2020-03-31 23:24:19
 * @LastEditTime 2020-06-21 09:56:16
 */
import React from 'react';
import ReactDOM from 'react-dom';
import { Link, NavLink } from 'react-router-dom';
// console.log(React.createElement("p", null, "a", "b"));

// 模拟服务端返回数据对象
let expectedTextButGotJSON = {
    type: 'div',
    props: {
        style: {
            color: 'greenyellow',
        },
        dangerouslySetInnerHTML: {
            __html: `<p>componentDidMount</p>`,
        },
    },
    $$typeof: Symbol.for('react.element'),
    key: null,
    ref: null,
};

// console.log(JSON.stringify(expectedTextButGotJSON)) 
// {"type":"div","props":{"dangerouslySetInnerHTML":{"__html":"<p>componentDidMount</p>"}},"ref":{"current":null}}
let message = { text: expectedTextButGotJSON };



export default class App extends React.Component {
    state = {
        count: 0,
    };
    shouldComponentUpdate(nextProps, nextState) {
        return nextState.count !== this.state.count
    }
    componentDidMount() {
        this.setState({
            count: 1,
            xss: `<p>componentDidMount</p>`,
        });

        setTimeout(() => {
            // 手动调用批处理
            ReactDOM.unstable_batchedUpdates(() => {
                console.group('setTimeout-unstable_batchedUpdates');
                console.log('setTimeout-unstable_batchedUpdates', this.state.count);
                this.setState((state) => ({
                    count: state.count + 100,
                }));
                console.log('setTimeout-unstable_batchedUpdates', this.state.count);
                this.setState((state) => ({
                    count: state.count + 1,
                }));
                console.log('setTimeout-unstable_batchedUpdates', this.state.count);
                console.groupEnd('setTimeout-unstable_batchedUpdates');
            });
        }, 0);
    }
    componentDidUpdate() {
        console.log('componentDidUpdate', this.state.count);
        setTimeout(() => {
            this.setState({
                count: 2,
            });
            console.log('setTimeout', this.state.count);
        }, 200);
    }
    active = (match, location) => {
        console.log(match, location)
    }
    renderList = () => {
        const list = new Array(1000);
        list.fill(1);
        return <>{list.map((item, index) => { return <li key={index}><Link to='/b'>{index}</Link></li> })}</>
    }
    render() {
        console.log('render', this.state.count);
        return <div>
            <h1 style={{ color: "red" }}>App</h1>
            <p><span>当前页面历史列表中URL的数量：history.length===</span>{window.history.length} / {this.props.history.length}</p>
            <p><span>history.action===</span>{window.history.action} / {this.props.history.action}</p>
            <p><span>history.location===</span>{JSON.stringify(this.props.location)}</p>
            <p><span>match===</span>{JSON.stringify(this.props.match)}</p>

            <Link to={{
                pathname: '/b',
                search: '?c=1&x=d',
                hash: '#a',
                state: {
                    test: 1
                }
            }}>Link跳转到bpp</Link>
            <br />
            <NavLink to='/a' activeStyle={{
                fontWeight: 'bold',
                color: 'red'
            }}>NavLink跳转到App</NavLink>

            {message.text}

            {
                {
                    type: 'div',
                    props: {
                        style: {
                            color: 'green',
                        },
                        // children: [
                        // 'xxx'
                        // ],
                        dangerouslySetInnerHTML: {
                            __html: `<iframe>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>react-router分析</title>
</head>

<body>
    <div id="root">
        <%= htmlWebpackPlugin.options.loading.html %>
    </div>
    <script>
        alert(1);
    </script>
</body>

</html>
                            </iframe>`,
                        },
                    },
                    $$typeof: Symbol.for('react.element'),
                    ref: React.createRef(),
                }
            }

            <p>------------------</p>

            <div dangerouslySetInnerHTML={{ __html: this.state.xss }} />
            {
                this.state.xss
            }
            <br/>
            {
                React.Children.map('test React.Children.map element is a string is running', a => a)
            }

            {
                this.renderList()
            }


        </div>
    }
}