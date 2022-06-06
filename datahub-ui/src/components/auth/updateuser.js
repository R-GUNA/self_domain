import React, {useContext, useEffect, useState} from 'react';

import {Notification} from "react-pnotify";
import {navigate} from 'hookrouter';
import axios from 'axios';
import {store} from "../../store";

let Updateuser = props => {
    const [globalState, dispatch] = useContext(store);
    var cloneDeep = require("lodash.clonedeep");
    const emailRef = React.createRef();
    const [updateState, setUpdateState] = useState({
        name: "",
        username: "",
        password: "",
        email: "",
        is_admin: false,
        notifications: [],
        is_Alert1: false,
        is_Alert2: false,
        is_Alert3: false,
        is_Alert4: false

    });

    useEffect(() => {
        dispatch({type: 'change loading', payload: true});
        axios.get(process.env.REACT_APP_API_URL + "/userdetails/" + props.id)
            .then(response => {
                console.log(response.data);
                let newState = cloneDeep({...response.data, notifications: updateState.notifications});
                setUpdateState(newState);
                console.log(newState);
                console.log(updateState);

            }).catch(reason => {
            setUpdateState({
                ...updateState, notifications: [...updateState.err_comp, <Notification
                    type='error'
                    title='error'
                    text={reason}
                    delay={1500}
                    shadow={false}
                    hide={true}
                    nonblock={true}
                    desktop={true}
                />]
            })
        }).finally(() => dispatch({type: "change loading", payload: false}));

    }, []);

    const clickCancel = () => {
        navigate('/view')
    };

    const handleChange = (event) => {
        event.preventDefault();
        event.preventDefault();
//     handleAlert();
        setUpdateState(Object.assign(updateState, {is_Alert4: false}));
        console.log(updateState.is_Alert4);
        console.log(event.target.value);

        let validation = {
            email: ['^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$', emailRef],

        };
        console.log({[event.target.getAttribute('name')]: event.target.value});
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
        if (updateState[event.target.getAttribute('name')] !== event.target.value) {
            setUpdateState(Object.assign(updateState, {[event.target.getAttribute('name')]: event.target.value}))
        }

    };

    const clickOne = (event) => {
        setUpdateState({...updateState, is_admin: event.target.checked})
    };
    console.log("Id " + props.id);

    const handleOnSubmit = event => {
        event.preventDefault();
        console.log(updateState);
        dispatch({type: 'change loading', payload: true});
        if (updateState.name === '') {
            setUpdateState(Object.assign(updateState, {is_alert1: true}))
        }


        if (updateState.username === '') {
            setUpdateState(Object.assign(updateState, {is_Alert2: true}))
        }

        if (updateState.password === '') {
            setUpdateState(Object.assign(updateState, {is_Alert3: true}))
        }
        if (updateState.email === '') {
            setUpdateState(Object.assign(updateState, {is_Alert4: true}))
        }


        let url = process.env.REACT_APP_API_URL + '/updateuser/' + props.id;
        let userConnection = axios.put(url,
            {
                username: updateState.username,
                password: updateState.password,
                name: updateState.name,
                email: updateState.email,
                isadmin: updateState.is_admin,

            }
        );
        userConnection.then(
            res => {
            if ("errors" in res.data) {
                    setUpdateState({
                        ...updateState,
                        notifications: [...updateState.notifications,
                            <Notification
                                type="error"
                                title={res.data.errors}
                                text={res.data.errors}
                                delay={2000}
                                shadow={false}
                                hide={false}
                                nonblock={true}
                                desktop={true}/>]
                    })
                }
                setUpdateState({
                ...updateState,
                notifications: [...updateState.notifications,
                    <Notification
                        type="success"
                        title={"Updated Successfully"}
                        delay={1500}
                        shadow={false}
                        hide={true}
                        nonblock={true}
                        desktop={true}/>]
            });
                dispatch({type: 'change loading', payload: false});

                    navigate("/view");

            }
        ).catch(function (res) {
            dispatch({type: 'change loading', payload: false});
            console.log(res);
            setUpdateState({
                ...updateState,
                notifications: [...updateState.notifications,
                    <Notification
                        type="error"

                        text={"Error Connecting"}
                        delay={2000}
                        shadow={false}
                        hide={false}
                        nonblock={true}
                        desktop={true}/>]
            })
        }).finally(() => dispatch({type: "change loading", payload: false}))
    };
    return (
        <div
            className="right_col"
            role="main"
            style={{
                minHeight: 1826
            }}
        >
       {updateState.notifications.map(value => value)}
            <div>


                <div className="clearfix"/>
                <div className="row">

                    <div className="col-md-12 col-sm-12 ">
                        <div className="x_panel">
                            <div className="x_title">
                                <h2>Update User</h2>
                                <div className="clearfix"/>
                            </div>
                            <div className="x_content">
                                <br/>
                                <form onSubmit={event => handleOnSubmit(event)}
                                      id="{props.id}"
                                      data-parsley-validate
                                      className="form-horizontal form-label-left"
                                      noValidate>
                                    <div className="item form-group">
                                        <label className="col-form-label col-md-3 col-sm-3 label-align">Name
                                            <span className="required" style={{color: 'red'}}>*</span>
                                        </label>
                                        <div className="col-md-6 col-sm-6 ">
                                            <input
                                                id="name"
                                                name="name"
                                                className="form-control"
                                                required
                                               placeholder={updateState.name}

                                                type="text"
                                                onChange={(event) => setUpdateState({
                                                    ...updateState,
                                                    name: event.target.value,
                                                    is_alert1: false
                                                })}
                                            />
                                        </div>
                                        {updateState.is_Alert1 ?
                                            <div className="alert show-alert">Enter your name</div> : null}
                                    </div>
                                    <div className="item form-group">
                                        <label
                                            className="col-form-label col-md-3 col-sm-3 label-align"
                                            htmlFor="username">Username
                                            <span className="required" style={{color: 'red'}}>*</span>
                                        </label>
                                        <div className="col-md-6 col-sm-6 ">
                                            <input
                                                type="text"
                                                id="username"
                                                name="username"
                                                required="required"
                                                className="form-control "
                                                placeholder={updateState.username}
                                                onChange={(event) => setUpdateState({
                                                    ...updateState,
                                                    username: event.target.value,
                                                    is_Alert2: false
                                                })}
                                            />
                                        </div>
                                        {updateState.is_Alert2 ?
                                            <div className="alert show-alert">Enter your username</div> : null}
                                    </div>
                                    <div className="item form-group">
                                        <label
                                            type="password" className="col-form-label col-md-3 col-sm-3 label-align"
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
                                                placeholder="********"
                                                onChange={(event) => setUpdateState({
                                                    ...updateState,
                                                    password: event.target.value,
                                                    is_Alert3: false
                                                })}
                                            />
                                        </div>
                                        {updateState.is_Alert3 ?
                                            <div className="alert show-alert">Enter password</div> : null}
                                    </div>
                                    <div className="item form-group">
                                        <label
                                            htmlFor="email"
                                            className="col-form-label col-md-3 col-sm-3 label-align">Email
                                            <span className="required" style={{color: 'red'}}>*</span>
                                        </label>
                                        <div className="col-md-6 col-sm-6 ">
                                            <input
                                                id="email"
                                                name="email"
                                                className="form-control"
                                                type="text"
                                                name="email"
                                                required="required"
                                                placeholder={updateState.email}
                                                onChange={(event) => handleChange(event)}
                                            />
                                        </div>
                                        {updateState.is_Alert4 ?
                                            <div className="alert show-alert">Enter your email-id</div> : null}
                                        <div className="alert" ref={emailRef}>invalid</div>
                                    </div>
                                    <div className="item form-group">
                                        <label className="col-form-label col-md-3 col-sm-3 label-align">Admin</label>
                                        <div className='icheckbox_flat-green checked'
                                             style={{position: 'relative', paddingLeft: 9,paddingTop:".5%"}}
                                             onClick={(event) => clickOne(event)}>
                                            <input defaultChecked={updateState.isadmin} type='checkbox'
                                                   className='option-input select-users '
                                                   style={{ paddingTop:"20%",width: '25px', height: '25px'}}/>
                                        </div>
                                    </div>
                                    <div className="ln_solid"/>
                                    <div className="item form-group">
                                        <div className="col-md-6 col-sm-6 offset-md-3">
                                            <button className="btn btn-danger" type="button"
                                                    onClick={clickCancel}>Cancel
                                            </button>
                                            <button type="submit" className="btn btn-success">Update</button>
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
};
export default Updateuser;