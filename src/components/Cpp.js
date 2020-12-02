/**
 * @fileoverview 
 * @author liuduan
 * @Date 2020-03-16 09:04:27
 * @LastEditTime 2020-06-21 22:04:58
 */
import React, { memo, useState, useEffect, useRef } from 'react';
import {
    NavLink,
    useHistory,
    useLocation,
    useParams,
    useRouteMatch,
} from 'react-router-dom';


const Cpp = (props) => {
    // test hooks
    // console.log(useHistory(), useLocation(), useParams(), useRouteMatch());
    
    const [show, setShow] = useState(true);
    const [count, setCount] = useState(0);
    const latestCount = useRef(count);
    const ref = useRef(0);

    // 解决死循环方式-1
    // useEffect(() => {
    //     setTimeout(() => {
    //         setCount((count) => {
    //             return count + 1;
    //         });
    //     }, 200);
    // }, []);
    // ref.current = count;

    // 解决死循环方式-2
    // useEffect(() => {
    //     console.log(latestCount.current, count);
    //     latestCount.current = count;
    //     setTimeout(() => {
    //         ref.current = count;
    //         setCount((count) => {
    //             return count + 1;
    //         });
    //     }, 200);
    // }, []);

    // 这样写会死循环，但是又必须引入count，要保证count是最新的值，
    // useEffect(() => {
    //     setTimeout(() => {
    //         setCount(count + 1);
    //     }, 200);
    // }, [count]);

    useEffect(() => {
        setTimeout(() => {
            setCount(2);
            console.log(count);
            setCount(3);
            console.log(count);
        }, 0);

    }, [])

    console.log(count, 'render------');

    const trigger = () => {
        // 用于缓存数据，防止闭包中数据是上次数据
        ref.current = !show;
        setTimeout(() => {
            console.log('通过ref缓存show', ref.current);
            // 每次都重新创建tigger方法，但是setTimeout的回调是在闭包中的，是上一次的setTimeout回调，所有有闭包
            console.log('闭包show', show);
        }, 0);
        // 函数式可以保证state是最新的值，否则有可能是闭包中的缓存值
        setShow((preState) => {
            return !preState;
        });
    }

    const back = () => {
        props.history.goBack();
    }

    return <div>
        <p>{count}</p>
        {show ? <Child></Child> : null}
        <h1 style={{ color: "#333" }}>Cpp</h1>
        <p><span>当前页面历史列表中URL的数量：history.length===</span>{window.history.length} / {props.history.length}</p>
        <p><span>history.action===</span>{window.history.action} / {props.history.action}</p>
        <p><span>history.location===</span>{JSON.stringify(props.history.location)}</p>
        <p><span>match===</span>{JSON.stringify(props.match)}</p>
        <button onClick={trigger}>切换显示</button>
        <button onClick={back}>返回</button>
        <br />
        <NavLink to='/a' activeStyle={{
            fontWeight: 'bold',
            color: 'red'
        }}>NavLink跳转到App</NavLink>
    </div>
}


const Child = memo(() => {
    useEffect(() => {
        // 卸载时执行
        return () => {
            alert('unload');
        };
    }, []);

    return (
        <div>child</div>
    )
});

export default Cpp