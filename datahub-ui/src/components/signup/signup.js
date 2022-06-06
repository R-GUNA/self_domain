import React, {useEffect, useState} from "react";
import "../login/login.css"
import {navigate} from 'hookrouter'
import Auth from "../utils/Auth";
import {Notification} from "react-pnotify";

export default function Signup(props) {
    const [SignupState, setSignupState] = useState({
        username: "",
        password: "",
        email: "",
        name: "",
        err_comp: []
    });

    const registerRef = React.createRef();

    const handleOnClickLogIn = event => {
        event.preventDefault();
        const wrapper = registerRef.current;
        wrapper.classList.remove("fadeInRight");
        wrapper.classList.add("fadeOutLeft");
        navigate('/login')

    };
    useEffect(() => {
        document.body.classList.add("login")
    }, []);
    useEffect(() => () => document.body.classList.remove("login"), []);
    const handleOnSubmitSignup = event => {
        event.preventDefault();
        let signup = new Auth().do_signup(SignupState);
        signup.then(
            res => {
                if ("errors" in res.data) {
                    setSignupState({
                        ...SignupState,
                        err_comp: [...SignupState.err_comp,
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
                    navigate('/login');
                }
            }
        ).catch(function (res) {
            setSignupState({
                ...SignupState,
                err_comp: [...SignupState.err_comp,
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
        })
    };
    return (
        <div className="login_wrapper">
            <div id="register" ref={registerRef} className="animated fadeInRight form registration_form">
                <section className="login_content">
                    <form onSubmit={handleOnSubmitSignup}>
                        <h1>Create Account</h1>
                        <div>
                            <input type="text" name="name" className="form-control" placeholder="Name"
                                   onChange={event => {
                                       setSignupState(Object.assign(SignupState, {name: event.target.value}))
                                   }} required/>
                        </div>
                        <div>
                            <input type="text" name="user" className="form-control" placeholder="Username"
                                   onChange={event => setSignupState(Object.assign(SignupState, {username: event.target.value}))}
                                   required/>
                        </div>
                        <div>
                            <input type="email" name="email" className="form-control" placeholder="Email"
                                   onChange={event => {
                                       setSignupState(Object.assign(SignupState, {email: event.target.value}))
                                   }} required/>
                        </div>
                        <div>
                            <input type="password" name="password" className="form-control" placeholder="Password"
                                   onChange={event => {
                                       setSignupState(Object.assign(SignupState, {password: event.target.value}))
                                   }} required/>
                        </div>

                        <div>
                            <button className="btn btn-primary submit">Submit</button>
                            <button className="btn btn-primary">Cancel</button>
                        </div>

                        <div className="clearfix"></div>

                        {/*<div className="separator">
                                <p className="change_link">Already a member ?
                                    <button onClick={handleOnClickLogIn} className="badge-secondary to_register"> Log in </button>
                                </p>

                            </div>*/}
                    </form>
                </section>
            </div>
        </div>
    )
}