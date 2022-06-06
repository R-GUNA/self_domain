import React, {useContext, useEffect} from 'react';
import {Logout} from '../login/Login';
import Auth from "../utils/Auth";
import {navigate, usePath, useRoutes} from 'hookrouter';
import Dashboard from "../dashboard/dashboard";
import {store} from "../../store";
import Loader from "../utils/Loader";
import routes from "../../routes";

function App(props) {
    const [globalState, dispatch] = useContext(store);
    console.log(globalState);

    useEffect(() => {
        const auth = new Auth();
        let is_auth = auth.check_auth();
        let curr_path = window.location.pathname;
        console.log(curr_path);

        if (curr_path === '/login') {
            if (is_auth) {

                navigate('/')
            }

        }
        if (!is_auth) {
            navigate("/login")
        }
        if (Object.entries(globalState.user).length === 0 && is_auth) {
            let profile_resp = auth.get_profile();

            profile_resp.then(res => {
                dispatch({type: 'save user', payload: res.data});
            }).catch(reason => {
                Logout()
            });
            console.log(is_auth)
        }

    }, []);
    let currPath = usePath();
    const routeResult = useRoutes(routes);

    if (currPath !== "/login" && currPath !== "/Error404" && currPath !== "/Error500" && currPath !== "/test") {
        return (
            <div className="App">
                <Loader loading={globalState.is_loading}/>
                <Dashboard routeResult={routeResult}/>
            </div>
        )
    }


    // noinspection CheckTagEmptyBody
    return (
        <div className="App">
            <Loader loading={globalState.is_loading}/>
            {routeResult}
        </div>
    );


}

export default App;

