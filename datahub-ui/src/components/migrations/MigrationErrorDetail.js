import React, {useContext, useEffect, useState} from "react";
import {get_error_details} from "./MigrationService";
import DateTime from "../utils/DateTime";
import {DATABASE_MIGRATION, FILEMIGRATIONTABLELOGSTATUS, MigrationTableStatusConstant} from "../utils/Constants";
import {store} from "../../store";
import axios from 'axios';
import {Notification} from "react-pnotify";
import clickDropdown from "../utils/DropDown";

function MigrationErrorDetail(props) {
    console.log(props);
    const [globalState, dispatch] = useContext(store);
    const [state, setState] = useState({notifications: []});
    useEffect(() => {
        dispatch({type: 'change loading', payload: true});
        get_error_details(props.error_id).then(res => {
            console.log(res.data);

            setState({...state,error_details: res.data});
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
            });
        }).finally(() => dispatch({type: 'change loading', payload: false}))


    }, []);

    const retry = (inputValue, {action}, tableid, logid) => {
        if (action === "set-value") {
            dispatch({type: 'change loading', payload: true});
            let url = process.env.REACT_APP_API_URL + '/retrytablemig/';
            let retry = axios.post(url,
                {
                    mig_id: props.mig_id,
                    table_id: tableid,
                    log_id: logid
                }).finally(()=> dispatch({type: 'change loading', payload: false}))

        }

    };


    const options = [
        {value: 'Migrate with Structure Creation', label: 'Migrate with Structure Creation'},
        {value: 'Migrate Data Only', label: 'Migrate Data Only'},

    ];
 const go = () => {
        window.history.back();
    };

    console.log(state)
    if (state.hasOwnProperty("error_details")) {
        return (

            <div class="right_col" role="main" style={{'min-height': 1047}}>

                {state.notifications.map(value => value)}

<div class="col-md-12">
                        <div className="pull-right">
                          <button  className="btn btn-app" onClick={go}>
                            <i class="fa fa-arrow-left"></i>Back
                          </button>
                        </div>


                    <div class="x_panel">

                        <div class="x_title">
                            <h2>Migration Report</h2>
                            <ul class="nav navbar-right panel_toolbox">
                                <li><a class="collapse-link" onClick={event=>clickDropdown(event,"mreport-"+props.mig_id+props.error_id)}><i class="fa fa-chevron-up"></i></a>
                                </li>
                            </ul>
                            <div class="clearfix"></div>
                        </div>
                        <div id={"mreport-"+props.mig_id+props.error_id} class="x_content" style={{display: 'block', paddingLeft: 50, paddingRight: 50}}>
                            <section class="content invoice">

                                <ul class="stats-overview">
                                    <li>
                                        <span class="name"> Error in Structure Creation </span>
                                        <span class="value text-success"> {state.error_details.counts.ddl_cnt} </span>
                                    </li>
                                    <li>
                                        <span class="name"> Error in Data Migration </span>
                                        <span class="value text-success"> {state.error_details.counts.data_cnt} </span>
                                    </li>
                                    <li class="hidden-phone" style={{paddingLeft: 60}}>
                                        <span class="name"> Successfully Migrated </span>
                                        <span
                                            class="value text-success"> {state.error_details.counts.success_cnt} </span>
                                    </li>


                                </ul>
                                <ul class="stats-overview">
                                    <li style={{width: '50%'}}>
                                        <span class="name"> Start Date </span>
                                        <span class="value text-success"> <DateTime
                                            datetime={state.error_details.counts.start_date}/> </span>
                                    </li>
                                    <li style={{paddingLeft: 100}}>
                                        <span class="name"> End Date </span>
                                        <span class="value text-success "> <DateTime
                                            datetime={state.error_details.counts.end_date}/></span>
                                    </li>
                                </ul>

                                <div class="row">
                                    <div class="table container">
                                        <table class="table table-striped">
                                            <thead>
                                            <tr>
                                                <th></th>
                                                <th>Table Name</th>
                                                <th>Status</th>
                                                <th>Description</th>
                                                <th>Start Date</th>
                                                <th>End Date</th>
                                                <th></th>


                                            </tr>
                                            </thead>
                                            <tbody>

                                            {state.error_details.data.map((value, index) =>
                                                <tr>


                                                    <td>{index + 1}</td>

                                                    <td>{value.table_name}</td>
                                                    {state.error_details.hasOwnProperty("counts") && state.error_details.counts.mig_type === DATABASE_MIGRATION ?
                                                        <td>{MigrationTableStatusConstant[value.status_code]}</td> :
                                                        <td>{FILEMIGRATIONTABLELOGSTATUS[value.status_code]}</td>}
                                                    <td>{value.description === " " ? "-" : value.description}</td>
                                                    <td><DateTime datetime={value.start_date}/></td>
                                                    <td><DateTime datetime={value.end_date}/></td>
                                                    {/*Todo Fix Retry in Backend*/}
                                                    {/*<td style={{width: 170}}>*/}
                                                    {/*    {value.status_code === 4 ? null : <Select placeholder="Retry..."*/}
                                                    {/*                                              options={options}*/}
                                                    {/*                                              onInputChange={(inputValue, {action}) => retry(inputValue, {action}, value.table_id, value.log_id)}*/}

                                                    {/*    />}*/}
                                                    {/*</td>*/}
                                                </tr>
                                            )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div class="row no-print">
                                    <div class=" ">
                                        <a href={process.env.REACT_APP_API_URL + "/logdetails/" + props.error_id + "?type=csv"}
                                           class="btn btn-primary" style={{'margin-right': 5}} download><i class="fa fa-download"/> Generate CSV
                                        </a>
                                        {state.hasOwnProperty("error_details")?<a href={"/"+ props.mig_id + "/" + state.error_details.counts.mig_type +'/viewdetails'} className="btn btn-primary">View Mapping Detail</a>:null}

                                    </div>
                                    <div class=" ">


                                    </div>
                                </div>

                            </section>
                        </div>
                    </div>
                </div>
            </div>
        );
    } else {
        return (<div className="right_col" role="main" style={{'min-height': 1047}}>
            {state.notifications.map(value => value)}
            <div className="col-md-12">
                <div className="x_panel">
                    <div className="x_title">
                        <h2>Migration Report</h2>
                        <ul className="nav navbar-right panel_toolbox">
                            <li><a className="collapse-link" onClick={event=>clickDropdown(event,"mig_report-"+props.mig_id+props.error_id)}><i className="fa fa-chevron-up"></i></a>
                            </li>
                        </ul>
                        <div className="clearfix"></div>
                    </div>
                    <div className="x_content" id={"mig_report-"+props.mig_id+props.error_id} style={{display: 'block'}}>
                        <section className="content invoice">

                            <ul className="stats-overview">
                                <li>
                                    <span className="name"> Error in Structure Creation </span>
                                    <span className="value text-success"> 0 </span>
                                </li>
                                <li>
                                    <span className="name"> Error in Data Migration </span>
                                    <span className="value text-success"> 0 </span>
                                </li>
                                <li className="hidden-phone">
                                    <span className="name"> Successfully Migrated </span>
                                    <span className="value text-success"> 0 </span>
                                </li>
                            </ul>

                            <div className="row">
                                <div className="table container">
                                    <table className="table table-striped">
                                        <thead>
                                        <tr className="even-pointer">
                                            <th></th>
                                            <th>Table Name</th>
                                            <th>Status</th>
                                            <th>Description</th>
                                            <th>Log Date</th>

                                        </tr>
                                        </thead>
                                        <tbody>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="row no-print">
                                <div>
                                    <div className=" ">
                                        <a href={process.env.REACT_APP_API_URL + "/logdetails/" + props.error_id  + "?type=csv"}
                                           className="btn btn-primary pull-right" style={{'margin-right': 5}}
                                           download><i
                                            className="fa fa-download"></i> Generate CSV
                                        </a>
                                        {state.hasOwnProperty("error_details")?<a href={"/"+ props.mig_id + "/" + state.error_details.counts.DB +'/viewdetails'} className="btn btn-primary">View Mapping Detail</a>:null}

                                    </div>


                                </div>
                            </div>

                        </section>
                    </div>
                </div>
            </div>
        </div>)
    }
}

export default MigrationErrorDetail;