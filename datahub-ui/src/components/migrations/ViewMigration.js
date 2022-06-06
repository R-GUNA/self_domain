import React, {useContext, useEffect, useState} from "react";
import {get_show_migration} from "./MigrationService";
import {store} from "../../store";
import {go} from "../utils/Utils";
import {DATABASE_MIGRATION, FILE_MIGRATION, MigrationTableStatusConstant} from "../utils/Constants";
import DateTime from "../utils/DateTime";
import clickDropdown from "../utils/DropDown";
import {show_file_migration} from "../fileMigration/FileMigrationService";

function ViewMigration(props) {
    console.log(props);
    const [globalState, dispatch] = useContext(store);
    const [state, setState] = useState(null);
    useEffect(res => {
        dispatch({type: 'change loading', payload: true});
        console.log(props);
        if (props.type === 'DB') {
            get_show_migration(props.id).then(res => {
                console.log(res.data);
                setState({migration_details: res.data});
                dispatch({type: 'change loading', payload: false});
            })
        } else {
            show_file_migration(props.id).then(res => {
                setState({migration_details: res.data});
                dispatch({type: 'change loading', payload: false});

            })
        }
    }, []);
    console.log(state)
    if (state) {
        if (state.migration_details.mig_type === DATABASE_MIGRATION) {
            return (
                <div className="right_col" role="main" style={{'min-height': 1047}}>
                    <div className="col-md-12">
                        <div classNameName="pull-right">

                            <button href="" className="btn btn-app pull-right" onClick={go}>
                                <i className="fa fa-arrow-left"></i>Back
                            </button>

                        </div>
                        <div className="x_panel">

                            <div className="x_title">
                                <h2>
                                    <b>Connection </b> - {state.migration_details.source_name} To {state.migration_details.target_name}
                                </h2>
                                <ul className="nav navbar-right panel_toolbox">
                                    <li><a onClick={event => {
                                        clickDropdown(event, "connection-" + props.id)
                                    }} className="collapse-link"><i className="fa fa-chevron-up"/></a>
                                    </li>
                                </ul>
                                <div className="clearfix"></div>
                            </div>
                            <div className="x_content" id={"connection-" + props.id} style={{display: 'block'}}>
                                <section className="content invoice">
                                    {state.migration_details.mappings.map((value, index) =>
                                        <div className="row">
                                            <div className="x_panel">
                                                <div className="x_title">
                                                    <h2>Database - {value.source} To {value.target}</h2>
                                                    <ul className="nav navbar-right panel_toolbox">
                                                        <li><a onClick={event => {
                                                        clickDropdown(event, value.source + "-" + index)
                                                    }} className="collapse-link"><i className="fa fa-chevron-up"/></a>
                                                    </li>
                                                </ul>
                                                <div className="clearfix"></div>
                                            </div>
                                            <div id={value.source + "-" + index} className="x-content">
                                                {value.schemas.map((schema, index1) =>
                                                    <div className="row">
                                                        <div className="x_panel">
                                                            <div className="x_title">

                                                                <h2>Schema - {schema.source} To {schema.target}</h2>
                                                                <ul className="nav navbar-right panel_toolbox">
                                                                    <li><a onClick={event => {
                                                                        clickDropdown(event, "tables-" + schema + index)
                                                                    }} className="collapse-link"><i
                                                                        className="fa fa-chevron-up"/></a>
                                                                    </li>
                                                                </ul>
                                                                <div className="clearfix"></div>
                                                            </div>


                                                            <div className="x-content" id={"tables-" + schema + index}>
                                                                <div className="">
                                                                    <thead>
                                                                    <tr>
                                                                        <th><h4>Table List</h4>
                                                                        </th>
                                                                    </tr>
                                                                    </thead>
                                                                </div>
                                                                <div className="  table">
                                                                    <table className="table table-striped">
                                                                        <thead>
                                                                        <tr>
                                                                            <th></th>
                                                                            <th>Source Table Name</th>
                                                                            <th>Status</th>
                                                                            <th>Start Time</th>
                                                                            <th>End Time</th>
                                                                        </tr>
                                                                        </thead>

                                                                        <tbody>
                                                                        {schema.tables.map((table, table_index) =>
                                                                            <tr>
                                                                                <td>{table_index+1}</td>
                                                                                <td>{table.table}</td>
                                                                                <td>{table.status === "" ? "-" : MigrationTableStatusConstant[table.status]}</td>
                                                                                <td>{table.start === "-" ? <p>-</p> :
                                                                                    <DateTime
                                                                                        datetime={table.start}/>}</td>
                                                                                <td>{table.end === "-" ? <p>-</p> :
                                                                                    <DateTime
                                                                                        datetime={table.end}/>}</td>
                                                                            </tr>
                                                                        )}


                                                                        </tbody>

                                                                    </table>

                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                            </div>
                                        </div>
                                    )}
                                </section>
                            </div>
                        </div>
                    </div>
                </div>
            );
        } else if (props.type === FILE_MIGRATION) {
            return (<div className="right_col" role="main" style={{'min-height': 1047}}>
                    <div className="col-md-12">
                        <div classNameName="pull-right">

                            <button href="" className="btn btn-app pull-right" onClick={go}>
                                <i className="fa fa-arrow-left"></i>Back
                            </button>

                        </div>
                        <div className="x_panel">

                            <div className="x_title">
                                <h2><b>Target Database </b> - {state.migration_details.target_name}
                                </h2>
                                <ul className="nav navbar-right panel_toolbox">
                                    <li><a onClick={event => {
                                        clickDropdown(event, "fl-connection-" + props.id)
                                    }} className="collapse-link"><i className="fa fa-chevron-up"/></a>
                                    </li>
                                </ul>
                                <div className="clearfix"></div>
                            </div>
                            <div className="x_content" id={"fl-connection-" + props.id} style={{display: 'block'}}>
                                <section className="content invoice">
                                    {state.migration_details.mappings.map((value, index) =>
                                        <div className="row">
                                            <div className="x_panel">
                                                <div className="x_title">
                                                    <h2>Database - {value.target}</h2>
                                                    <ul className="nav navbar-right panel_toolbox">
                                                        <li><a onClick={event => {
                                                            clickDropdown(event, value.target + "-" + index)
                                                        }} className="collapse-link"><i
                                                            className="fa fa-chevron-up"/></a>
                                                        </li>
                                                    </ul>
                                                    <div className="clearfix"></div>
                                                </div>
                                                <div id={value.target + "-" + index} className="x-content">
                                                    {value.schemas.map((schema, index1) =>
                                                        <div className="row">
                                                            <div className="x_panel">
                                                                <div className="x_title">

                                                                    <h2>Schema - {schema.target}</h2>
                                                                    <ul className="nav navbar-right panel_toolbox">
                                                                        <li><a onClick={event => {
                                                                            clickDropdown(event, "target_tables-" + schema + index)
                                                                        }} className="collapse-link"><i
                                                                            className="fa fa-chevron-up"/></a>
                                                                        </li>
                                                                    </ul>
                                                                    <div className="clearfix"></div>
                                                                </div>

                                                                <div className="x-content"
                                                                     id={"target_tables-" + schema + index}>
                                                                    <div className="" align="center">
                                                                        <thead>
                                                                        <tr>
                                                                            <th><h4 justify-align="center">Table
                                                                                List</h4></th>
                                                                        </tr>
                                                                        </thead>
                                                                    </div>
                                                                    <div className="table">
                                                                        <table className="table table-striped">
                                                                            <thead>
                                                                            <tr>
                                                                                <th></th>
                                                                                <th>Target Tablename</th>
                                                                                <th>Filename Expression</th>
                                                                                <th>Delimiter</th>

                                                                            </tr>
                                                                            </thead>

                                                                            <tbody>
                                                                            {schema.tables.map((table, table_index) =>
                                                                                <tr>
                                                                                    <td>{table_index + 1}</td>
                                                                                    <td>{table.table}</td>
                                                                                    <td>{table.file_exp}</td>
                                                                                    <td>{table.delimiter}</td>
                                                                                </tr>
                                                                            )}
                                                                            </tbody>
                                                                        </table>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </section>
                            </div>

                        </div>
                    </div>
                </div>
            );
        }
    } else {
        return (<div className="right_col" role="main" style={{'min-height': 1047}}>

               </div>

        )
    }
}

export default ViewMigration;