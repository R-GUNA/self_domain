import React, {useContext, useEffect, useState} from "react";
import ChooseConnection from "./forms/ChooseConnection";
import {Notification} from "react-pnotify";
import TableMapping from "./forms/TableMapping";
import {check_migration, create_migration, get_connections, get_databases} from "./MigrationService";
import FinalPreview from "./forms/FinalPreview";
import {navigate} from "hookrouter";
import Mapping from "./forms/Mapping";
import {store} from "../../store";
import {DATABASE_MIGRATION, EXTERNAL_AWS_TYPE, IS_DEF, IS_EXT, IS_STAGE,} from "../utils/Constants";
import {submit_stage_ext} from "./util/Constants";


let CreateMigration = (props) => {
    const [globalState, dispatch] = useContext(store);
    let [state, setState] = useState({
        name: "",
        source_connection: "",
        target_connection: "",
        is_loading: false,
        connections: [],
        steps_count: 4,
        curr_step: 1,
        mapped_databases: [],
        source_databases: [],
        target_databases: [],
        checked_source: "",
        schema_mapping: [],
        checked_source_schema: {},
        mapped_schema: {},
        tables_data: [],
        selected_tables: [],
        alert: true,
        form_error: "No Migration Name",
        mig_type: DATABASE_MIGRATION,
        notifications: [],
        stage_type: IS_DEF,
        ext_integration: EXTERNAL_AWS_TYPE,
        is_gcp_encrypt: "false",

        mig_time_window: 'false',
        sch_start_time: null,
        sch_end_time: null,

        blank :false,
        date :"",
        datetime:""

    });

    let next_ele = window.$("#step-button");
    next_ele.disabled = true;

    useEffect(() => {
        dispatch({type: 'change loading', payload: true});
        get_connections().then(res => {
                let connections = res.data;
                setState({...state, connections: connections});
                dispatch({type: 'change loading', payload: false});
            }
        );
    }, []);


    // Schema Mapping Function


    let nextNavigate = evt => {
        let active_anchor = document.getElementById("a-step-" + state.curr_step);
        let active_div = document.getElementById("step-" + state.curr_step);
        const next_step = state.curr_step + 1;


        if (state.curr_step < state.steps_count) {
            active_anchor.classList.remove("selected");
            active_anchor.classList.add("disabled");
            active_div.style.display = "none";
            let dis_anchor = document.getElementById("a-step-" + next_step);
            let dis_div = document.getElementById("step-" + next_step);

            dis_anchor.classList.remove("disabled");
            dis_anchor.classList.add("selected");
            dis_div.style.display = "block";

        }
        setState({...state, curr_step: next_step})

//        document.getElementById("a-step-" + next_step).focus();

    };

    let prevNavigate = evt => {
        let active_anchor = document.getElementById("a-step-" + state.curr_step);
        let active_div = document.getElementById("step-" + state.curr_step);

        if (state.curr_step > 1) {
            active_anchor.classList.remove("selected");
            active_anchor.classList.add("disabled");
            active_div.style.display = "none";
            let prev_step = state.curr_step - 1;
            let dis_anchor = document.getElementById("a-step-" + prev_step);
            let dis_div = document.getElementById("step-" + prev_step);

            dis_anchor.classList.remove("disabled");
            dis_anchor.classList.add("selected");
            dis_div.style.display = "block";

            setState({...state, curr_step: prev_step})

        }
    };

    //DB Mapping Connection

    let conn_form_handle = event => {
        dispatch({type: 'change loading', payload: true});

        let db_source = document.getElementsByName("source-database")[0];
        db_source = db_source.options[db_source.selectedIndex].value;
        let db_target = document.getElementsByName("target-database")[0];
        db_target = db_target.options[db_target.selectedIndex].value;
        check_migration(state.name).then(res =>{
            if(!res.data){
                get_databases({source_id: db_source, target_id: db_target}).then(res => {
                    console.log(res.data);
                    setState(Object.assign(state,
                        {
                            source_connection:
                            db_source, target_connection: db_target, source_databases: res.data.sourcedb,
                            target_databases: res.data.targetdb
                        }));
                    nextNavigate(event);
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
                }).finally(()=>dispatch({type: 'change loading', payload: false}));
            }
            else {
                setState({
                    ...state, notifications: [...state.notifications, <Notification
                        type='error'
                        title='error'
                        text="Migration Name Already Exists"
                        delay={1500}
                        shadow={false}
                        hide={true}
                        nonblock={true}
                        desktop={true}
                    />]
                })
                dispatch({type: 'change loading', payload: false});
            }
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
            dispatch({type: 'change loading', payload: false});
        });
    };

    let handle_stage_submit = (requestData) => {
        if (state.stage_type === IS_EXT) {
            requestData = submit_stage_ext[state.ext_integration](requestData, state)
        }
        return requestData
    };

    let handle_schedule_window = (requestData) => {
        if(state.mig_time_window === 'true')
        {
          requestData.sch_start_time = state.sch_start_time;
          requestData.sch_end_time = state.sch_end_time;
        }
        return requestData
    };


    let createMigration = event => {
        dispatch({type: 'change loading', payload: true});
        let requestData = {
            "mig_name": state.name,
            "mig_type": state.mig_type,
            "source_id": state.source_connection,
            "target_id": state.target_connection,
            "mappings": state.selected_tables,
            "blank__null":state.blank,
            "date_fmt":state.date,
            "datetime_fmt":state.datetime
        };
        // save external integration
        requestData.stage_type = state.stage_type;
        if (state.stage_type === IS_EXT) {
            requestData.ext_integration = state.ext_integration;
            requestData = handle_stage_submit(requestData);
        }
        if (state.stage_type === IS_STAGE) {
            requestData.stage_name = state.stage_name;
            requestData.stage_schema = state.stage_schema;
            requestData.stage_db = state.stage_db;
        }


        requestData.mig_time_window =state.mig_time_window;
        if(state.mig_time_window === 'true') {

           requestData = handle_schedule_window(requestData);
        }

        create_migration(requestData).then((res) => {
            console.log(res);
            navigate("/" + res.data.mig_id + '/dataprofiling')
        }).catch(reason => {
            console.log(reason);
            setState({
                ...state,notifications: [...state.notifications, <Notification
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
    };

    const function_caller = {
        1: conn_form_handle,
        2: (event) => {
            nextNavigate(event)
        },
        3: (event) => {
            nextNavigate(event)
        },
        4: createMigration
    };

    console.log(state.curr_step);
    return (
        <div className="right_col" role="main" style={{minHeight: 1211}}>
            {state.notifications.map(value => value)}
            <div className>
                <div className="page-title">
                    <div className="title_left">
                        <h3>Configure Migration</h3>


                    </div>
                    {state.curr_step === 1 ? null :
                    <React.Fragment>
                    <div className="pull-right">

                        <button onClick={event => window.location.reload(false)} class="btn btn-danger">
                         Cancel</button>
                         </div>
                    </React.Fragment>
                    }

                </div>


                <div className="clearfix"/>
                <div className="row">
                    <div className="col-md-12 col-sm-12 ">
                        <div className="x_panel">
                            <div className="x_content">
                                {/* Smart Wizard */}
                                <div id="wizard" className="form_wizard wizard_horizontal">
                                    <ul className="wizard_steps anchor">
                                        <li>
                                            <a href="#step-1" id="a-step-1" className="selected" isdone={1} rel={1}>
                                                <span className="step_no">1</span>
                                                <span className="step_descr">
                      Select Connection<br/>
                                                    {/*<small>Step 1 description</small>*/}
                    </span>
                                            </a>
                                        </li>
                                        <li>
                                            <a href="#step-2" id="a-step-2" className="disabled" isdone={0} rel={2}>
                                                <span className="step_no">2</span>
                                                <span className="step_descr">Mapping<br/>
                                                    {/*<small>Step 2 description</small>*/}
                                                </span></a></li>
                                        <li>
                                            <a href="#step-3" id="a-step-3" className="disabled" isdone={0} rel={4}>
                                                <span className="step_no">3</span>
                                                <span className="step_descr">
                      Select Tables<br/>
                                                    {/*<small>Step 4 description</small>*/}
                    </span>
                                            </a>
                                        </li>
                                        <li>
                                            <a href="#step-4" id="a-step-4" className="disabled" isdone={0} rel={4}>
                                                <span className="step_no">4</span>
                                                <span className="step_descr">
                      Final Preview<br/>
                                                    {/*<small>Step 4 description</small>*/}
                    </span>
                                            </a>
                                        </li>
                                    </ul>

                                    <div className="stepContainer" style={{height: "inherit"}}>

                                        <ChooseConnection parentState={state} setParentState={setState}/>
                                        <Mapping dbmappingState={state} setdbmappingState={setState}
                                                 prevNavigate={prevNavigate} nextNavigate={nextNavigate}/>
                                        <TableMapping dbmappingState={state} setDBmappingState={setState}/>
                                        <FinalPreview dbmappingState={state} setDBmappingState={setState}/>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {state.curr_step !== 2 ?
                <div className="actionBar">
                    {state.curr_step === 1 ? null :
                        <React.Fragment>
                            <div className="msgBox">
                                <div className="content"/>
                            </div>
                            <button onClick={prevNavigate} id="step-prev-button"
                                    className="buttonPrevious btn btn-primary">Previous
                            </button>


                        </React.Fragment>
                    }
                    {state.curr_step === state.steps_count
                        ? <span data-toggle="tooltip" title={state.form_error}><button id="step-button"
                                                                                       className="buttonNext btn btn-success"
                                                                                       onClick={event => function_caller[state.curr_step](event)}
                                                                                       disabled={state.alert}>Submit</button></span>
                        : <span data-toggle="tooltip" id="tooltip" title={state.form_error} tabIndex="0"><button
                            id="step-button"
                            className="buttonNext btn btn-success"
                            onClick={event => function_caller[state.curr_step](event)}
                            disabled={state.alert}>Next</button></span>
                    }
                </div> : null}
        </div>
    )
};
export default CreateMigration;
