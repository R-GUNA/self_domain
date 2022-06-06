import React, {useContext, useState} from "react";
import DBMapping from "./DBMapping";
import SMapping from "./SMapping";
import {get_schemas, get_tables} from "../MigrationService";
import {store} from "../../../store";

const cloneDeep = require("lodash.clonedeep");

let Mapping = (props) => {
    const [globalState, dispatch] = useContext(store);
    const [state, setState] = useState({
        steps_count: 2,
        curr_step: 1
    });
    let db_form_handle = event => {
        dispatch({type: 'change loading', payload: true});
        props.setdbmappingState({...props.dbmappingState});
        let data = {mapped_db: props.dbmappingState.mapped_databases};
        data.source_id = props.dbmappingState.source_connection;
        data.target_id = props.dbmappingState.target_connection;
        get_schemas(data).then((res) => {
                let updatedState = {schema_mapping: []};
                for (let db of res.data.db_schemas) {
                    let db_name = Object.keys(db);
                    updatedState = {
                        ...updatedState, schema_mapping: [...updatedState.schema_mapping,
                            {
                                source: {name: db_name[0], schemas: db[db_name[0]]},
                                target: {name: db_name[1], schemas: db[db_name[1]]}
                            }]
                    }
                }
                props.setdbmappingState(Object.assign(props.dbmappingState, updatedState));
                subNextNavigate(event);
            }
        ).finally(() => dispatch({type: 'change loading', payload: false}))
    };

    let schema_form_handle = event => {
        dispatch({type: 'change loading', payload: true});
        props.setdbmappingState({...props.dbmappingState});
        let request_data = {};
        request_data.conn_id = props.dbmappingState.source_connection;
        request_data.schemas = props.dbmappingState.mapped_schema;
        console.log(request_data);
        get_tables(request_data).then(res => {
            console.log(res.data.tables_data);
            let newState = props.dbmappingState;
            newState.tables_data = JSON.parse(res.data).tables_data;
            props.setdbmappingState(newState);
            props.nextNavigate(event);

        }).catch((error) => {
            props.setdbmappingState({...props.dbmappingState});

        }).finally(() => dispatch({type: 'change loading', payload: false}))
    };
    let subPrevNavigate = (event) => {
        let active_anchor = document.getElementById("sub-a-step-" + state.curr_step);
        let active_div = document.getElementById("sub-step-" + state.curr_step);
        if (state.curr_step < 2) {
            props.prevNavigate(event);
            return null;
        }
        const prev_step = state.curr_step - 1;
        active_anchor.classList.remove("selected");
        active_anchor.classList.add("disabled");
        active_div.style.display = "none";
        let dis_anchor = document.getElementById("sub-a-step-" + prev_step);
        let dis_div = document.getElementById("sub-step-" + prev_step);
        dis_anchor.classList.remove("disabled");
        dis_anchor.classList.add("selected");
        dis_div.style.display = "block";
        setState({...state, curr_step: prev_step})


    };
    let subNextNavigate = (event) => {
        let active_anchor = document.getElementById("sub-a-step-" + state.curr_step);
        let active_div = document.getElementById("sub-step-" + state.curr_step);
        const next_step = state.curr_step + 1;

        if (state.curr_step < state.steps_count) {
            active_anchor.classList.remove("selected");
            active_anchor.classList.add("disabled");
            active_div.style.display = "none";
            let dis_anchor = document.getElementById("sub-a-step-" + next_step);
            let dis_div = document.getElementById("sub-step-" + next_step);

            dis_anchor.classList.remove("disabled");
            dis_anchor.classList.add("selected");
            dis_div.style.display = "block";
        }
        setState({...state, curr_step: next_step})
    };

    let sub_steps = {
        1: db_form_handle,
        2: schema_form_handle
    };

    return (
        <div id="step-2" className="content" style={{display: 'none'}}>
            <div className="table-mapping">
                <div id="wizard_verticle" className="form_wizard wizard_verticle" style={{width: "100%"}}>
                    <ul className="list-unstyled wizard_steps">
                        <li>
                            <a href="#" id="sub-a-step-1" className="selected">
                                <span className="step_no">1</span>
                            </a>
                        </li>
                        <li>
                            <a href="#" id="sub-a-step-2" className="disabled">
                                <span className="step_no">2</span>
                            </a>
                        </li>
                    </ul>
                    <div className="stepContainer" style={{display: "block"}}>
                        <div id="sub-step-1" className="content" style={{paddingTop:"2%"}}>
                            <h2 className="StepTitle"><b>Database Mapping</b></h2>
                            <DBMapping dbmappingState={props.dbmappingState}
                                       setdbmappingState={props.setdbmappingState}/>
                        </div>
                        <div id="sub-step-2" className="stepContainer" style={{display: "none", width: "100%", paddingTop:"2%"}}>
                            <h2 className="StepTitle"><b>Schema Mapping</b></h2>
                            <SMapping dbmappingState={props.dbmappingState}
                                      setDBmappingState={props.setdbmappingState}/>
                        </div>
                    </div>
                    <div className="actionBar">
                        <React.Fragment>
                            <div className="msgBox">
                                <div className="content"/>
                            </div>
                            <button onClick={subPrevNavigate} id="step-prev-button"
                                    className="buttonPrevious btn btn-primary">Previous
                            </button>
                        </React.Fragment>

                       {state.curr_step === state.steps_count?<span data-toggle="tooltip" title={props.dbmappingState.form_error}><button id="sub-step-submit"
                                                                                       className="buttonNext btn btn-success"
                                                                                       onClick={event => sub_steps[state.curr_step](event)}
                                                                                       disabled={props.dbmappingState.alert}>Next</button></span>
                        :
                        <span data-toggle="tooltip" id="tooltip" title={props.dbmappingState.form_error} tabIndex="0"><button
                            id="sub-step-submit "
                            className="buttonNext btn btn-success"
                            onClick={event => sub_steps[state.curr_step](event)}
                            disabled={props.dbmappingState.alert}>Next</button></span>}
                    </div>
                </div>
            </div>
        </div>
    )
};

export default Mapping
