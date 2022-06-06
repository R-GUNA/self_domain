import React, {useContext, useEffect, useState} from "react";
import {get_migrations, start_migration} from "./MigrationService";
import {Notification} from 'react-pnotify';
import {A, navigate, useQueryParams} from 'hookrouter';
import {store} from "../../store";


let ListMigrations = (props) => {
    const [globalState, dispatch] = useContext(store);
    const [queryParams, setQueryParams] = useQueryParams();
    console.log(queryParams);
    const [State, setState] = useState(
        {
            is_loading: false,
            migrations: [],
            notifications: [],
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
                setState({...State, migrations: res.data});
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
            })
        }).finally(()=>dispatch({type: 'change loading', payload: false}))

    }, []);


    let onClickStartMigration = (event, id, name) => {

        start_migration(id).then(res => {
            if (res.status === 201) {
                get_migrations(localStorage.getItem("user_token")).then((res) => {
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
                            migrations: res.data
                        })
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
                    })
                }).finally(()=>dispatch({type: 'change loading', payload: false}))
            }
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
            });
            dispatch({type: 'change loading', payload: false})
        })
    };


    return (
        <div className="right_col" role="main" style={{minHeight: 1211}}>
            {State.notifications.map(value =>
                value)}


            <div className>
                <div className="page-title">
                    <div className="title_left">
                        <h3>Migrations</h3>

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
                                        {State.migrations.map((value, index) =>

                                            <tr class="even pointer">
                                                <td class=" ">{index + 1}</td>
                                                <td class=" ">{value.mig_name}</td>
                                                <td class=" ">{value.created_date} </td>
                                                <td class=" ">{value.status}</td>


                                                <td class=" last">
                                                    <div class="btn-toolbar" role="toolbar"
                                                         aria-label="Toolbar with button groups">
                                                        <div class="btn-group mr-2" role="group"
                                                             aria-label="First group">
                                                            <div style={{padding: 5}}><A alt="asdad"
                                                                                         href={"/" + value.mig_id + "/dataprofiling"}><i
                                                                className="fa fa-database fa-lg"/></A></div>
                                                            <div style={{padding: 5}}><A href="#"
                                                                                         onClick={event => onClickStartMigration(event, value.mig_id, value.mig_name)}
                                                                                         type="button"><i
                                                                className="fa fa-play fa-lg"></i></A></div>
                                                            <div style={{padding: 5}}><A href={"/validation"}
                                                                                         type="button"><i
                                                                className="fa fa-check-square-o fa-lg"></i></A></div>
                                                            <div style={{padding: 5}}><A
                                                                href={"/userpermission/" + value.mig_id} type="button">
                                                                <i className="fa fa-user-plus fa-lg"></i>&nbsp;</A>
                                                            </div>
                                                            <div style={{padding: 5}}><A href="#" type="button"
                                                                                         onClick={event => navigate('/' + value.mig_id + '/viewdetails')}><i
                                                                className="fa fa-info-circle fa-lg"></i></A></div>
                                                            <div style={{padding: 5}}><A
                                                                href={"/" + value.mig_id + "/errors"} type="button"><i
                                                                className="fa fa-list fa-lg"></i></A></div>

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
};
export default ListMigrations