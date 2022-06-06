import Loader from "../utils/Loader";
import React, {useContext, useEffect, useState} from "react";
import {get_migrations} from "./MigrationService";
import {A, navigate} from 'hookrouter'
import {store} from "../../store";
import DateTime from "../utils/DateTime";
import {DATABASE_MIGRATION, MigrationTableStatusConstant} from "../utils/Constants";

let MetaDataProfiling = (props) => {
    const [, dispatch] = useContext(store);
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
        get_migrations(localStorage.getItem("user_token"), JSON.stringify([0]),DATABASE_MIGRATION).then((res) => {
                setState({...State, migrations: res.data, is_loading: false});
                dispatch({type: 'change loading', payload: false});
            }
        )

    }, []);

    if(State.migrations.length>0){
    return (
        <div className="right_col" role="main" style={{minHeight: 1211}}>
            {State.notifications.map(value =>
                value)}


            <div className>
                <Loader loading={false}/>
                <div className="page-title">
                    <div className="title_left">
                        <h3>Metadata Validation / Profiling</h3>
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
                                                <td class=" ">{MigrationTableStatusConstant[value.status_code]}</td>


                                                <td class=" last">
                                                    <div class="btn-toolbar" role="toolbar"
                                                         aria-label="Toolbar with button groups">
                                                        <div class="btn-group mr-2" role="group"
                                                             aria-label="First group">
                                                            <div style={{padding: 5}}><A alt="asdad"
                                                                                         href={"/" + value.mig_id + "/dataprofiling"}>
                                                                <a href="#" data-toggle="tooltip" data-placement="top"
                                                                   title="Data Profiling"><i
                                                                    className="fa fa-database fa-lg"/></a></A></div>
                                                            <div style={{padding: 5}}><A
                                                                href={"/userpermission/" + value.mig_id} type="button">
                                                                <a href="#" data-toggle="tooltip" data-placement="top"
                                                                   title="Add User">
                                                                    <i className="fa fa-user-plus fa-lg"></i></a>&nbsp;
                                                            </A>
                                                            </div>
                                                            <div style={{padding: 5}}><A href="#" type="button"
                                                                                         onClick={event => navigate('/' + value.mig_id + '/' + DATABASE_MIGRATION + '/viewdetails')}>
                                                                <a href="#" data-toggle="tooltip" data-placement="top"
                                                                   title="View Details"><i
                                                                    className="fa fa-info-circle fa-lg"></i></a></A>
                                                            </div>
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
    );
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
                        <h3>Metadata Validation / Profiling</h3>
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
                                        <tbody >
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
    );

   }

};
export default MetaDataProfiling