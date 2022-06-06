import React, {useContext, useEffect, useState} from "react";
import {get_show_migration} from "../migrations/MigrationService";
import {store} from "../../store";
import {Notification} from "react-pnotify";
import {navigate} from 'hookrouter'
import {
    add_schema_table,
    delete_schema_table,
    get_columns_table,
    get_schema_table,
    save_columns_table, start_column_validation,
    update_profile
} from "./DataProfilingServices";
import Select from "react-select";
import {CircleLoader} from "react-spinners";
import clickDropdown from "../utils/DropDown";

function DataProfiling(props) {
    let cloneDeep = require("lodash.clonedeep");

    const [globalState, dispatch] = useContext(store);
    const override = {
        display: "block",
        margin: "0 auto", color: "#000000",
        BorderColor: "red"
    };
    const [state, setState] = useState({
        notifications: [],
        showBQ: false,
        BQ: "",
        showColExclude: false,
        colExcluded: {},
        form: {},
    });


    useEffect(res => {
        dispatch({type: "change loading", payload: true});
        get_show_migration(props.id).then(res => {
            console.log(res.data);
            setState({...state, migration_details: res.data})
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
    }, []);

    let onClickColumn = (event,mig_id) =>{
        dispatch({type: "change loading", payload: false})
        start_column_validation(mig_id).then(res =>{
            setState({
                ...state, notifications: [...state.notifications, <Notification
                    type='info'
                    title='Column Validation Restarted'
                    //                        text={name}
                    delay={1500}
                    shadow={false}
                    hide={true}
                    nonblock={true}
                    desktop={true}
                />], migration_details: res.data
            })
        }).catch(reason => {
            setState({
                ...state, notifications: [...state.notifications, <Notification
                    type='error'
                    title='error'
                    text="Table Compatibility Check Not Complete"
                    delay={1500}
                    shadow={false}
                    hide={true}
                    nonblock={true}
                    desktop={true}
                />]
            })
        }).finally(()=>dispatch({type: "change loading", payload: false}))

    }
    let onClickColumnModalOpen = (event, id, data,is_column_validated) => {
        if(!is_column_validated){
            setState({
                ...state, notifications: [...state.notifications, <Notification
                    type='error'
                    title='error'
                    text="Table Compatibility Check Not Complete"
                    delay={1500}
                    shadow={false}
                    hide={true}
                    nonblock={true}
                    desktop={true}
                />]
            })
        }
        dispatch({type: "change loading", payload: true});
        data.mig_id = props.id;
        console.log(id);
        get_columns_table(data).then(res => {
                let newState = cloneDeep(state)
                newState[id] = res.data.columns
                newState.colExcluded[id] = res.data.excluded_columns
                setState(newState);
                window.$("#ColumnModal-" + id).modal('show');
            }
        ).catch(reason => {
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
    };
    let onClickTableModalOpen = (event, id, data) => {
        dispatch({type: "change loading", payload: true});
        data.mig_id = props.id;
        get_schema_table(data).then(res => {
                let newState = state;
                newState["schema-" + id] = res.data.tables.filter(value => {
                    return !value.added
                });
                setState(newState);
                window.$("#TableModal-" + id).modal('show');
            }
        ).catch(reason => {
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


    };

    let onAddTable = (event, id, schema_id) => {
        //Close Table Modal
        let indexes = id.split("-");
        window.$("#TableModal" + "-" + indexes[1] + "-" + indexes[2]).modal("hide");

        dispatch({type: "change loading", payload: true});
        let req_data = {
            mig_id: props.id,
            schema_id: schema_id,
            tables: state[id].map(value => {
                return value.table_name
            })
        };
        add_schema_table(req_data).then(res => {
            setState({...state,
                            migration_details: res.data,
                            notifications: [...state.notifications, <Notification
                                type='success'
                                title='Added Tables Successfully'
                                //                        text={name}
                                delay={1500}
                                shadow={false}
                                hide={true}
                                nonblock={true}
                                desktop={true}
                            />]})
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
        }).finally(()=>dispatch({type: "change loading", payload: false}))
    };
    let onDeleteTable = (event, id, table_id) => {

        dispatch({type: "change loading", payload: true});
        let resp_data = {table_id: table_id};
        delete_schema_table(resp_data).then(res => {
            let details = id.split("-");
            details = details.map(value =>{
                return parseInt(value)
            });
            let newState = cloneDeep(state);
            newState.migration_details.mappings[details[0]].schemas[details[1]].tables.splice(details[2], 1);
            newState = {
                ...newState, notifications: [...state.notifications, <Notification
                    type='success'
                    title='Deleted Successfully'
                    //                        text={name}
                    delay={1500}
                    shadow={false}
                    hide={true}
                    nonblock={true}
                    desktop={true}
                />],

            };
            setState(newState);
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
        }).finally(()=>dispatch({type: "change loading", payload: false}));
        window.$("#ColumnModal-" + id).modal('hide');
    };


    let onChangeTableName = (event, table_id) => {
        let newState = cloneDeep(state);
        if (!state.form.hasOwnProperty(table_id)) {
            newState.form[table_id] = {}
        }
        newState.form[table_id].new_table = event.target.value;
        setState(newState)
    };

    let onChangeQuery = (event, table_id) => {
        let newState = cloneDeep(state);
        if (!state.form.hasOwnProperty(table_id)) {
            newState.form[table_id] = {}
        }
        newState.form[table_id].query = event.target.value;
        setState(newState)
    };


    let onSubmitColExclude = (event, id, table_id) => {
        let excluded = [];
        let included = [];
        let input_check = window.$("#ColumnModal-" + id + " input[type=checkbox]");
        for (let check of input_check) {
            let value = check.getAttribute("name");
            if (!window.$(check).is(":checked")) {
                excluded.push(value)
            } else {
                included.push(value)
            }
        }
        let newState = cloneDeep(state);
        newState.colExcluded[id] = excluded;
        let data = {
            table_id: table_id,
            included: included,
            excluded: excluded
        };
        save_columns_table(data).then(res => {
            setState(newState);
            window.$("#ColumnModal-" + id).modal('hide');
            setState({
                ...state, notifications: [...state.notifications, <Notification
                    type='success'
                    title='Saved Successfully'
                    //                        text={name}
                    delay={1500}
                    shadow={false}
                    hide={true}
                    nonblock={true}
                    desktop={true}
                />],

            })
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
        });
        window.$("#ColumnModal-" + id).modal('hide')
    };


    let submitForm = (event, id, data) => {


        let requestData = {
            tables: []
        };


        for (let key of Object.keys(state.form)) {
            requestData.tables.push({
                table_id: key,
                query: state.form[key].query,
                new_table: state.form[key].new_table
            })
        }
        requestData.mig_id = props.id;
        update_profile(requestData).then(res => {
            setState({
                ...state, notifications: [...state.notifications, <Notification
                    type='success'
                    title='Saved Successfully'

                    delay={1500}
                    shadow={false}
                    hide={true}
                    nonblock={true}
                    desktop={true}
                />],


            });
            navigate("/migration/status")

        }).catch(reason => {
            console.log(reason);
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
        });


        window.$("#ColumnModal-" + id).modal('hide')
    };


    const go = () => {
        window.history.back();
    };


    if (state.hasOwnProperty("migration_details")) {
        return (
            <div class="right_col" role="main" style={{'minHeight': 1047, 'overflow': 'hidden'}}>
                {state.notifications.map(value =>
                    value)}
                <div class="col-md-12">
                    <div className="pull-right">
                        <button href="" className="btn btn-app" onClick={go}>
                            <i class="fa fa-arrow-left"></i>Back
                        </button>
                        <a onClick={event => window.location.reload(false)} className="btn btn-app">
                            <i className="fa fa-repeat"></i> Refresh
                        </a>
                        <a onClick={event => onClickColumn(event,props.id)} className="btn btn-app">
                            <i className="fa fa-refresh"></i> ReValidate
                        </a>
                    </div>
                    <div class="x_panel">
                        <div class="x_title">
                            <h2><b>Data Profiling </b> - {state.migration_details.mig_name}<small>(Sql -
                                Snowflake)</small></h2>
                            <ul class="nav navbar-right panel_toolbox">
                                <li>
                                </li>
                                <li style={{paddingRight: 10}}>{state.migration_details.mapped_tables_count > 0 ? "Compatibility Check Inprogress:" + state.migration_details.mapped_tables_count : "Compatibility Check Completed"}</li>
                                <li></li>
                                <li><CircleLoader css={override} size={25} loading={state.migration_details.mapped_tables_count > 0}/>
                                </li>
                                <li class="dropdown">
                                </li>
                                <li>
                                </li>
                                <li><a class="collapse-link" onClick={event=>clickDropdown(event,"dataprofiling-"+props.id)}><i
                                                                class="fa fa-chevron-up"></i></a>
                                                            </li>
                            </ul>
                            <div class="clearfix"></div>
                        </div>
                        <div id = {"dataprofiling-"+props.id}class="x_content" style={{display: 'block'}}>
                            <section class="content invoice">
                                {state.migration_details.mappings.map((db_map, db_index) => {
                                    return (
                                        <div>{db_map.schemas.map((schema_map, schema_index) =>
                                            <div key={schema_map.schema_id} class="row">
                                                <div class="x_panel">
                                                    <div class="x_title">
                                                        <h2>{db_map.source} | {schema_map.source} <small>(Tables
                                                            list)</small></h2>
                                                        <ul class="nav navbar-right panel_toolbox">

                                                            <li onClick={event => onClickTableModalOpen(event, db_index + "-" + schema_index, {
                                                                database: db_map.source,
                                                                schema_id: schema_map.schema_id
                                                            })}>
                                                                <a href="#" className="collapse-link"><i
                                                                    className="btn btn-primary fa fa-plus ">Add
                                                                    Tables</i></a>
                                                            </li>
                                                            <div className="modal fade"
                                                                 id={"TableModal-" + db_index + "-" + schema_index}>
                                                                <div className="modal-dialog modal-md">
                                                                    <div className="modal-content">
                                                                        <div className="modal-header">
                                                                            <h4 className="modal-title">Add Tables
                                                                                List</h4>
                                                                            <button type="button"
                                                                                    className="close"
                                                                                    data-dismiss="modal">&times;</button>
                                                                        </div>

                                                                        <div className="modal-body">
                                                                            <div className="row">
                                                                                <div style={{width: "80%"}}>
                                                                                    <Select
                                                                                        id={"select-" + db_index + "-" + schema_index}
                                                                                        isMulti={true}
                                                                                        options={state["schema-" + db_index + "-" + schema_index]}
                                                                                        getOptionValue={option => option.table_name}
                                                                                        getOptionLabel={option => option.table_name}
                                                                                        onChange={value => setState({
                                                                                            ...state,
                                                                                            ["select-" + db_index + "-" + schema_index]: value
                                                                                        })}/>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="modal-footer">
                                                                            <button type="button"
                                                                                    className="btn btn-danger"
                                                                                    data-dismiss="modal">Close
                                                                            </button>

                                                                            <button type="button"
                                                                                    className="btn btn-primary"
                                                                                    onClick={event => onAddTable(event, "select-" + db_index + "-" + schema_index, schema_map.schema_id)}>Submit
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </ul>
                                                        <div class="clearfix"></div>
                                                    </div>
                                                    <div class="x-content" id="db-1">
                                                        <div class="table">
                                                            <table class="table table-striped">
                                                                <thead>
                                                                <tr>
                                                                    <th></th>

                                                                    <th>Source Table Name</th>
                                                                    <th>Compatible with Target</th>
                                                                    <th>Target Table Name</th>

                                                                    <th>Business Query/Rule</th>
                                                                    <th>Description</th>
                                                                    <th></th>
                                                                    <th></th>
                                                                </tr>
                                                                </thead>
                                                                <tbody>
                                                                {schema_map.tables.map((table, table_index) =>
                                                                    <tr>
                                                                        <td>{table_index + 1}</td>
                                                                        <td>{table.table}</td>
                                                                        {table.is_compatible ? <td>Yes</td> :
                                                                            <td>No</td>}
                                                                        <td><input defaultValue={table.table}
                                                                                   onChange={event => onChangeTableName(event, table.table_id)}/>
                                                                        </td>
                                                                        <td><textarea required="required" name="BQ"
                                                                                      class="form-control"
                                                                                      onChange={event => onChangeQuery(event, table.table_id)}/>
                                                                        </td>
                                                                        <td style={{width: "15%"}}>{table.comp_desc}</td>
                                                                        <td><a style={{cursor: "pointer"}}
                                                                               onClick={event =>
                                                                                   onClickColumnModalOpen(event, db_index + "-" + schema_index + "-" + table_index,
                                                                                       {
                                                                                           database_name: db_map.source,
                                                                                           schema_name: schema_map.source,
                                                                                           source_table: table.table,
                                                                                           table_id:table.table_id
                                                                                       },
                                                                                       table.is_column_validation_complete
                                                                                       )}
                                                                        ><i class="fa fa-columns fa-2x"
                                                                            aria-hidden="true" data-toggle="tooltip"
                                                                            data-placement="top"
                                                                            title="Exclude Columns"/></a></td>
                                                                        <div className="group">
                                                                            <div className="modal fade"
                                                                                 id={"ColumnModal-" + db_index + "-" + schema_index + "-" + table_index}>
                                                                                <div className="modal-dialog modal-lg">
                                                                                    <div className="modal-content">
                                                                                        <div className="modal-header">
                                                                                            <h4 className="modal-title">Columns
                                                                                                List</h4>
                                                                                            <td></td>

                                                                                            <button type="button"
                                                                                                    className="close"
                                                                                                    data-dismiss="modal">&times;</button>
                                                                                        </div>

                                                                                        <div className="modal-body">
                                                                                            <div className="row">
                                                                                                <div
                                                                                                    style={{width: "80%"}}>
                                                                                                    <table
                                                                                                        className="table table-striped jambo_table bulk_action">
                                                                                                        <thead>
                                                                                                        <tr className="heading">
                                                                                                            <th></th>
                                                                                                            <th>Column</th>
                                                                                                            <th>Datatype</th>
                                                                                                        </tr>
                                                                                                        </thead>
                                                                                                        <tbody>
                                                                                                        {state.hasOwnProperty(db_index + "-" + schema_index + "-" + table_index) ?
                                                                                                            state[db_index + "-" + schema_index + "-" + table_index].map((value, index) =>
                                                                                                                <tr>
                                                                                                                    <td>
                                                                                                                    <div className="icheckbox_flat-green" style={{position: "relative"}}>
                                                                                                                        <input
                                                                                                                            type="checkbox"
                                                                                                                            className="option-input select-users"
                                                                                                                            key={index}
                                                                                                                            name={value.column}
                                                                                                                            style={{
                                                                                                                                position: 'absolute',
                                                                                                                                opacity: 1
                                                                                                                            }}
                                                                                                                            defaultChecked={state.colExcluded.hasOwnProperty(db_index + "-" + schema_index + "-" + table_index) && (state.colExcluded[db_index + "-" + schema_index + "-" + table_index].indexOf(value.column) > -1) ? false : true}
                                                                                                                        />
                                                                                                                        </div>
                                                                                                                    </td>
                                                                                                                    <td>{state.colExcluded.hasOwnProperty(db_index + "-" + schema_index + "-" + table_index) && (state.colExcluded[db_index + "-" + schema_index + "-" + table_index].indexOf(value.column) > -1) ?
                                                                                                                        <strike>{value.column}</strike> : value.column}</td>
                                                                                                                    <td>{value.datatype}</td>
                                                                                                                </tr>
                                                                                                            )
                                                                                                            : null}
                                                                                                        </tbody>
                                                                                                    </table>
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="row">
                                                                                                <button
                                                                                                    className="btn btn-primary"
                                                                                                    onClick={event => onSubmitColExclude(event, db_index + "-" + schema_index + "-" + table_index, table.table_id)}> Save
                                                                                                </button>
                                                                                                <button type="button"
                                                                                                        className="btn btn-danger"
                                                                                                        data-dismiss="modal">Close
                                                                                                </button>
                                                                                            </div>

                                                                                        </div>
                                                                                        <div className="modal-footer">


                                                                                        </div>

                                                                                    </div>
                                                                                </div>
                                                                            </div>

                                                                        </div>
                                                                        <td><a style={{cursor: "pointer"}}
                                                                               className="fa fa-trash fa-2x"
                                                                               data-toggle="tooltip"
                                                                               data-placement="top" title="Delete"
                                                                               onClick={event => onDeleteTable(event, db_index + "-" + schema_index + "-" + table_index, table.table_id)}/>
                                                                        </td>
                                                                    </tr>
                                                                )}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}</div>)
                                })}

                                <div class="row">
                                    <div class="">

                                        <button class="btn btn-primary" onClick={event => submitForm(event)}
                                                style={{'margin-right': 5}}>Save
                                        </button>
                                    </div>
                                </div>

                            </section>
                        </div>
                    </div>
                </div>
            </div>
        );
        } else  {
            return (<div className="right_col" role="main" style={{'minHeight': 1047, 'overflow': 'hidden',fontSize:'large'}}></div>);
        }
}

export default DataProfiling;