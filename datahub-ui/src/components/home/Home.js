import React, {useContext, useEffect, useState} from "react";
import {get_count_migrations, get_migrations} from "../migrations/MigrationService";
import {A, navigate} from 'hookrouter'
import {store} from "../../store";
import DateTime from "../utils/DateTime";
import {cloneMigration, MigrationLogs} from "./HomeServices";
import {clickTableDropdown} from "../utils/DropDown";
import {Notification} from "react-pnotify";
import {MigrationConst, StageStatus, VALIDATION_STATUS, ValidationStatusConstant} from "../utils/Constants";

const cloneDeep = require("lodash.clonedeep");

const Progressbar = (props) => {
    {
        if (props.value.status_code === 2 && props.value.current_stage === 3) {
            return (
                <td className="project_progress">
                    <div className="progress progress_md">
                        <div className="progress-bar bg-danger" role="progressbar"
                             data-transitiongoal={"100"}
                             aria-valuenow={(props.value.current_stage +1) * 25}
                             style={{width: (props.value.current_stage +1) * 25 + "%"}}/>
                        {(props.value.current_stage + 1) * 25 + "%"}
                    </div>
                    <small>Migration Failed</small>
                </td>)
        }
        else if(props.value.status_code === 3 && props.value.current_stage === 3){
            return (
                <td className="project_progress">
                    <div className="progress progress_md">
                        <div className="progress-bar bg-warning" role="progressbar"
                             data-transitiongoal={"100"}
                             aria-valuenow={(props.value.current_stage + 1) * 25}
                             style={{width: (props.value.current_stage + 1) * 25 + "%"}}/>
                        {(props.value.current_stage + 1) * 25 + "%"}
                    </div>
                    <small>Migration Partially completed</small>
                </td>)
        }
          else {
             return (<td className="project_progress">
                <div className="progress progress_md">
                    <div className="progress-bar bg-green" role="progressbar"
                         data-transitiongoal={"100"}
                         aria-valuenow={(props.value.current_stage + 1) * 25}
                         style={{width: (props.value.current_stage + 1) * 25 + "%"}}/>
                    {(props.value.current_stage + 1) * 25 + "%"}
                </div>
                <small>{StageStatus[props.value.status_code]}</small>
            </td>)
        }
    }
}

let Home = (props) => {
    let _isMounted = false;
    const [globalState, dispatch] = useContext(store);
    const [State, setState] = useState(
        {
            is_loading: false,
            migrations: [],
            notifications: [],
            migration_started: false,
            counts: {},
            logs: []


        }
    );
    useEffect(() => {
        _isMounted = true;
        dispatch({type: "change loading", payload: true});

        get_migrations(localStorage.getItem("user_token")).then((response) => {
                get_count_migrations().then(res => {
                    console.log(response);
                    setState({...State, counts: res.data, migrations: response.data});

                }).catch(reason =>
                    setState({
                        ...State, notifications: [...State.notifications, <Notification
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
                ).finally(()=>dispatch({type: "change loading", payload: false}))
            }
        ).catch(reason => {
            setState({
                ...State, notifications: [...State.notifications, <Notification
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
            dispatch({type: "change loading", payload: false})
        })

    }, []);

    let getMigrationLogs = (event, migid, index) => {
        dispatch({type: "change loading", payload: true});

        MigrationLogs(migid).then(resp => {
            console.log(resp.data);
            clickTableDropdown(event, "migration-" + index);
            let newState = State;
            newState[index] = resp.data;
            setState(newState);

        }).catch(reason => {
            setState({
                ...State, notifications: [...State.notifications, <Notification
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
    };
    let dropup = (event, index) => {
        let newState = cloneDeep(State);
        delete newState[index];
        setState(newState);
        console.log(newState);
    };

    let onSubmitClone = (event, id, index) => {
        event.preventDefault();
        window.$("#CloneModal-" + index).modal("hide");
        dispatch({type: "change loading", payload: true});
        let resp_data = {
            mig_id: id,
            mig_name: event.target["0"].value,

        };
        cloneMigration(resp_data).then(res => {
            let newState = State;
            newState.migrations = [...newState.migrations, res.data];
            setState(newState);
            dispatch({type: "change loading", payload: false});

        })
    };
    console.log(State)
    console.log(State.counts);
    console.log(State.counts.migration_count);

    if(State.migrations.length>0){
    return (
        <div className="right_col" role="main" style={{minHeight: 1211}}>
            {State.notifications.map(value =>
                value)}


            <div className>
                <div className="page-title">
                    <div className="title_left">
                        <h3>Dashboard</h3>

                    </div>

                    <div className="pull-right">

                        <a onClick={event => window.location.reload(false)} className="btn btn-app">
                            <i className="fa fa-repeat"></i> Refresh
                        </a>
                    </div>
                    <div className="pull-right">
                        <A href="/migration/configure/database" className="btn btn-app">
                            <i class="fa fa-plus"></i>Migration Build
                        </A>
                    </div>
                </div>
                <div className="row" style={{display: "inline-block", width: "100%", fontWeight: "bold"}}>
                    <div className="tile_count">
                        <div className="col-md-2 col-sm-4  tile_stats_count">
                            <span className="count_top"><i className="fa fa-spinner"></i> In-progress Migrations</span>
                            <div className="count" style={{fontSize: 25, color: "#1ABB9C"}}>{State.counts.migration_count}</div>
                        </div>
                        <div className="col-md-2 col-sm-4  tile_stats_count">
                            <span className="count_top"><i className="fa fa-spinner"></i> In-progress Tables</span>
                            <div className="count" style={{fontSize: 25, color: "#1ABB9C"}}>{State.counts.table_count}</div>
                        </div>
                        <div className="col-md-2 col-sm-4  tile_stats_count">
                            <span className="count_top"><i className= "fa fa-hourglass-half"></i> Pending Table Count</span>
                            <div className="count green" style={{fontSize: 25, color: "#1ABB9C"}}>{State.counts.pending_table_count}</div>
                        </div>
                        <div className="col-md-2 col-sm-4  tile_stats_count">
                            <span className="count_top"><i className="fa fa-warning"></i> Failed Tables</span>
                            <div className="count green" style={{fontSize: 25, color: "#1ABB9C"}}>{State.counts.failed_table_count}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="clearfix"/>
            <div className="row">
                <div className="col-md-12 col-sm-12 ">
                    <div className="x_panel">
                        <div className="x_content" style={{Width: '100'}}>

                            <div>
                                <table style={{tableLayout: "fixed",}}
                                       class="table table-striped jambo_table">
                                    <thead>
                                    <tr className="headings">

                                        <th></th>
                                        <th className="column-title" style={{paddingBottom:'30px'}}>Migration Name</th>
                                        <th class="column-title">Source Connection Name</th>
                                        <th class="column-title">Target Connection Name</th>
                                        <th className="column-title" style={{paddingBottom:'30px'}}>Progress</th>
                                        <th className="column-title" style={{paddingBottom:'30px'}}>Created Date</th>
                                        <th className="column-title" style={{paddingBottom:'30px'}}>Validation Status</th>
                                        <th class="column-title no-link last" style={{paddingBottom:'30px'}}><span class="nobr">Action</span>
                                        </th>

                                    </tr>
                                    </thead>

                                    <tbody style={{tableLayout: "Responsive"}}>
                                    {State.migrations.map((value, index) =>
                                        <React.Fragment>
                                            <tr class="" style={{padding: 35}}>


                                                {State.hasOwnProperty(index) ?
                                                    <td style={{paddingLeft: 50}}><a className="fa fa-minus fa-lg"
                                                                                     onClick={event => dropup(event, index)}> </a>
                                                    </td> :
                                                    <td style={{paddingLeft: 50}}><a className="fa fa-plus fa-lg"
                                                                                     onClick={event => getMigrationLogs(event, value.mig_id, index)}></a>
                                                    </td>}


                                                <td className=" ">{value.mig_name}</td>
                                                <td className=" ">{value.source_name}</td>
                                                <td className=" ">{value.target_name}</td>
                                                <Progressbar value={value}/>
                                                <td className=" "><DateTime datetime={value.created_date}/></td>
                                                <td className=" ">{VALIDATION_STATUS[value.validation_status]}</td>

                                                <td class=" last">
                                                    <div class="btn-toolbar" role="toolbar"
                                                         aria-label="Toolbar with button groups">
                                                        <div class="btn-group mr-2" role="group"
                                                             aria-label="First group">


                                                            <div style={{padding: 5}}><A href="#" type="button"
                                                                                         onClick={event => navigate('/' + value.mig_id  + '/'+ value.mig_type + '/viewdetails')}>
                                                                <a href="#" data-toggle="tooltip" data-placement="left"
                                                                   title="View Details"><i
                                                                    className="fa fa-info-circle fa-lg"></i></a></A>
                                                            </div>

                                                            <div style={{padding: 5}}><A
                                                                href={"/" + value.mig_id + "/errors"} type="button">
                                                                <a href="#" data-toggle="tooltip" data-placement="left" title="Migration Logs">
                                                                <i className="fa fa-list fa-lg"></i></a></A></div>


                                                            <div style={{padding: 5}}><A
                                                                href={value.validation_status !== 0?'#':'/'+value.mig_id+'/validation'} type="button">
                                                            <a href="#" data-toggle="tooltip" data-placement="left" title="Validation Summary">
                                                                      <i className="fa fa-check-square-o fa-lg"></i></a></A></div>

                                                            <div style={{padding: 5}}><A
                                                                href={"/userpermission/" + value.mig_id} type="button">
                                                                <a href="#" data-toggle="tooltip" data-placement="left" title="Add Users">
                                                                <i className="fa fa-user-plus fa-lg"></i></a>&nbsp;</A>

                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <div className="col-md-12 col-md-12 modal fade"
                                                     id={"CloneModal-" + index}
                                                     style={{align: 'center', padding: '1000px', maxWidth: '100%'}}>
                                                    <div className="modal-dialog ">
                                                        <div className="modal-content">
                                                            <div className="modal-header">
                                                                <h4 className="modal-title">Add Tables List</h4>
                                                                <button type="button"
                                                                        className="close"
                                                                        data-dismiss="modal">&times;</button>
                                                            </div>

                                                            <div className="modal-body">
                                                                <div className="row">
                                                                    <form id={"form-" + index}
                                                                          onSubmit={event => onSubmitClone(event, value.mig_id, index)}>
                                                                        <div className="item form-group">
                                                                            <label
                                                                                className="col-form-label col-md-4 col-sm-4 label-align"> Name <span
                                                                                className="required">*</span></label>
                                                                            <div className="col-md-9 col-sm-9 ">
                                                                                <input
                                                                                    type="text"
                                                                                    name="migration_name"
                                                                                    required="required"
                                                                                    placeholder="Production to Development"
                                                                                    className="form-control"
                                                                                    aria-required={"true"}/>
                                                                            </div>
                                                                        </div>
                                                                    </form>
                                                                </div>
                                                            </div>
                                                            <div className="modal-footer">
                                                                <button type="button"
                                                                        className="btn btn-danger"
                                                                        data-dismiss="modal">Close
                                                                </button>

                                                                <button type="submit" form={"form-" + index}
                                                                        className="btn btn-primary">Save
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </tr>

                                            <tr className="" style={{display: "None", paddingLeft: '190%'}}
                                                id={"migration-" + index}>
                                                {State.hasOwnProperty(index) ?
                                                    <React.Fragment>
                                                        <table className=" x_content table table-striped jambo_table">
                                                            <thead>
                                                            <tr className="headings ">

                                                                <th className="column-title">Log Name</th>
                                                                <th className="column-title">Start Date</th>
                                                                <th className="column-title">End Date</th>
                                                                <th className="column-title">Status</th>
                                                                <th></th>
                                                            </tr>
                                                            </thead>
                                                            <tbody>
                                                            {State[index].map((log_value) =>
                                                                <tr className="">
                                                                    <td>{log_value.log_name}
                                                                    </td>

                                                                    <td><DateTime datetime={log_value.start_date}/>
                                                                    </td>
                                                                    <td><DateTime datetime={log_value.end_date}/>
                                                                    </td>
                                                                    <td>{MigrationConst[log_value.status_code]}</td>

                                                                    <td><a className="btn btn-link btn-sm"
                                                                           href={"/" + value.mig_id + "/" + log_value.log_id + "/error_detail"}>View
                                                                        Details</a>
                                                                    </td>
                                                                </tr>
                                                            )}
                                                            </tbody>
                                                        </table>
                                                    </React.Fragment> : null}
                                            </tr>

                                        </React.Fragment>
                                    )
                                    }

                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
    }
    else
    {
    return (
    <div className="right_col" role="main" style={{minHeight: 1211}}>
            {State.notifications.map(value =>
                value)}


            <div className>
                <div className="page-title">
                    <div className="title_left">
                        <h3>Dashboard</h3>

                    </div>

                    <div className="pull-right">

                        <a onClick={event => window.location.reload(false)} className="btn btn-app">
                            <i className="fa fa-repeat"></i> Refresh
                        </a>
                    </div>
                    <div className="pull-right">
                        <A href="/migration/configure" className="btn btn-app">
                            <i class="fa fa-plus"></i>Migration Build
                        </A>
                    </div>
                </div>
                <div className="row" style={{display: "inline-block", width: "100%", fontWeight: "bold"}}>
                    <div className="tile_count">
                        <div className="col-md-2 col-sm-4  tile_stats_count">
                            <span className="count_top"><i className="fa fa-cog"></i> In-progress Migrations</span>
                            <div className="count" style={{fontSize: 25}}>{State.counts.migration_count}</div>
                        </div>
                        <div className="col-md-2 col-sm-4  tile_stats_count">
                            <span className="count_top"><i className="fa fa-clock-o"></i> In-progress Tables</span>
                            <div className="count" style={{fontSize: 25}}>{State.counts.table_count}</div>
                        </div>
                        <div className="col-md-2 col-sm-4  tile_stats_count">
                            <span className="count_top"><i className="fa fa-spinner"></i> Pending Table Count</span>
                            <div className="count green" style={{fontSize: 25}}>{State.counts.pending_table_count}</div>
                        </div>
                        <div className="col-md-2 col-sm-4  tile_stats_count">
                            <span className="count_top"><i className="fa fa-tasks"></i> Failed Tables</span>
                            <div className="count green" style={{fontSize: 25}}>{State.counts.failed_table_count}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="clearfix"/>
            <div className="row">
                <div className="col-md-12 col-sm-12 ">
                    <div className="x_panel">
                        <div className="x_content" style={{Width: '100'}}>

                            <div>
                                <table style={{tableLayout: "fixed",}}
                                       class="table table-striped jambo_table">
                                    <thead>
                                    <tr className="headings">

                                        <th></th>
                                        <th class="column-title">Migration Name</th>

                                        <th class="column-title">Source Connection Name</th>
                                        <th class="column-title">Target Connection Name</th>
                                        <th className="column-title">Progress</th>
                                        <th className="column-title">Created Date</th>

                                        <th class="column-title no-link last"><span class="nobr">Action</span>
                                        </th>

                                    </tr>
                                    </thead>
                                    <tbody>
                                     <tr>
                                      <td></td>
                                      <td></td>
                                      <td></td>
                                      <td style={{fontSize:'20'}}><span><b>No Data Available</b></span></td>
                                      <td></td>
                                      <td></td>
                                      <td></td>
                                     </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    </div>

    )
    }
};
export default Home