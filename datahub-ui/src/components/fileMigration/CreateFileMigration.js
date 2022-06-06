import React, {useContext, useEffect, useState} from "react";
import {store} from "../../store";
import {get_connections} from "../migrations/MigrationService";
import {create_migration, get_target_database, get_target_schema, get_target_tables} from "./FileMigrationService";
import {Notification} from "react-pnotify";
import Select from "react-select";
import {EXTERNAL_AWS_TYPE, EXTERNAL_AZURE_TYPE, EXTERNAL_GCP_TYPE, FILE_MIGRATION, IS_EXT} from "../utils/Constants";
import {navigate} from "hookrouter";
import {ExtIntForm} from "../migrations/forms/ExtIntForm";
import {submit_stage_ext} from "../migrations/util/Constants";
import {validate_choose_connection} from "../migrations/util/StepValidationUtil";

const validate_table = (node, parent = null, depth = 0) => {
    // Validate database , schema and table recursively
    let local_depth = depth;
    if (node.constructor === Object) {
        let node_keys = Object.keys(node);
        if (node_keys.length < 1) {
            //if node has no keys then it will return error for no data selected
            let error_str = ""
            if (parent) {
                error_str += parent;
            }
            if (depth === 0) {
                error_str += `No database selected`;
            } else if (depth === 1) {
                error_str += " database "
                error_str += "has no schemas"
            }
            return error_str;
        } else {
            // Validate db, schema , table recursively
            for (let key of Object.keys(node)) {
                let return_str = validate_table(node[key], parent = key, depth = local_depth + 1)
                if (return_str !== true) {
                    return return_str;
                }
            }
            return true
        }
    } else if (node.constructor === Array) {
        //Check tables array
        if (node.length > 0) {
            return true;
        } else {
            return `${parent} schema has no tables mapped`;
        }
    }
}

let CreateFileMigration = (props) => {
    const [globalState, dispatch] = useContext(store);
    let cloneDeep = require("lodash.clonedeep");

    let [state, setState] = useState({
        notifications: [],
        target_connections: [],
        target_connection: "",
        mapped: {},
        name: "",
        mig_type: FILE_MIGRATION,
        stage_type: IS_EXT,
        ext_integration: EXTERNAL_AWS_TYPE,
        is_gcp_encrypt: "false",
    });
    useEffect(() => {
        dispatch({type: 'change loading', payload: true});
        get_connections().then(res => {
                let connections = res.data;
                setState({...state, target_connections: connections});
            }
        ).finally(() => dispatch({type: 'change loading', payload: false}));
    }, []);

    let save_migration = (event) => {
        let is_valid = validate_choose_connection(state)
        if (!is_valid) {
            is_valid = validate_table(state.mapped);
            if (is_valid !== true) {
                setState({
                    ...state, notifications: [...state.notifications, <Notification
                        type='error'
                        title='error'
                        text={is_valid}
                        delay={1500}
                        shadow={false}
                        hide={true}
                        nonblock={true}
                        desktop={true}
                    />]
                })
                return
            }
            // Todo table validation
        } else if (is_valid) {
            setState({
                ...state, notifications: [...state.notifications, <Notification
                    type='error'
                    title='error'
                    text={is_valid}
                    delay={1500}
                    shadow={false}
                    hide={true}
                    nonblock={true}
                    desktop={true}
                />]
            })
            return
        }
        let requestData = {
            mig_name: state.name,
            target_id: state.target_connection,
            mappings: state.mapped
        }
        requestData.ext_integration = state.ext_integration;
        requestData = submit_stage_ext[state.ext_integration](requestData, state);
        create_migration(requestData).then(res => {
            navigate("/");
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
        })
    }
    //Todo Expand External Stage Credentials
    let on_select_conn = (event) => {
        let conn_id = window.$('#target-db-select option:selected')[0];
        window.$('#target-db-select').prop('disabled', 'disabled');
        window.$('#setConnection').modal('hide');
        setState({...state, target_connection: conn_id.value});
    };

    let on_add_database = (event) => {
        if (!state.hasOwnProperty("mappings")) {
            dispatch({type: 'change loading', payload: true});
            let newState = cloneDeep(state);
            newState.mappings = {};
            let req_data = {target_id: state.target_connection};

            get_target_database(req_data).then(response => {
                response.data.map((val, index) => {
                    newState.mappings[val] = {};
                });
                setState(newState);
                window.$('#add-database-modal').modal("show");
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
            }).finally(() => dispatch({type: 'change loading', payload: false}))
        } else {
            window.$('#add-database-modal').modal("show");
        }
    };

    let on_add_schema = (event, db) => {
        if (Object.keys(state.mappings[db]).length === 0) {
            dispatch({type: 'change loading', payload: true});
            let req_data = {target_id: state.target_connection, mapped_db: db};
            get_target_schema(req_data).then(response => {
                let newState = cloneDeep(state);
                response.data.map(schema => {
                    newState.mappings[db][schema] = [];
                    window.$('#' + db + "-modal").modal("show");
                });
                setState(newState)
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
            }).finally(() => dispatch({type: 'change loading', payload: false}))
        } else {
            window.$('#' + db + "-modal").modal("show");
        }
    };

    let append_table_form = (db, schema, table_list) => {
        let options = ``;
        table_list.map(value => {
            options += `<option value="${value}">${value}</option>`
        });
        let row_length = window.$(`#${db} #${schema} .table-form`).length;
        let tr = `<tr class="table-form" data-key='{"db":"${db}","schema":"${schema}"}' id="${db}-${schema}-${row_length}">
            <td>-</td>
            <td><input
                type="text"
                name="file-exp"
                required="required"
                placeholder="File Expression"
                class="form-control"/><span style="opacity: 0" data-key="file-exp" class="help-inline">No File Expression Included</span></td>

            <td><div style="width: 85%">
            <select name="table-select" class="form-control">
                <option value="" disabled
                        selected>Select your Table
                </option>
                ${options}
            </select>
            </div>
            <span style="opacity: 0" data-key="table-select" class="help-inline">No table Selected</span>
            </td>
            <td><input
                type="text"
                name="delimiter"
                required="required"
                placeholder="Delimiter"
                class="form-control "/>
                <span style="opacity: 0" data-key="delimiter" class="help-inline">No Delimiter Included</span>
                </td>
            <td><a data-key='{"${db}" : "${schema}"}' id="${db}-${schema}-${row_length}-click" class="fa fa-plus fa-lg"/></td>
        </tr>`;
        window.$("#" + db + "-" + schema + "-table").prepend(tr);
        window.$(`#${db}-${schema}-${row_length}-click`).on('click', on_select_table);

    };

    let on_add_table = (event, db, schema) => {
        if (state.mappings[db][schema].length > 0) {
            append_table_form(db, schema, state.mappings[db][schema]);
        } else {
            dispatch({type: 'change loading', payload: true});
            let req_data = {
                conn_id: state.target_connection,
                schema: schema,
                db: db
            };
            get_target_tables(req_data).then(resp => {
                let newState = cloneDeep(state);
                newState.mappings[db][schema] = resp.data;
                setState(newState);
                append_table_form(db, schema, resp.data);
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
            }).finally(() => dispatch({type: 'change loading', payload: false}));
        }
    };

    let on_select_db = (db_list) => {
        let newState = cloneDeep(state);
        let db_keys = Object.keys(state.mapped);
        db_list.map(value => {
            if (db_keys.indexOf(value) === -1) {
                newState.mapped[value] = {}
            }
        });
        db_keys.map(value => {
            if (db_list.indexOf(value) === -1) {
                delete newState.mapped[value]
            }
        });
        setState(newState);
    };
    let on_select_schema = (schema_list, db) => {
        console.log(schema_list);
        let newState = cloneDeep(state);
        let schema_keys = Object.keys(state.mapped[db]);
        schema_list.map(value => {
            if (schema_keys.indexOf(value) === -1) {
                newState.mapped[db][value] = []
            }
        });
        schema_keys.map(value => {
            if (schema_list.indexOf(value) === -1) {
                delete newState.mapped[db][value]
            }
        });
        setState(newState)
    };

    let validate_select_table = (form_id, data_key, val) => {
        if (val === "") {
            let error_text = window.$(`#${form_id} span[data-key='${data_key}']`);
            console.log(error_text);
            error_text.css("opacity", 1);
            return false
        } else {
            let error_text = window.$(`#${form_id} span[data-key='${data_key}']`);
            console.log(error_text);
            error_text.css("opacity", 0);
            return true
        }
    }

    let on_select_table = (event) => {
        let form_id = event.target.parentNode.parentNode.getAttribute("id");
        let data = JSON.parse(event.target.parentNode.parentNode.getAttribute("data-key"));
        let newState = cloneDeep(state);

        let file_exp = window.$(`#${form_id} input[name='file-exp']`).val();

        if (!validate_select_table(form_id, 'file-exp', file_exp)) {
            return
        }

        let selected_table = window.$(`#${form_id} select[name='table-select'] option:selected`).val();

        if (!validate_select_table(form_id, 'table-select', selected_table)) {
            return
        }

        let delimiter = window.$(`#${form_id} input[name='delimiter']`).val();

        if (!validate_select_table(form_id, 'delimiter', delimiter)) {
            return
        }

        let table_data = {
            file_exp: file_exp,
            selected_table: selected_table,
            delimiter: delimiter
        };
        newState.mapped[data.db][data.schema] = [...newState.mapped[data.db][data.schema], table_data];
        setState(newState);
        window.$(`#${form_id}`).remove();
        // console.log(file_exp)
    };

    return (
        <div className="right_col" role="main" style={{minHeight: 1211}}>
            {state.notifications.map(value => value)}
            <div className>
                <div className="page-title">
                    <div className="title_left">
                        <h3>Configure File Migration</h3>
                    </div>
                </div>
                <div className="clearfix"/>
                <div className="row">
                    <div className="col-md-12 col-sm-12 ">
                        <div className="x_panel">
                            <div className="x_content">
                                <div className="item" style={{padding: 5}}>
                                    <label className="col-form-label col-md-3 col-sm-3 label-align">
                                        Name<span className="required">*</span>
                                    </label>

                                    <div className="col-md-6 col-sm-6 ">
                                        <input
                                            type="text"
                                            name="migration-name"
                                            required="required"
                                            placeholder="Production to Development"
                                            className="form-control "
                                            onChange={(event) => setState({...state, name: event.target.value})}/>
                                    </div>
                                </div>
                                <div className="item" style={{padding: 5}}>
                                    <label
                                        className="col-form-label col-md-3 col-sm-3 label-align ">
                                        External Integration<span className="required">*</span>
                                    </label>
                                    <div className="col-md-6 col-sm-6">
                                        <select className="form-control"
                                                onChange={event => setState({
                                                    ...state,
                                                    ext_integration: event.target.value
                                                })}
                                                name="external-integration" id="ext-int-select">
                                            {/*<option value="" disabled selected>Select external integration</option>*/}
                                            <option selected value={EXTERNAL_AWS_TYPE}>{EXTERNAL_AWS_TYPE}</option>
                                            <option value={EXTERNAL_GCP_TYPE}>{EXTERNAL_GCP_TYPE}</option>
                                            <option value={EXTERNAL_AZURE_TYPE}>{EXTERNAL_AZURE_TYPE}</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="item">

                                    <div className="col-md-3 col-sm-3 clearfix"/>
                                    <div className="col-md-6 col-sm-6">
                                        <ExtIntForm stage_type={IS_EXT} ext_int={state.ext_integration}
                                                    parentState={state}
                                                    setParentState={setState}/>
                                    </div>

                                </div>
                                <div className="item" style={{padding: 5}}>
                                    <label
                                        className="col-form-label col-md-3 col-sm-3 label-align ">
                                        Target Database<span className="required">*</span>
                                    </label>
                                    <div className="col-md-6 col-sm-6">
                                        <select className="form-control"
                                                onChange={(val) => window.$('#setConnection').modal('show')}
                                                name="target-database" id="target-db-select">
                                            <option value="" disabled selected>Select your option</option>
                                            {
                                                state.target_connections.map(conn => (
                                                    <option key={conn.conn_id}
                                                            value={conn.conn_id}>{conn.conn_name}</option>
                                                ))
                                            }

                                        </select>
                                    </div>

                                    <div className="modal fade" id={"setConnection"}
                                         role="dialog">
                                        <div className="modal-dialog">
                                            <div className="modal-content">
                                                <div className="modal-header">
                                                    <h4 className="modal-title"
                                                        style={{textAlign: 'left'}}>Are you
                                                        sure you want to set this connection?</h4>
                                                    <button type="button" className="close"
                                                            data-dismiss="modal">&times;</button>

                                                </div>

                                                <div className="modal-footer">
                                                    <button type="button" onClick={on_select_conn}
                                                            className="btn btn-default">Yes
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

                                <section id="database-mapping" className="content">
                                    {state.hasOwnProperty("mapped") ?
                                        Object.keys(state.mapped).map(db =>
                                            <div className="row" id={db}>
                                                <div className="x_panel">
                                                    <div className="x_title">
                                                        <h2>Database - {db}</h2>
                                                        <ul className="nav navbar-right panel_toolbox">
                                                            <li>
                                                                <button className="btn btn-light btn-outline-primary"
                                                                        onClick={event => on_add_schema(event, db)}><i
                                                                    className="fa fa-plus fa-lg"/> Add/Delete Schema
                                                                </button>
                                                            </li>
                                                        </ul>
                                                        <div className="modal fade"
                                                             id={db + "-modal"}>
                                                            <div className="modal-dialog modal-md">
                                                                <div className="modal-content">
                                                                    <div className="modal-header">
                                                                        <h4 className="modal-title">Add {db} Schema
                                                                            List</h4>
                                                                        <button type="button"
                                                                                className="close"
                                                                                data-dismiss="modal">&times;</button>
                                                                    </div>
                                                                    {/*Add Schema Modal*/}
                                                                    {/*Todo Change Schema*/}
                                                                    <div className="modal-body">
                                                                        <div className="row">
                                                                            <div style={{width: "80%"}}>
                                                                                <Select
                                                                                    id={"select-database"}
                                                                                    isMulti={true}
                                                                                    options={Object.keys(state.mappings[db])}
                                                                                    getOptionValue={option => option}
                                                                                    getOptionLabel={option => option}
                                                                                    onChange={schema_list => on_select_schema(schema_list, db)}
                                                                                    // onChange={value => setState({
                                                                                    //     ...state,
                                                                                    //     ["select-" + db_index + "-" + schema_index]: value})}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="modal-footer">
                                                                        <button type="button"
                                                                                className="btn btn-danger"
                                                                                data-dismiss="modal">Close
                                                                        </button>

                                                                        {/*<button type="button"*/}
                                                                        {/*        className="btn btn-primary"> Submit*/}
                                                                        {/*        /!*onClick={event => onAddTable(event, "select-" + db_index + "-" + schema_index, schema_map.schema_id)}>Submit*!/*/}
                                                                        {/*</button>*/}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="clearfix"></div>
                                                        {/*Schema Starts here */}
                                                        <div className="x-content">
                                                            {Object.keys(state.mapped[db]).map(schema =>
                                                                <div className="row" id={schema}>
                                                                    <div className="x_panel">
                                                                        <div className="x_title">
                                                                            <h2>Schema - {schema}</h2>
                                                                            <ul className="nav navbar-right panel_toolbox">
                                                                                <li>
                                                                                    <button
                                                                                        className="btn btn-light btn-outline-dark"
                                                                                            onClick={event => on_add_table(event, db,schema)}><i
                                                                                        className="fa fa-plus fa-lg"/> Add Table
                                                                                    </button>
                                                                                </li>
                                                                            </ul>
                                                                            <div className="clearfix"></div>
                                                                        </div>
                                                                        <div className="" align="center">
                                                                            <thead>
                                                                            <tr>
                                                                                <th><h4 justify-align="center">Tables
                                                                                    List</h4>
                                                                                </th>
                                                                            </tr>
                                                                            </thead>
                                                                        </div>
                                                                        <div className="x-content" id="db-">
                                                                            <div className="table">
                                                                                <table className="table table-striped">
                                                                                    <thead>
                                                                                    <tr>
                                                                                        <th></th>
                                                                                        <th>Filename Expression</th>
                                                                                        <th>Target table name</th>
                                                                                        <th>Delimeter</th>
                                                                                        <th></th>
                                                                                    </tr>
                                                                                    </thead>
                                                                                    <tbody
                                                                                        id={db + "-" + schema + "-table"}>
                                                                                    {state.mapped[db][schema].map((value, table_index) =>
                                                                                        <tr>
                                                                                            <td>{table_index + 1}</td>
                                                                                            <td>{value.file_exp}</td>
                                                                                            <td>{value.selected_table}</td>
                                                                                            <td>{value.delimiter}</td>
                                                                                        </tr>
                                                                                    )}
                                                                                    </tbody>
                                                                                </table>
                                                                            </div>
                                                                        </div>
                                                                        {/*    Table Comp Here*/}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : null}
                                </section>

                                <div className="item" style={{padding: 5}}>
                                    <div className="col-md-6 col-sm-6">
                                        <button onClick={on_add_database} className="btn btn-light btn-outline-dark"><i
                                            className="fa fa-plus fa-lg"></i> Add/Delete Database
                                        </button>
                                    </div>
                                </div>
                                <div className="modal fade"
                                     id="add-database-modal">
                                    <div className="modal-dialog modal-md">
                                        <div className="modal-content">
                                            <div className="modal-header">
                                                <h4 className="modal-title">Add Database
                                                    List</h4>
                                                <button type="button"
                                                        className="close"
                                                        data-dismiss="modal">&times;</button>
                                            </div>
                                            {/*Add Table Modal*/}
                                            <div className="modal-body">
                                                <div className="row">
                                                    <div style={{width: "80%"}}>
                                                        {state.hasOwnProperty("mappings") ?
                                                            <Select
                                                                id={"select-database"}
                                                                isMulti={true}
                                                                options={Object.keys(state.mappings)}
                                                                getOptionValue={option => option}
                                                                getOptionLabel={option => option}
                                                                onChange={value => on_select_db(value)}
                                                                // onChange={value => setState({
                                                                //     ...state,
                                                                //     ["select-" + db_index + "-" + schema_index]: value})}
                                                            /> : null}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="modal-footer">
                                                <button type="button"
                                                        className="btn btn-danger"
                                                        data-dismiss="modal">Close
                                                </button>

                                                {/*<button type="button"*/}
                                                {/*        className="btn btn-primary"> Submit*/}
                                                {/*        /!*onClick={event => onAddTable(event, "select-" + db_index + "-" + schema_index, schema_map.schema_id)}>Submit*!/*/}
                                                {/*</button>*/}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="actionBar">
                                    <button id="step-prev-button"
                                            className="buttonPrevious btn btn-danger">Cancel
                                    </button>
                                    <span data-toggle="tooltip" title={state.form_error}>
                                                    <button id="submit-button" onClick={save_migration}
                                                            className="buttonNext btn btn-success">Submit</button>
                                                </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>)
};

export default CreateFileMigration;
