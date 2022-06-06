import Loader from "../utils/Loader";
import React, {useCallback, useContext, useEffect, useState} from "react";
import {get_migrations, start_migration} from "./MigrationService";
import {run_file_migration} from "../fileMigration/FileMigrationService"
import {Notification} from 'react-pnotify';
import {A, navigate, useQueryParams} from 'hookrouter';
import {store} from "../../store";
import DateTime from "../utils/DateTime";
import {clickTableDropdown} from "../utils/DropDown";
import {MigrationLogs} from "../home/HomeServices";
import {ClipLoader} from "react-spinners";
import {DATABASE_MIGRATION, FILE_MIGRATION, MigrationConst} from "../utils/Constants";

const cloneDeep = require("lodash.clonedeep");

let MigrationStatus = (props) => {

    const [, dispatch] = useContext(store);
    const [queryParams,] = useQueryParams();
    function useForceUpdate() {
        const [, setTick] = useState(0);
        const update = useCallback(() => {
            setTick(tick => tick + 1);
        }, [])
        return update;
    }
    const forceUpdate = useForceUpdate()
    const [State, setState] = useState(
        {
            is_loading: false,
            migrations: [],
            notifications: [],
            migration_started: false,
            logs:[]
        }
    );
    useEffect(() => {
        dispatch({type: 'change loading', payload: true});
        if (queryParams.hasOwnProperty("mig_name")) {
            setState({
                ...State, notifications: [...State.notifications,
                    <Notification
                        type='notice'
                        title={props.mig_name + ' Migration Started'}
                        icon='fas fa-question-circle'
                        text={"new"}
                        delay={1500}
                        shadow={false}
                        hide={true}
                        nonblock={true}
                        desktop={true}
                        onConfirm
                    />
                ]
            })
        }
        get_migrations(localStorage.getItem("user_token")).then((res) => {
                console.log(res.data)
                setState({...State, migrations: res.data, is_loading: false});
                console.log(State.migrations)
                dispatch({type: 'change loading', payload: false});
            }
        )

    }, []);

    let dropup = (event, index) => {
        let newState = cloneDeep(State);
        delete newState[index];
        setState(newState);
        console.log(newState);
    };

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




    let onClickStartMigration = (event, id, name,type) => {
        dispatch({type: 'change loading', payload: true});

       if(type===DATABASE_MIGRATION)
       {
        start_migration(id).then(res => {
            if (res.status === 201) {
                let migrations = State.migrations.map(value => {
                    if(value.mig_id === id){
                        value.status_code = 1;
                    }
                    return value
                });
                setState({
                    ...State, notifications: [...State.notifications, <Notification
                        type='success'
                        title='Migration Started'
                        text={name}
                        delay={1500}
                        shadow={false}
                        hide={true}
                        nonblock={true}
                        desktop={true}
                    />],
                    migrations:migrations
                })
            }
        }).catch(reason => {
            try {
                reason = reason.response.data.Error;
            }
            catch (e) {
            }
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
        }).finally(()=>dispatch({type: 'change loading', payload: false}))
       }
       else if(type === FILE_MIGRATION)
       {
        run_file_migration(id).then(
          res =>{
                 if (res.status === 201) {
                let migrations = State.migrations.map(value => {
                    if(value.mig_id === id){
                        value.status_code = 1;
                    }
                    return value
                });
                setState({
                    ...State, notifications: [...State.notifications, <Notification
                        type='success'
                        title='Migration Started'
                        text={name}
                        delay={1500}
                        shadow={false}
                        hide={true}
                        nonblock={true}
                        desktop={true}
                    />],
                    migrations:migrations
                })
            }
        }).catch(reason => {
            try {
                reason = reason.response.data.Error;
            }
            catch (e) {
            }
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
        }).finally(()=>dispatch({type: 'change loading', payload: false}))

       }
    };

    if(State.migrations.length>0){
    return (

        <div className="right_col" role="main" style={{minHeight: 1211}}>
            {State.notifications.map(value =>
                value)}


            <div className>
                <Loader loading={false}/>
                <div className="page-title">
                    <div className="title_left">
                        <h3>Execution & Status</h3>

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
                <div className="clearfix"/>
                <div className="row">
                    <div className="col-md-12 col-sm-12 ">
                        <div className="x_panel">
                            <div className="x_content" style={{Width: '100'}}>

                                <div>
                                    <table style={{tableLayout: "fixed",}}
                                           class="table table-striped jambo_table">
                                        <thead>
                                        <tr class="headings">

                                            <th></th>
                                            <th class="column-title">Migration Name</th>
                                            <th class="column-title">Created Date</th>
                                            <th class="column-title">Status</th>
                                            <th class="column-title no-link last"><span class="nobr">Action</span>
                                            </th>

                                        </tr>
                                        </thead>
                                        <tbody style={{tableLayout: "Responsive"}}>
                                        {State.migrations.map((value, index) =>
                                            <React.Fragment>
                                                <tr class="" style={{padding: 35}} >
                                                   {State.hasOwnProperty(index) ?
                                                       <td style={{paddingLeft: 50}}><a className="fa fa-minus fa-lg"
                                                                                        onClick={event => dropup(event, index)}/>
                                                       </td>:
                                                       <td style={{paddingLeft: 50}}><a className="fa fa-plus fa-lg"
                                                                                        onClick={event => getMigrationLogs(event, value.mig_id, index)}/>
                                                       </td>}

                                                    <td class=" ">{value.mig_name}</td>
                                                    <td class=" "><DateTime datetime={value.created_date}/></td>
                                                    <td className="">{MigrationConst[value.status_code]}
                                                    </td>


                                                    <td class=" last">
                                                        <div class="btn-toolbar" role="toolbar"
                                                             aria-label="Toolbar with button groups">
                                                            <div class="btn-group mr-2" role="group"
                                                                 aria-label="First group">
                                                                <div style={{padding: 5}}>{value.status_code===1?
                                                                    <ClipLoader color={'#4756ff'} size={15}/>
                                                                                        : <A href="#"
                                                                                             onClick={event => onClickStartMigration(event, value.mig_id, value.mig_name,value.mig_type)}
                                                                                             disabled={State.migration_started}
                                                                                             disabled={State.migration_started}
                                                                                             type="button">
                                                                    <a data-toggle="tooltip" data-placement="top" title="Start Migration"><i
                                                                    className="fa fa-play fa-lg"></i></a></A>}</div>

                                                                <div style={{padding: 5}}><A href="#" type="button"
                                                                                             onClick={(event) => navigate('/' + value.mig_id +"/"+ value.mig_type + '/viewdetails')}>
                                                                                              <a href="#" data-toggle="tooltip" data-placement="top" title="Migration Details"><i
                                                                    className="fa fa-info-circle fa-lg"></i></a></A></div>
                                                                <div style={{padding: 5}}><A
                                                                    href={"/" + value.mig_id + "/errors"} type="button">
                                                                    <a href="#" data-toggle="tooltip" data-placement="top" title="Migration Logs"><i
                                                                    className="fa fa-list fa-lg"></i></a></A></div>
                                                            </div>


                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr className="" style={{display: "None", paddingLeft: '150%'}}
                                                    id={"migration-" + index}>
                                                    {State.hasOwnProperty(index) ?
                                                    <React.Fragment>


                                                                <table
                                                                    className="x-content table table-striped jambo_table ">
                                                                   <thead>
                                                                     <tr className="headings">

                                                                        <th className="column-title">Log Name</th>
                                                                        <th className="column-title">Start Date</th>
                                                                        <th className="column-title">End Date</th>
                                                                        <th className="column-title">Status</th>
                                                                        <th className="column-title"></th>
                                                                     </tr>
                                                                   </thead>
                                                                  <tbody>
                                                                    {State[index].map((log_value) =>
                                                                    <tr>
                                                                       <td>{log_value.log_name}</td>
                                                                       <td><DateTime datetime={log_value.start_date}/></td>
                                                                       <td><DateTime datetime={log_value.end_date}/></td>
                                                                       {(log_value.status_code) === 0 &&
                                                                        <td>Created</td> || (log_value.status_code) === 1 &&
                                                                        <td>Started</td>
                                                                        || (log_value.status_code) === 2 &&
                                                                        <td>Failed</td> || (log_value.status_code) === 3 &&
                                                                        <td>Partially Completed</td>
                                                                        || (log_value.status_code) === 4 &&
                                                                        <td>Completed</td>
                                                                       }
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
        </div>
    )
    }

    else
    {
    return (
     <div className="right_col" role="main" style={{minHeight: 1211}}>
            {State.notifications.map(value =>
                value)}


            <div className>
                <Loader loading={false}/>
                <div className="page-title">
                    <div className="title_left">
                        <h3>Execution & Status</h3>

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
                <div className="clearfix"/>
                <div className="row">
                    <div className="col-md-12 col-sm-12 ">
                        <div className="x_panel">
                            <div className="x_content" style={{Width: '100'}}>

                                <div>
                                    <table style={{tableLayout: "fixed",}}
                                           class="table table-striped jambo_table">
                                        <thead>
                                        <tr class="headings">

                                            <th></th>
                                            <th class="column-title">Migration Name</th>
                                            <th class="column-title">Created Date</th>
                                            <th class="column-title">Status</th>
                                            <th class="column-title no-link last"><span class="nobr">Action</span>
                                            </th>

                                        </tr>
                                        </thead>
                                        <tbody>
                                          <tr>
                                            <td></td>
                                            <td></td>
                                            <td style={{fontSize:'20'}}><b>No Data Available</b></td>
                                            <td ></td>
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
     </div>
    )
    }
};
export default MigrationStatus