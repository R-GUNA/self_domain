import React, {useContext, useEffect, useState} from 'react';
import './viewUsers.css';
import {A, navigate} from "hookrouter";
import Loader from '../utils/Loader';
import axios from 'axios';
import {store} from "../../store";
import {Notification} from "react-pnotify";

function Viewusers(props) {
    const [globalState, dispatch] = useContext(store);
    const [viewState, setViewState] = useState({
        details: [],
        loading: false,
        notifications:[]
    });
    const editUser = (event, id) => {
        dispatch({type: 'change loading', payload: true});
        console.log(viewState.loading);
        console.log(id);

        navigate("/editusers/" + id);
        dispatch({type: 'change loading', payload: false});

    };

    const deleteUsers = (event, id) => {


        event.preventDefault();
        //console.log(ViewState)

        console.log(id);
        window.$('#delete-' + id).modal('show');
    };


    const deleteUser = (event, id, user_name, user_email, user_isadmin, index) => {

        event.preventDefault();
        console.log(user_name + user_email + user_isadmin + index);
        console.log(viewState.details);
        dispatch({type: 'change loading', payload: true});
        let newState = viewState.details;
        newState.splice(index, 1);
        console.log(newState);
        setViewState({...viewState, details: newState});
        console.log(viewState.details);
        axios.delete(process.env.REACT_APP_API_URL + "/deleteuser/" + id)
            .then(response => {
                setViewState({
                ...viewState,
                notifications: [...viewState.notifications,
                    <Notification
                        type="success"
                        title={"Deleted Successfully"}
                        delay={1500}
                        shadow={false}
                        hide={true}
                        nonblock={true}
                        desktop={true}/>]
            });
                console.log("deleted")

            });
        window.$('#delete-' + id).modal('hide');
//           window.location.reload();

        dispatch({type: 'change loading', payload: false});
    };

    console.log(viewState);
    useEffect(res => {
        dispatch({type: 'change loading', payload: true});
        let users_resp = axios.get(process.env.REACT_APP_API_URL + "/getallusers/");


        users_resp.then(response => {
            console.log(response.data);
            setViewState({...viewState, details: response.data});
            dispatch({type: 'change loading', payload: false});

        });

    }, []);

    return (

        <div className="right_col" role="main" style={{minHeight: 1211}}>
        {viewState.notifications.map(value => value)}
            <div className>
                <Loader loading={false}/>
                <div className="page-title">
                    <div className="title_left">
                        <h3>Users</h3>
                    </div>
                    <div className="pull-right">
                        <A href="/auth" className="btn btn-app">
                            <i class="fa fa-plus"></i>New User
                        </A>
                    </div>
                </div>
                <div className="clearfix"/>


                <div className="row">
                    <div className="col-md-12 col-sm-12 ">
                        <div className="x_panel">
                            <div className="x_content">
                                <div class="table-responsive">
                                    <table class="table table-striped jambo_table bulk_action">
                                        <thead>
                                        <tr class="headings">
                                            <th></th>
                                            <th class="column-title">Username</th>
                                            <th class="column-title">Email</th>
                                            <th class="column-title">Admin</th>
                                            <th class="column-title no-link last"><span class="nobr">Action</span>
                                            </th>

                                        </tr>
                                        </thead>
                                        <tbody>
                                        {viewState.details.map((user, index) => {
                                            return (
                                                <tr class="even pointer">
                                                    <td class=" ">{index + 1}</td>
                                                    <td class=" ">{user.name}</td>
                                                    <td class=" ">{user.email}</td>
                                                    <td class=" ">{user.isadmin ? "Yes" : "No"} </td>
                                                    <td class=" last">
                                                        <div class="btn-toolbar" role="toolbar"
                                                             aria-label="Toolbar with button groups">


                                                            <div style={{padding: 5}}>
                                                                <a href="#"
                                                                   onClick={(event) => editUser(event, user.id)}>
                                                                    <i className="fa fa-pencil-square-o fa-lg "
                                                                       aria-hidden="true" data-toggle="active"
                                                                       title="Edit"></i></a>
                                                            </div>
                                                            <div style={{padding: 5}}>
                                                                <a href="#"
                                                                   onClick={(event) => deleteUsers(event, user.id)}>
                                                                    <i className="fa fa-trash fa-lg" aria-hidden="true"
                                                                       data-toggle="active" title="Delete"></i>
                                                                </a>
                                                            </div>
                                                            <div className="modal fade" id={"delete-" + user.id}
                                                                 role="dialog">
                                                                <div className="modal-dialog">
                                                                    <div className="modal-content">
                                                                        <div className="modal-header">
                                                                            <h4 className="modal-title"
                                                                                style={{textAlign: 'left'}}>Are you
                                                                                sure?</h4>
                                                                            <button type="button" className="close"
                                                                                    data-dismiss="modal">&times;</button>

                                                                        </div>

                                                                        <div className="modal-footer">
                                                                            <button type="button"
                                                                                    className="btn btn-default"
                                                                                    onClick={(event) => deleteUser(event, user.id, user.name, user.email, user.isadmin, index)}>Yes
                                                                            </button>
                                                                            <button type="button"
                                                                                    className="btn btn-default"
                                                                                    data-dismiss="modal">No
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )
                                        })
                                        }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


            </div>
        </div>

    );

}

export default Viewusers;