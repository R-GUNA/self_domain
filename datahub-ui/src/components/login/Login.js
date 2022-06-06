// import './login.css'
import React, {useContext, useEffect, useState} from "react";
import {store} from "../../store";
import {navigate} from "hookrouter";
import Auth from "../utils/Auth";
import {Notification} from 'react-pnotify';


import logo_datahub from '../../assets/images/logo_datahub.png';


export default function Login(props) {
    const [globalState, dispatch] = useContext(store);


    const [LoginState, setLoginState] = useState({
        user: "",
        password: "",
        err_comp: []
    });

    useEffect(() => {
        document.body.classList.add("login")
    }, []);
    useEffect(() => () => document.body.classList.remove("login"), []);

    const wrapperRef = React.createRef();

    const handleOnClickRegister = event => {
        event.preventDefault();
        const wrapper = wrapperRef.current;
        wrapper.classList.remove("fadeInRight");
        wrapper.classList.add("fadeOutLeft");
        navigate('/signup')
    };

    const handleOnSubmit = event => {
        event.preventDefault();
        console.log(process.env.REACT_APP_API_URL);
        let auth = new Auth();
        let content = auth.do_auth(LoginState.user, LoginState.password);
        let response_data = {};
        content.then(
            res => {
                if ("errors" in res.data) {
                    console.log(LoginState.errors);
                    setLoginState({
                        ...LoginState,
                        err_comp: [...LoginState.err_comp,
                            <Notification
                                type="error"
                                title={res.data.errors}
                                text={res.data.errors}
                                delay={1500}
                                shadow={false}
                                hide={true}
                                nonblock={true}
                                desktop={true}/>]
                    })
                } else {
                    console.log(res.data);
                    localStorage.setItem('user_token', res.data.token);

                    //    Todo Set global store user
                    dispatch({type: 'save user', payload: res.data});
                    navigate('/')

                }
            }
        ).catch(function (res) {
            setLoginState({
                ...LoginState,
                err_comp: [...LoginState.err_comp,
                    <Notification
                        type="error"
                        title="error"
                        text={res}
                        delay={1500}
                        shadow={false}
                        hide={true}
                        nonblock={true}
                        desktop={true}/>]
            });
            console.log(LoginState.error_comp)
        })
    };


    return (
        <div className="login_wrapper">
            {LoginState.err_comp.map(child => child)}
            <div ref={wrapperRef} className="animated fadeInRight form login_form">
                <div className="login_content">
                    <img src={logo_datahub} alt="..." style={{width: 228, height: 55}}/>
                </div>
                <section className="login_content">
                    <form onSubmit={event => handleOnSubmit(event)}>

                        <h1 className="animate">Login Form</h1>
                        <div className="row">
                            <div className="col-md-6"><input type="radio" name="site login" value="ad login">

                            </input><label>AD login</label></div>
                            <div className="col-md-6"><input type="radio" name="site login" value="site login"
                                                             checked={true}>
                            </input><label>Site login</label></div>
                        </div>
                        <div>
                            <input type="text" name="user" className="form-control" placeholder="Username"
                                   onChange={event => setLoginState(Object.assign(LoginState, {user: event.target.value}))}
                                   required/>
                        </div>
                        <div>
                            <input type="password" name="password" className="form-control" placeholder="Password"
                                   onChange={event => setLoginState(Object.assign(LoginState, {password: event.target.value}))}
                                   required/>
                        </div>
                        <div>
                            <button className="btn btn-success">Log in</button>
                            <button className="btn btn-primary">Lost your password?</button>
                        </div>

                        <div className="clearfix"></div>

                        {/*   <div className="separator">
                                    <p className="change_link">New to site?
                                        <button onClick={handleOnClickRegister} className="to_register btn-dark"> Create Account </button>
                                    </p>
                                </div>*/}
                    </form>
                </section>
            </div>
        </div>

    );
}

export let Logout = () => {
    let auth = new Auth();
    auth.do_logout().then(res => {
        console.log(res.data)
    });
    localStorage.removeItem("user_token");

    window.location = "/login";

};