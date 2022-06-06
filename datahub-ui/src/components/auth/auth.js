import React, {useContext, useState} from 'react';
import {Notification} from "react-pnotify";
import {navigate} from 'hookrouter';
import axios from 'axios';
import Loader from "../utils/Loader";
import {store} from "../../store";
//import React, { Component, PropTypes } from 'react';

var cloneDeep = require("lodash.clonedeep");

function Authentication(props) {
    const [globalState, dispatch] = useContext(store);
    const emailRef = React.createRef();

    const [UserState, setUserState] = useState({
        username: "",
        password: "",
        name: "",
        email: "",
        is_admin: false,
        err_comp: [],
        is_Loading: false,
        is_Alert1: false,
        is_Alert2: false,
        is_Alert3: false,
        is_Alert4: false,
        notifications:[]


    });
    const cancel = (event) => {
        navigate("/view")
    };

    const clickOne = (event) => {
        setUserState({...UserState, is_admin: event.target.checked})
    };


    const handleChange = (event) => {

        event.preventDefault();
//     handleAlert();
                dispatch({type: 'change loading', payload: false});
        setUserState({...UserState, email: event.target.value, is_Alert4: false});
        console.log(UserState.is_Alert4);

        console.log(event.target.value);

        let validation = {
            email: ['^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$', emailRef],


        };

        var re1 = new RegExp(validation[event.target.getAttribute('name')][0]);
        let is_valid1 = re1.test(event.target.value);
        console.log(is_valid1);
        let curr_ref1 = validation[event.target.getAttribute('name')][1].current;
        if (!is_valid1) {
            curr_ref1.classList.add("show-alert");
        } else {
            if (curr_ref1.classList.contains("show-alert")) {
                curr_ref1.classList.remove("show-alert");

            }
        }
        if (UserState[event.target.getAttribute('name')] !== event.target.value) {
            setUserState(Object.assign(UserState, {[event.target.getAttribute('name')]: event.target.value}))
        }

    };

    const handleOnSubmit = event => {
        event.preventDefault();
        console.log(UserState);
        dispatch({type: 'change loading', payload: true});

//    setUserState({...UserState ,is_Loading: true})
        if (UserState.name === '') {
            setUserState(Object.assign(UserState, {is_Alert1: true}))
        }


        if (UserState.username === '') {
            setUserState(Object.assign(UserState, {is_Alert2: true}))
        }

        if (UserState.password === '') {
            setUserState(Object.assign(UserState, {is_Alert3: true}))
        }
        if (UserState.email === '') {
            setUserState(Object.assign(UserState, {is_Alert4: true}))
        }


        let url = process.env.REACT_APP_API_URL + '/create/';
        let userconnection = axios.post(url,
            {
                username: UserState.username,
                password: UserState.password,
                name: UserState.name,
                email: UserState.email,
                isadmin: UserState.is_admin,

            }
        );

        userconnection.then(
            res => {
                dispatch({type: 'change loading', payload: true});
                console.log(res);

                if ("errors" in res.data) {
                    setUserState({
                        ...UserState,
                        err_comp: [...UserState.err_comp,
                            <Notification
                                type="error"
                                title={res.data.errors}
                                text={res.data.errors}
                                delay={1500}
                                shadow={false}
                                hide={true}
                                nonblock={true}
                                desktop={true}
                            />]
                    })
                } else {
                    console.log("hello")
                    setUserState({
                        ...UserState,
                        notifications: [...UserState.notifications,
                            <Notification
                                type="success"
                                title={"User Created Successfully"}
                                text={""}
                                delay={1500}
                                shadow={false}
                                hide={false}
                                nonblock={true}
                                desktop={true}
                            />]
                    })
                    dispatch({type: 'change loading', payload: false});
                    navigate("/view");


                }
            }
        ).catch(function (res) {
            dispatch({type: 'change loading', payload: false});
            console.log(res);
            dispatch({type: 'change loading', payload: false});
            setUserState({
                ...UserState,
                err_comp: [...UserState.err_comp,
                    <Notification
                        type="error"
                        title="error"
                        text={res}
                        delay={1500}
                        shadow={false}
                        hide={true}
                        nonblock={true}
                        desktop={true}/>]
            })
        })
    };


    return (
        <div
            className="right_col"
            role="main"
            style={{
                minHeight: 1826
            }}
        >
        {UserState.notifications.map(value => value)}
            <div className>

                <div className="clearfix"/>
                <div className="row" >
                    <Loader loading={false}/>
                    <div className="col-md-12 col-sm-12 ">
                        <div className="x_panel">




                            <div className="x_title title_left">

                                <h3>Create User

                                </h3>


                                <div className="clearfix"/>
                            </div>
                            <div className="x_content">
                                <br/>
                                <form
                                    onSubmit={event => handleOnSubmit(event)}
                                    id="demo-form2"

                                    data-parsley-validate
                                    className="form-horizontal form-label-left"
                                    noValidate>
                                    <div className="item form-group">
                                        <label
                                            className="col-form-label col-md-3 col-sm-3 label-align"
                                            htmlFor="nameid">Name
                                            <span className="required" style={{color: 'red'}}>*</span>
                                        </label>
                                        <div className="col-md-6 col-sm-6 ">
                                            <input
                                                type="text"
                                                id="nameid"
                                                name="name"
                                                required="required"
                                                className="form-control "
                                                onChange={(event) => setUserState({
                                                    ...UserState,
                                                    name: event.target.value,
                                                    is_Alert1: false
                                                })}
                                            />
                                        </div>
                                        {UserState.is_Alert1 ?
                                            <div className="alert show-alert">Enter your name</div> : null}


                                    </div>
                                    <div className="item form-group">
                                        <label
                                            className="col-form-label col-md-3 col-sm-3 label-align"
                                            htmlFor="first-name">Username
                                            <span className="required" style={{color: 'red'}}>*</span>
                                        </label>
                                        <div className="col-md-6 col-sm-6 ">
                                            <input
                                                type="text"
                                                id="first-name"
                                                name="username"
                                                required="required"
                                                className="form-control "
                                                onChange={(event) => setUserState({
                                                    ...UserState,
                                                    username: event.target.value,
                                                    is_Alert2: false
                                                })}
                                            />
                                        </div>
                                        {UserState.is_Alert2 ?
                                            <div className="alert show-alert">Enter your username</div> : null}
                                    </div>
                                    <div className="item form-group">

                                        <label
                                            input type="password"
                                            className="col-form-label col-md-3 col-sm-3 label-align"
                                            htmlFor="password">Password
                                            <span className="required" style={{color: 'red'}}>*</span>

                                        </label>

                                        <div className="col-md-6 col-sm-6 ">

                                            <input
                                                type="password"
                                                id="password"
                                                name="password"
                                                required="required"
                                                pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,32}"
                                                message="Enter password"

                                                className="form-control"
                                                onChange={(event) => setUserState({
                                                    ...UserState,
                                                    password: event.target.value,
                                                    is_Alert3: false
                                                })}
                                            />
                                        </div>
                                        {UserState.is_Alert3 ?
                                            <div className="alert show-alert">Enter password</div> : null}
                                    </div>
                                    <div className="item form-group">
                                        <label
                                            htmlFor="email"
                                            className="col-form-label col-md-3 col-sm-3 label-align">Email
                                            <span className="required" style={{color: 'red'}}>*</span></label>
                                        <div className="col-md-6 col-sm-6 ">
                                            <input
                                                id="email"
                                                name="email"
                                                className="form-control"
                                                type="text"
                                                name="email"
                                                required
                                                placeholder='example@xyz.com'

                                                onChange={(event) => handleChange(event)}
                                            />
                                        </div>
                                        {UserState.is_Alert4 ?
                                            <div className="alert show-alert">Enter your email-id</div> : null}
                                        <div className="alert" ref={emailRef}>invalid</div>
                                    </div>
                                    <div className="item form-group">
                                        <label className="col-form-label col-md-3 col-sm-3 label-align">Admin</label>
                                        <div className='icheckbox_flat-green checked'
                                             style={{position: 'relative', paddingLeft: 9, paddingTop:".5%"}}>
                                            <input type='checkbox'
                                                   className='option-input select-users '
                                                   style={{width: '25px', height: '25px', paddingTop:"20%"}}
                                                   onClick={(event) => clickOne(event)}></input>
                                        </div>


                                    </div>

                                    <div className="ln_solid"/>
                                    <div className="item form-group">
                                        <div className="col-md-6 col-sm-6 offset-md-3">
                                            <button className="btn btn-danger" type="button"
                                                    onClick={(event) => cancel(event)}>Cancel
                                            </button>

                                            <button type="submit" className="btn btn-success">Submit</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Authentication;