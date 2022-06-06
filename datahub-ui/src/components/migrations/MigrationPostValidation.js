import Loader from "../utils/Loader";
import React, {useContext, useEffect, useState} from "react";
import {get_migrations, run_validation_api} from "./MigrationService";
import {Notification} from 'react-pnotify';
import {A, navigate, useQueryParams} from 'hookrouter';
import {store} from "../../store";
import DateTime from "../utils/DateTime";
import {MigrationConst} from "../utils/Constants";
import {DATABASE_MIGRATION} from "./util/Constants";


let MigrationPostValidation = (props) => {
    const [globalState, dispatch] = useContext(store);
    const [queryParams, setQueryParams] = useQueryParams();
    const [State, setState] = useState(
        {
            is_loading: false,
            migrations: [],
            notifications: [],
            migration_started: false
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
                        delay={5000}
                        shadow={false}
                        hide={true}
                        nonblock={false}
                        desktop={false}
                        onConfirm
                    />
                ]
            })
        }
        get_migrations(localStorage.getItem("user_token"), JSON.stringify([2, 3, 4]),DATABASE_MIGRATION).then((res) => {
                setState({...State, migrations: res.data, is_loading: false});
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
        }).finally(() => dispatch({type: 'change loading', payload: false}))

    }, []);
    let run_valdation = (event,mig_id) =>{
        dispatch({type: 'change loading', payload: true});
        run_validation_api(mig_id).then(res =>{
            setState({
                ...State, notifications: [...State.notifications,
                    <Notification
                        type='notice'
                        title={'Validation Started'}
                        icon='fas fa-question-circle'
                        delay={5000}
                        shadow={false}
                        hide={true}
                        nonblock={false}
                        desktop={false}
                        onConfirm
                    />
                ]
            })
        }).catch(reason => {
            try {
                reason = reason.response.data;
            }
            catch (e) {
            }
            setState({
                ...State, notifications: [...State.notifications,
                    <Notification
                        type='error'
                        title={'Validation Failed'}
                        icon='fa fa-exclamation'
                        text={reason}
                        delay={5000}
                        shadow={false}
                        hide={true}
                        nonblock={false}
                        desktop={false}
                        onConfirm
                    />
                ]
            })
        }).finally(()=>dispatch({type: 'change loading', payload: false}))
    };
    if(State.migrations.length > 0){
    return (
        <div className="right_col" role="main" style={{minHeight: 1211}}>
            {State.notifications.map(value =>
                value)}


            <div className>
                <Loader loading={false}/>
                <div className="page-title">
                    <div className="title_left">
                        <h3>Post Validation</h3>

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
                            <div className="x_content">

                                <div class="table-responsive">
                                    <table class="table table-striped jambo_table bulk_action">
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
                                        {State.migrations.map((value, index) =>

                                            <tr class="even pointer">
                                                <td class=" ">{index + 1}</td>
                                                <td class=" ">{value.mig_name}</td>
                                                <td class=" "><DateTime datetime={value.created_date}/></td>
                                                <td class=" ">{MigrationConst[value.status_code]}</td>


                                                <td class=" last">
                                                    <div class="btn-toolbar" role="toolbar"
                                                         aria-label="Toolbar with button groups">
                                                        <div class="btn-group mr-2" role="group"
                                                             aria-label="First group">

                                                             <div style={{padding: 5}}><A
                                                                href={"/" + value.mig_id + "/ValidationDetails"}
                                                                type="button">
                                                                <a href="#" data-toggle="tooltip" data-placement="top" title="Configure Validation">
                                                                <i className="fa fa-cogs fa-lg"/></a></A></div>

                                                                  <div style={{padding: 5}}><A href="#" onClick={event => run_valdation(event,value.mig_id)} type="button">
                                                                <a href="#" data-toggle="tooltip" data-placement="top" title="Start Validation">
                                                                <i className="fa fa-play fa-lg"/></a></A></div>

                                                            <div style={{padding: 5}}><A
                                                                href={value.validation_status === 0?'#':'/'+value.mig_id+'/validation'} type="button">
                                                                <a href="#" data-toggle="tooltip" data-placement="left" title="Validation Summary">
                                                                    <i className="fa fa-check-square-o fa-lg"></i></a></A></div>

                                                            <div style={{padding: 5}}><A
                                                                href={"/" + value.mig_id + "/errors"} type="button">
                                                                <a href="#" data-toggle="tooltip" data-placement="top" title="Migration Logs">
                                                                <i className="fa fa-list fa-lg"/></a></A></div>

                                                          <div style={{padding: 5}}><A href="#" type="button"
                                                                                         onClick={event => navigate('/' + value.mig_id + "/" + value.mig_type + '/viewdetails')}>
                                                                <a href="#" data-toggle="tooltip" data-placement="top" title="Validation Mapping">
                                                                <i className="fa fa-info-circle fa-lg"/></a></A></div>

                                                        </div>


                                                    </div>
                                                </td>
                                            </tr>
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
    return(
         <div className="right_col" role="main" style={{minHeight: 1211}}>
            {State.notifications.map(value =>
                value)}


            <div className>
                <Loader loading={false}/>
                <div className="page-title">
                    <div className="title_left">
                        <h3>Post Validation</h3>

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
                            <div className="x_content">

                                <div class="table-responsive">
                                    <table class="table table-striped jambo_table bulk_action">
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
         </div>

    )
    }
};
export default MigrationPostValidation