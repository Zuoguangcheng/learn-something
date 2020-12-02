import React from 'react';
import {
    Link,
    useHistory,
    useLocation,
    useParams,
    useRouteMatch,
} from 'react-router-dom';


const Bpp = (props) => {
    // test hooks
    console.log(useHistory(), useLocation(), useParams(), useRouteMatch());

    const back = () => {
        props.history.goBack();
    }

    return <div>
        <h1 style={{ color: "green" }}>Bpp</h1>
        <p><span>当前页面历史列表中URL的数量：history.length===</span>{window.history.length} / {props.history.length}</p>
        <p><span>history.action===</span>{window.history.action} / {props.history.action}</p>
        <p><span>history.location===</span>{JSON.stringify(props.history.location)}</p>
        <p><span>match===</span>{JSON.stringify(props.match)}</p>
        <button onClick={back}>返回</button>
        <br />
        <Link to="/c/view/001">to C page</Link>
    </div>
}

export default Bpp