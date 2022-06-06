import React, {useContext, useEffect, useState} from 'react';
import './viewConnection.css';
import {A, navigate} from "hookrouter";
import Loader from '../utils/Loader';
import axios from 'axios';
import {store} from "../../store";
import {Notification} from "react-pnotify";

function ViewConnection(props) {
    const [globalState, dispatch] = useContext(store);
    const [viewConState, setViewConState] = useState({
        d: [],
        notifications:[]

    });
    useEffect(res => {
        dispatch({type: 'change loading', payload: true});
        let d1 = axios.get(process.env.REACT_APP_API_URL + "/fetchconns/");

        d1.then(response => {

            console.log(response.data);
            setViewConState({...viewConState, d: response.data});
            dispatch({type: 'change loading', payload: false});
        })

    }, []);
    console.log(viewConState.d);
    const editCon = (event, id) => {
        console.log(id);
        navigate('/editconnections/' + id);
    };

    const deleteCons = (event, id) => {

        console.log(id);
        window.$('#deletec-' + id).modal('show');
//
//
//


    };

    const deleteCon = (event, id, conn_name, key, username, index) => {
        console.log(id + conn_name + key + username + index);
        console.log(viewConState.d);
        dispatch({type: 'change loading', payload: true});
        let newState = viewConState.d;
        newState.splice(index, 1);
        console.log(newState);
        setViewConState({...viewConState, d: newState});
        console.log(viewConState.d);
        axios.delete(process.env.REACT_APP_API_URL + "/deleteconn/" + id)
            .then(response => {
                         setViewConState ( {
                ...viewConState, notifications: [...viewConState.notifications, <Notification
                    type='success'
                    title='Deleted Successfully'
                    //                        text={name}
                    delay={1500}
                    shadow={false}
                    hide={true}
                    nonblock={true}
                    desktop={true}
                />],
                });



        }).catch(reason => {
            setViewConState ( {
                ...viewConState, notifications: [...viewConState.notifications, <Notification
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
        }).finally(()=>dispatch({type: "change loading", payload: false}));
                console.log("deleted")


        window.$('#deletec-' + id).modal('hide');

//            window.location.reload();
        dispatch({type: 'change loading', payload: false});
    };

    return (
        <div className="right_col" role="main" style={{minHeight: 1211}}>
            <div className>
                {viewConState.notifications.map(value =>
                    value)}
                <div className="page-title">
                    <div className="title_left">
                        <h3>Connections</h3>

                    </div>
                    <div className="pull-right">
                        <A href="/createconnections" className="btn btn-app">
                            <i class="fa fa-plus"></i>New Connection
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
                                            <th class="column-title">Connection Name</th>
                                            <th class="column-title">Type</th>
                                            <th class="column-title">Username</th>
                                            <th class="column-title no-link last"><span class="nobr">Action</span>
                                            </th>

                                        </tr>
                                        </thead>
                                        <tbody>
                                        {viewConState.d.map((con, index) => {
                                            return (

                                                <tr class="even pointer">
                                                    <td class=" ">{index + 1}</td>
                                                    <td class=" ">{con.conn_name}</td>
                                                    <td class=" ">{con.key}</td>
                                                    <td class=" ">{con.username} </td>
                                                    <td class=" last">
                                                        <div class="btn-toolbar" role="toolbar"
                                                             aria-label="Toolbar with button groups">

                                                            <div style={{padding: 5}}>
                                                                <a href="#"
                                                                   onClick={(event) => editCon(event, con.conn_id)}>
                                                                    <i className="fa fa-pencil-square-o fa-lg"
                                                                       aria-hidden="true" data-toggle="active"
                                                                       title="Edit"></i></a>
                                                            </div>
                                                            <div style={{padding: 5}}>
                                                                <a href="#"
                                                                   onClick={(event) => deleteCons(event, con.conn_id)}>
                                                                    <i className="fa fa-trash fa-lg " aria-hidden="true"
                                                                       data-toggle="active" title="Delete"></i>
                                                                </a>
                                                            </div>
                                                            <div className="modal fade" id={"deletec-" + con.conn_id}
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
                                                                                    onClick={(event) => deleteCon(event, con.conn_id, con.conn_name, con.key, con.username, index)}>Yes
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

export default ViewConnection;