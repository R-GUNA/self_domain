import React, {useContext, useEffect, useState} from 'react';
import {Notification} from "react-pnotify";
import {navigate} from 'hookrouter';
import axios from 'axios';
import {store} from "../../store";
import Loader from "../utils/Loader";
import {validations} from "../utils/Constants";

function CreateConnection(props) {
    let cloneDeep = require("lodash.clonedeep");
    const [globalState, dispatch] = useContext(store);

    const [ConnectionState, setConnectionState] = useState({
        connectionname: "",
        username: "",
        password: "",
        hostname: "",
        portname: "",
        maps: [],
        err_comp: [],
        attrs: [],
        key: "",
        is_verified: false,
        notifications: []
    });


    useEffect(() => {
        let data = axios.get(process.env.REACT_APP_API_URL + "/fetchmaps/");

        data.then(result => {
            setConnectionState({...ConnectionState, maps: result.data})
        })
    }, []);

    const cancel = () => {
        navigate("/viewconnections")
    };





    const onSelectMap = (event) => {
        for (let i of ConnectionState.maps) {
            if (event.target.value === i.key) {
                let inputs_arr = Object.keys(i.attrs);
                let newState = cloneDeep(ConnectionState);
                newState.attrs = inputs_arr;
                newState.key = i.key;
                for (let key of newState.attrs) {
                    console.log(key)
                    newState[key] =""
                    console.log(newState[key])
                }
                setConnectionState(newState)

            } else if (event.target.value === "") {
                let inputs_arr = Object.keys(i.attrs);
                setConnectionState({...ConnectionState, attrs: [], key: ""})
            }
        }
    };

    const handleChange = (event) => {
    console.log({...ConnectionState,[event.target.getAttribute('name')]: event.target.value});
        try {

            var re = new RegExp(validations[event.target.getAttribute('name')]);
            console.log(re);
            let is_valid = re.test(event.target.value);
            console.log(is_valid);
            let alert_element = event.target.parentNode.nextSibling;
            console.log(alert_element);
            if (!is_valid ) {
                if (!alert_element.classList.contains("show-alert")) {
                    alert_element.classList.add("show-alert");
                }
            } else {
                if (alert_element.classList.contains("show-alert")) {
                    alert_element.classList.remove("show-alert");

                }
            }
        } catch (e) {
            console.log(e)
        }

        if (ConnectionState[event.target.getAttribute('name')] !== event.target.value) {
            setConnectionState({...ConnectionState, [event.target.getAttribute('name')]: event.target.value})
        }


    };
    const handleOnSubmitConnection = (event, is_verification) => {
//        event.preventDefault();
        dispatch({type: 'change loading', payload: true});
        if (ConnectionState.connectionname === '' || ConnectionState.username === "" || ConnectionState.password === ''
            || ConnectionState.key === "" || ConnectionState.attrs.length === 0 || window.$(".show-alert").length > 0) {

            setConnectionState({
                ...ConnectionState,
                notifications: [...ConnectionState.notifications,
                    <Notification
                        type="error"
                        title={"Fields are empty or invalid fields"}
                        delay={1500}
                        shadow={false}
                        hide={false}
                        nonblock={true}
                        desktop={true}/>]
            });
            console.log(ConnectionState.notifications);
            dispatch({type: "change loading", payload: false});

        }


        let req_data = {
            conn_name: ConnectionState.connectionname,
            username: ConnectionState.username,
            password: ConnectionState.password,
            attrs: {},
            key: ConnectionState.key
        };
        console.log(req_data);

        for (let key of ConnectionState.attrs) {
            req_data.attrs[key] = ConnectionState[key]

        }
        console.log(req_data);
        if (!is_verification) {
            let url = process.env.REACT_APP_API_URL + '/testconn/';
            let connection = axios.post(url, req_data);
            connection.then(
                res => {
                    console.log(res);
                    if ("errors" in res.data) {
                        setConnectionState({
                            ...ConnectionState,
                            notifications: [...ConnectionState.notifications,
                                <Notification
                                    type="error"
                                    title={res.data.errors}
                                    text={res.data.errors}
                                    delay={500}
                                    shadow={false}
                                    hide={true}
                                    nonblock={false}
                                    desktop={false}
                                    loading={true}/>]
                        })
                    } else {
                        setConnectionState({
                            ...ConnectionState,
                            notifications: [...ConnectionState.notifications,
                                <Notification
                                    type="success"
                                    //                        title = {res.data.errors}
                                    text="Successfully Verified"
                                    delay={500}
                                    shadow={false}
                                    hide={true}
                                    nonblock={false}
                                    desktop={false}/>],
                            is_verified: true
                        })

                    }
                    dispatch({type: 'change loading', payload: false});
                }
            ).catch(function (res) {
                dispatch({type: 'change loading', payload: false});
                console.log(res);
                setConnectionState({
                    ...ConnectionState,
                    notifications: [...ConnectionState.notifications,
                        <Notification
                            type="error"
                            //                        title = {res.data.errors}
                            text={res}
                            delay={500}
                            shadow={false}
                            hide={false}
                            nonblock={true}
                            desktop={true}/>]
                });
                dispatch({type: 'change loading', payload: false});
            })
        } else {
            let url = process.env.REACT_APP_API_URL + '/createconn/';
            let connection = axios.post(url, req_data);


            connection.then(
                res => {
                    console.log(res);
                    if ("errors" in res.data) {
                        setConnectionState({
                            ...ConnectionState,
                            err_comp: [...ConnectionState.err_comp,
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
                    } else {
                        navigate('/viewconnections');
                    }
                    dispatch({type: 'change loading', payload: false});

                }
            ).catch((res) => {
                console.log(res);
                dispatch({type: 'change loading', payload: false});
                setConnectionState({
                    ...ConnectionState,
                    err_comp: [...ConnectionState.err_comp,
                        <Notification
                            type="error"
                            //                        title = {res.data.errors}
                            text={res}
                            delay={2000}
                            shadow={false}
                            hide={false}
                            nonblock={true}
                            desktop={true}/>]
                });
                dispatch({type: 'change loading', payload: false});
            })
        }
    };
    return (
        <div
            className="right_col"
            role="main"
            style={{
                minHeight: 1826
            }}
        >

        {ConnectionState.notifications.map(value => value)}
            <div className>

                <div className="clearfix"/>
                <div className="row">
                    <Loader loading={false}/>
                    <div className="col-md-12 col-sm-12 ">
                        <div className="x_panel">
                            <div className="x_title title_left ">
                                <h3>Create Connection

                                </h3    >
                                <div className="clearfix"/>
                            </div>
                            <div className="x_content">
                                <br/>
                                <form onSubmit={event => handleOnSubmitConnection(event)}
                                      id="demo-form2"
                                      data-parsley-validate
                                      className="form-horizontal form-label-left"
                                      noValidate>
                                    <div className="item form-group">
                                        <label className="col-form-label col-md-3 col-sm-3 label-align ">
                                            DB Type
                                            <span className="required" style={{color: 'red'}}>*</span>
                                        </label>
                                        <div className="col-md-6 col-sm-6 ">
                                            <select className=" form-control" onChange={onSelectMap}>
                                                <option value={""}>Select Option</option>
                                                {ConnectionState.maps.map((item, index) => <option key={index}
                                                                                                   value={item.key}>{item.key}</option>)}
                                            </select>
                                        </div>


                                    </div>
                                    <div className="item form-group">
                                        <label
                                            className="col-form-label col-md-3 col-sm-3 label-align"
                                            htmlFor="connectionname">Connection Name
                                            <span className="required" style={{color: 'red'}}>*</span>
                                        </label>
                                        <div className="col-md-6 col-sm-6 ">
                                            <input
                                                type="text"
                                                id="connectionname"
                                                name="connectionname"
                                                required="required"
                                                className="form-control " required
                                                onChange={event => handleChange(event)}
                                            />
                                        </div>

                                            <div className="alert">Enter Connection name</div>
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
                                                className="form-control" required
                                                onChange={event => handleChange(event)}/>
                                        </div>

                                            <div className="alert ">Enter your Username</div>

                                    </div>

                                    <div className="item form-group">
                                        <label
                                            htmlFor="password"
                                            className="col-form-label col-md-3 col-sm-3 label-align">Password
                                            <span className="required" style={{color: 'red'}}>*</span>
                                        </label>
                                        <div className="col-md-6 col-sm-6">
                                            <input
                                                id="password"
                                                className="form-control"
                                                type="password"
                                                name="password"
                                                onChange={event => handleChange(event)}

                                                required
                                            />
                                        </div>

                                            <div className="alert ">Enter Password</div>

                                    </div>
                                    {ConnectionState.attrs.map((value) => <div className="item form-group">
                                        <label
                                            className="col-form-label col-md-3 col-sm-3 label-align"
                                            htmlFor={value}>{value}
                                            <span className="required" style={{color: 'red'}}>*</span>
                                        </label>
                                        <div className="col-md-6 col-sm-6 ">
                                            <input
                                                type="text"
                                                name={value}
                                                required="required"
                                                className="form-control"
                                                required
                                                onChange={event => handleChange(event)}
                                            />
                                        </div>
                                        <div className="alert">Enter valid {value}</div>
                                    </div>)}
                                    <div className="ln_solid"/>
                                    <div className="item form-group">
                                        <div className="col-md-6 col-sm-6 offset-md-3">

                                            <button type="submit"
                                                    onClick={event => handleOnSubmitConnection(event, ConnectionState.is_verified)}
                                                    className="btn btn-success"
                                                    disabled={!ConnectionState.is_verified}>Submit
                                            </button>
                                            <button type="button" className="btn btn-primary"
                                                    onClick={event => handleOnSubmitConnection(event, ConnectionState.is_verified)}>Verify
                                            </button>
                                            <button type="submit" className="btn btn-danger" onClick={cancel}>Cancel
                                            </button>
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

export default CreateConnection;