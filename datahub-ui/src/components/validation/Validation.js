import React, {useContext, useEffect, useState} from "react";
import {go} from "../utils/Utils";
import axios from 'axios';
import {store} from "../../store";
import {navigate} from "hookrouter";
import DateTime from "../utils/DateTime";
import {Notification} from "react-pnotify";
import {VALIDATION_STATUS} from "../utils/Constants";
import {ClipLoader} from "react-spinners";
import clickDropdown from "../utils/DropDown";

function Validation(props) {
    console.log(props.id);
    const [globalState, dispatch] = useContext(store);
    const [state, setState] = useState({
        detail: [],
        mig_name: "",
        source_db: "",
        target_db: "",
        notifications: []
    });
    useEffect(res => {
        dispatch({type: 'change loading', payload: true});

        axios.get(process.env.REACT_APP_API_URL + "/listValidation/" + props.id)
            .then(list_res => {
                axios.get(process.env.REACT_APP_API_URL + "/showmig/" + props.id)
                    .then(res => {
                        console.log(res.data);
                        setState({
                            ...state, mig_name: res.data.mig_name, source_db: res.data.source_name,
                            target_db: res.data.target_name, detail: list_res.data
                        });
                    }).catch(reason => {
                    setState({
                        ...state, notifications: [...state.notifications, <Notification
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
                }).finally(() => dispatch({type: "change loading", payload: false}))
            }).catch(reason => {
            setState({
                ...state, notifications: [...state.notifications, <Notification
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
            dispatch({type: "change loading", payload: false});
        })

    }, []);


   if(state.detail.length>0){
    return (
        <div class="right_col" role="main" style={{'min-height': 1047}}>
            {state.notifications.map(value =>
                value)}
            <div class="col-md-12">
                <div className="pull-right">
                    <button href="" className="btn btn-app" onClick={go}>
                        <i class="fa fa-arrow-left"></i>Back
                    </button>

                </div>
                <div class="x_panel">
                    <div className="x_title">
                           <h2><b>{state.mig_name}</b></h2>
                           <div className="clearfix"></div>
                    </div>

                    <div class="x_title">
                        <h2>Validation Summary<small>({state.source_db} - {state.target_db})</small>
                        </h2>

                        <ul class="nav navbar-right panel_toolbox">
                            <li><a onClick={event=>clickDropdown(event,"summary"+props.id)} class="collapse-link"><i class="fa fa-chevron-up"></i></a>
                            </li>

                        </ul>
                        <div class="clearfix"></div>
                    </div>
                    <div class="x_content" id={"summary"+props.id} style={{display: 'block'}}>
                        <section class="content invoice">



                            <div class="row">
                                <div class="table container">
                                    <table class="table table-striped">
                                        <thead>

                                        <tr>
                                            <th></th>
                                            <th>Validation Name</th>
                                            <th>Status</th>
                                            <th>Start Time</th>
                                            <th>End Time</th>
                                            <th></th>


                                        </tr>
                                        </thead>
                                        <tbody>
                                        {state.detail.map((value,index)=>
                                                <tr>
                                                    <td>{index + 1}</td>
                                                    <td>{value.name}</td>

                                                    <td>{value.end_date == null ? <ClipLoader color={'#4756ff'}
                                                                                              size={15}/> : VALIDATION_STATUS[value.status]}</td>

                                                    <td><DateTime datetime={value.start_date}/></td>
                                                    <td><DateTime datetime={value.end_date}/></td>
                                                    <td>
                                                        <button type="button" class="btn btn-primary"
                                                                onClick={(event) => navigate('/validationreport/' + value.id)}>View
                                                            Details
                                                        </button>


                                                       <a href={process.env.REACT_APP_API_URL + "/listTableValidation/" + value.id  + "?type=csv"} class="btn btn-primary " style={{'margin-left':5}}><i
                                                           class="fa fa-download"></i> Generate CSV
                                                       </a>

                                                       <a href={process.env.REACT_APP_API_URL + "/downloadhashvalidation/" + value.id  + "?type=csv"} class="btn btn-primary "
                                                           style={{'margin-left':5}}><i
                                                           class="fa fa-download"></i> Hash Details
                                                       </a>
                                                    </td>

                                        </tr>

                                        ) }
                                        </tbody>
                                    </table>
                                </div>

                            </div>





                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
    }
else {
        return (<div className="right_col" role="main" style={{'min-height': 1047}}>
                {state.notifications.map(value =>
                    value)}
                <div class="col-md-12">
                    <div className="pull-right">

                        <button href="" className="btn btn-app" onClick={go}>
                            <i class="fa fa-arrow-left"></i>Back
                        </button>

                    </div>
                    <div class="x_panel">
                        <div className="x_title">
                           <h2><b>{state.mig_name} </b></h2>
                           <div className="clearfix"></div>
                        </div>
                        <div class="x_title">
                        <h2>Validation Summary <small>({state.source_db} - {state.target_db})</small></h2>
                        <ul className="nav navbar-right panel_toolbox">
                                                    <li><a onClick={event => {
                                                        clickDropdown(event,"vsummary-"+props.id )
                                                    }} className="collapse-link"><i className="fa fa-chevron-up"/></a>
                                                    </li>
                                                </ul>
                        <div class="clearfix"></div>
                    </div>
                    <div id={"vsummary-"+props.id} class="x_content" style={{display: 'block'}}>
                        <section class="content invoice">



                            <div class="row">
                                <div class="table container">
                                    <table class="table table-striped">
                                        <thead>

                                        <tr>
                                            <th></th>
                                            <th>Validation ID</th>
                                            <th>Validation Name</th>
                                            <th>Status</th>
                                            <th>Start Time</th>
                                            <th>End Time</th>
                                            <th></th>

                                        </tr>
                                        </thead>
                                        <tbody>
                                          <tr>
                                           <td></td>
                                           <td></td>
                                           <td></td>

                                           <td style={{fontSize:'20'}}><b>No Data Available</b></td>
                                           <td></td>
                                           <td></td>
                                           <td></td>
                                          </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
              </div>
        </div>

        )
    }
}

export default Validation;