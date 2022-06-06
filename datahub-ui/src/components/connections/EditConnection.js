import React, {useContext, useEffect, useState} from 'react';
import {Notification} from "react-pnotify";
import {navigate} from 'hookrouter';
import axios from 'axios';
import {store} from "../../store";
import Loader from "../utils/Loader";
import {validations} from "../utils/Constants";

let EditConnection = props => {
    const [globalState, dispatch] = useContext(store);

    console.log("Id " + props.id);
    const [ConnectionState, setConnectionState] = useState({
        connectionname: "",
        username: "",
        password: "",
        maps: [],
        attrs: [],
        notifications: [],
        key: "",
    });


    useEffect(() => {


        axios.get(process.env.REACT_APP_API_URL + "/fetchmaps/")
            .then(res => {
                dispatch({type: "change loading", payload: true});
                setConnectionState({...ConnectionState, maps: res.data});
                axios.get(process.env.REACT_APP_API_URL + "/getconndetails/" + props.id)
                    .then(response => {
                        let newState = ConnectionState;
                        newState.maps = res.data;
                        newState.connectionname = response.data.conn_name;
                        newState.username = response.data.username;
                        newState.password = response.data.password;
                        newState.attrs = Object.keys(response.data.attrs);
                        for (let key of Object.keys(response.data.attrs)) {
                            newState[key] = response.data.attrs[key]
                        }
                        newState.key = response.data.key;
                        setConnectionState(newState);
                        dispatch({type: "change loading", payload: false});

                    })
            });

    }, []);

    const onSelectMap = (event) => {
        for (let i of ConnectionState.maps) {
            if (event.target.value === i.key) {
                let inputs_arr = Object.keys(i.attrs);
                console.log(inputs_arr);
                setConnectionState({...ConnectionState, attr1: inputs_arr[0], attr2: inputs_arr[1], key: i.key})
            }
        }
    };

    const cancelUpdate = () => {
        navigate("/viewconnections")
    };

    const handleClick = (event) => {
        event.preventDefault();
        console.log({[event.target.getAttribute('name')]: event.target.value});
        try {
            var re = new RegExp(validations[event.target.getAttribute('name')]);
            let is_valid = re.test(event.target.value);
            let alert_element = event.target.parentNode.nextSibling;
            if (!is_valid) {
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

    const handleOnSubmitConnection = (event) => {
        event.preventDefault();
        dispatch({type: "change loading", payload: true});

        if (window.$(".show-alert").length > 0) {
            console.log(ConnectionState.notifications);
            setConnectionState({
                ...ConnectionState,
                notifications: [...ConnectionState.notifications,
                    <Notification
                        type="error"
                        title={"Fields are empty or invalid fields"}
                        delay={1500}
                        shadow={false}
                        hide={true}
                        nonblock={true}
                        desktop={true}/>]
            });
            console.log(ConnectionState.notifications);
            dispatch({type: "change loading", payload: false});
            return null
        }

        let req_data = {
            conn_name: ConnectionState.connectionname,
            username: ConnectionState.username,
            password: ConnectionState.password,
            key: ConnectionState.key,
            attrs: {}
        };
        ConnectionState.attrs.forEach(value => {
            req_data.attrs[value] = ConnectionState[value]
        });

        let url = process.env.REACT_APP_API_URL + '/updateconn/' + props.id;
        let connection = axios.put(url, req_data);

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
                                delay={1500}
                                shadow={false}
                                hide={true}
                                nonblock={true}
                                desktop={true}/>]
                    })
                }
                    setConnectionState({
                        ...ConnectionState,
                        notifications: [...ConnectionState.notifications,
                            <Notification
                                type="success"
                                title={"Updated Successfully"}

                                delay={1500}
                                shadow={false}
                                hide={true}
                                nonblock={true}
                                desktop={true}/>]
                    });
                navigate('/viewconnections');
                dispatch({type: "change loading", payload: false});

            }
        ).catch(function (res) {
            dispatch({type: "change loading", payload: false});
            console.log(res);
            setConnectionState({
                ...ConnectionState,
                notifications: [...ConnectionState.notifications,
                    <Notification
                        type="error"
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
            }}>
            {ConnectionState.notifications.map(value => value)}
            <div className>
                <form onSubmit={event => handleOnSubmitConnection(event)}
                      id="{props.id}"
                      data-parsley-validate
                      className="form-horizontal form-label-left"
                      noValidate>
                    <div className="clearfix"/>
                    <div className="row">
                        <Loader loading={false}/>
                        <div className="col-md-12 col-sm-12 ">
                            <div className="x_panel">
                                <div className="x_title">
                                    <h2>Update Connection

                                    </h2>
                                    <div className="clearfix"/>
                                </div>
                                <div className="x_content">
                                    <br/>
                                    <form
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
                                                <select disabled className=" form-control">
                                                    <option value={ConnectionState.key}>{ConnectionState.key}</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="item form-group">
                                            <label
                                                className="col-form-label col-md-3 col-sm-3 label-align"
                                                htmlFor="connection-name">Connection Name
                                                <span className="required" style={{color: 'red'}}>*</span>
                                            </label>
                                            <div className="col-md-6 col-sm-6 ">
                                                <input
                                                    type="text"
                                                    placeholder={ConnectionState.connectionname}
                                                    id="connection_name"
                                                    name="connectionname"
                                                    className="form-control " required
                                                    onChange={handleClick}
                                                />
                                            </div>
                                            <div className="alert">invalid</div>
                                        </div>

                                        <div className="item form-group">
                                            <label
                                                className="col-form-label col-md-3 col-sm-3 label-align"
                                                htmlFor="Username">Username
                                                <span className="required" style={{color: 'red'}}>*</span>
                                            </label>
                                            <div className="col-md-6 col-sm-6 ">
                                                <input
                                                    type="text"
                                                    id="user-name"
                                                    name="username"
                                                    required="required"
                                                    className="form-control" required
                                                    placeholder={ConnectionState.username}
                                                    onChange={handleClick}
                                                />
                                            </div>
                                            <div className="alert">invalid</div>

                                        </div>
                                        <div className="item form-group">
                                            <label
                                                htmlFor="password"
                                                className="col-form-label col-md-3 col-sm-3 label-align">Password
                                                <span className="required" style={{color: 'red'}}>*</span>
                                            </label>
                                            <div className="col-md-6 col-sm-6 ">
                                                <input
                                                    id="password"
                                                    className="form-control"
                                                    type="password"
                                                    name="password"
                                                    pattern="(^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$)"
                                                    placeholder="********"
                                                    onChange={handleClick}
                                                    required
                                                />
                                            </div>
                                            <div className="alert">invalid</div>
                                        </div>
                                        {ConnectionState.attrs.map(key =>
                                            <div className="item form-group">
                                                <label
                                                    className="col-form-label col-md-3 col-sm-3 label-align"
                                                    htmlFor={key}>{key}
                                                    <span className="required" style={{color: 'red'}}>*</span>
                                                </label>
                                                <div className="col-md-6 col-sm-6 ">
                                                    <input
                                                        type="text"
                                                        id={key}
                                                        name={key}
                                                        required="required"
                                                        placeholder={ConnectionState[key]}
                                                        className="form-control" required
                                                        onChange={(event) => handleClick(event)}
                                                    />
                                                </div>
                                                <div className="alert">invalid</div>
                                            </div>
                                        )}
                                        <div className="ln_solid"/>
                                        <div className="item form-group">
                                            <div className="col-md-6 col-sm-6 offset-md-3">

                                                <button type="submit" className="btn btn-success">Update</button>
                                                <button type="submit" className="btn btn-danger"
                                                        onClick={cancelUpdate}>Cancel
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>

                    </div>
                </form>
            </div>

        </div>
    );
};

export default EditConnection;