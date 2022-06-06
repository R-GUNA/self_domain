import React, {useState} from "react";
import {
    EXTERNAL_AWS_TYPE,
    EXTERNAL_AZURE_TYPE,
    EXTERNAL_GCP_TYPE,
    IS_DEF,
    IS_EXT,
    IS_STAGE,
} from "../../utils/Constants";
import {ExtIntForm} from "./ExtIntForm";
import {validate_choose_connection} from "../util/StepValidationUtil";

let ChooseConnection = (props) => {
    let [state, setState] = useState({stage_type: IS_DEF, ext_integration: EXTERNAL_AWS_TYPE,mig_time_window:false});
    let setMigrationName = event => {
        props.setParentState(Object.assign(props.parentState, {name: event.target.value}));

        if (event.target.value !== '') {
            props.setParentState({...props.parentState, name: event.target.value})
        }
    };
    let onSetStage = (event) => {
        props.setParentState({...props.parentState, stage_type: event.target.value});
    };

    let setExtType = (event) => {
        props.setParentState({...props.parentState, ext_integration: event.target.value})
    };

    let onScheduleDate = (event) => {
        props.setParentState({...props.parentState, mig_time_window:event.target.value});
    };

    let onSetConnection = (val, conn) => {
        val = val.target.value;
        props.setParentState({...props.parentState, [conn]: val})
    };

    // handle_validate(props.parentState,props.setParentState,"connection");
       if(props.parentState.curr_step === 1){
    let response = validate_choose_connection(props.parentState);
    if (response === null && props.parentState.alert !== false) {
        props.setParentState({...props.parentState, alert: false, form_error: null});
    } else if (props.parentState.form_error !== response) {
        props.setParentState({...props.parentState, alert: true, form_error: response});
    }}
    return (
        <div id="step-1" className="content" style={{display: 'block'}}>
            <form
                id="demo-form2"
                data-parsley-validate
                className="form-horizontal form-label-left"
                noValidate onSubmit={event => event.preventDefault()}>

                <div className="item form-group" style={{padding: 5}}>
                    <label
                        className="col-form-label col-md-3 col-sm-3 label-align"
                    > Name
                        <span className="required" style={{color: 'red'}}>*</span>
                    </label>

                    <div className="col-md-6 col-sm-6 ">
                        <input
                            type="text"
                            name="migration-name"
                            required="required"
                            placeholder="Production to Development"
                            className="form-control " onChange={setMigrationName}/>
                    </div>
                </div>
                <div className="form-group item" style={{padding: 5}}>
                    <label
                        className="col-form-label col-md-3 col-sm-3 label-align "
                    > Source Database
                        <span className="required" style={{color: 'red'}}>*</span>
                    </label>
                    <div className="col-md-6 col-sm-6">
                        <select className="form-control" onChange={(val) => onSetConnection(val, "source_connection")}
                                name="source-database" placeholder="Choose any">
                            <option value="" disabled selected>Select your option</option>
                            {
                                props.parentState.connections.map(conn => (
                                    <option key={conn.conn_id} value={conn.conn_id}>{conn.conn_name}</option>
                                ))
                            }

                        </select>
                    </div>
                </div>
                <div className="form-group item" style={{padding: 5}}>
                    <label
                        className="col-form-label col-md-3 col-sm-3 label-align"> Target Database
                        <span className="required" style={{color: 'red'}}>*</span>
                    </label>
                    <div className="col-md-6 col-sm-12 ">
                        <select className="form-control" onChange={(val) => onSetConnection(val, "target_connection")}
                                name="target-database" placeholder="Choose any">
                            <option value="" disabled selected>Select your option</option>
                            {

                                props.parentState.connections.map(conn => (

                                    <option key={conn.conn_id} value={conn.conn_id}>{conn.conn_name}</option>
                                ))
                            }
                        </select>
                    </div>
                </div>
                <div className="ln_solid"/>

            </form>
            <div className="row">
                <div className="x_panel">
                    <div className="x_title">
                        <h2>Configuration Changes </h2>
                        <ul className="nav navbar-right panel_toolbox">
                            <li><a href="#" className="collapse-link"><i className="fa fa-chevron-up"/></a>
                            </li>
                        </ul>
                        <div className="clearfix"></div>
                    </div>
                    <div className="x-content" id="db-1">
                        <div className="table">
                            <table className="table table-striped " style={{"tableLayout": "fixed"}}>
                                <thead>
                                <tr>
                                    <th>Rules</th>
                                    <th>Values</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <td >Default value to be replaced when Table name starts with non
                                        varchar value (Ex. "100_Unnamed")
                                    </td>
                                    <td >
                                        <div className="form-group col-sm-12">
                                            <input type="email" className="form-control form-control-sm"
                                                   id="exampleInputEmail1" aria-describedby="emailHelp"
                                                   placeholder="tbl"/></div>
                                    </td>
                                </tr>
                                <tr>
                                    <td >Default value to be replaced when Table column name has
                                        space
                                        (Ex. "Total Amount")
                                    </td>
                                    <td >
                                        <div className="form-group col-sm-12">
                                            <input type="email" className="form-control form-control-sm"
                                                   id="exampleInputEmail1" aria-describedby="emailHelp"
                                                   placeholder="_ is default"/></div>
                                    </td>
                                </tr>
                                <tr >
                                    <td >Default value to be replaced when Table column name has
                                        special
                                        character (Ex. "café")
                                    </td>
                                    <td >
                                        <div className="form-group col-sm-12">
                                            <input type="email" className="form-control form-control-sm"
                                                   id="exampleInputEmail1" aria-describedby="emailHelp"
                                                   placeholder="@@"/></div>
                                    </td>
                                </tr>
                                <tr>

                                    <td >Default file split size</td>
                                    <td >
                                        <div className="form-group col-sm-12">
                                            <input type="email" className="form-control form-control-sm"
                                                   id="exampleInputEmail1" aria-describedby="emailHelp"
                                                   placeholder="Max 100MB"/></div>
                                    </td>
                                </tr>


                                <tr>

                                    <td >Date Format</td>
                                    <td >
                                        <div className="form-group col-sm-12">
                                            <input type="email" className="form-control form-control-sm"
                                                   id="exampleInputEmail1" aria-describedby="emailHelp"
                                                   value={props.parentState.date}
                                                   placeholder=" MM/DD/YYYY"
                                                   onInput={(event) => props.setParentState({...props.parentState, date: event.target.value})}/></div>
                                    </td>
                                </tr>
                                <tr>

                                    <td >Datetime Format</td>
                                    <td >
                                        <div className="form-group col-sm-12">
                                            <input type="email" className="form-control form-control-sm"
                                                   id="exampleInputEmail1" aria-describedby="emailHelp"
                                                   value={props.parentState.datetime}
                                                   placeholder="MM/DD/YYYY HH:mm:ss"
                                                   onInput={(event) => props.setParentState({...props.parentState, datetime: event.target.value})}/></div>
                                    </td>
                                </tr>
                                <tr>

                                    <td >Replace blank value as Null</td>
                                    <td >
                                        <div className="form-group col-sm-12">
                                            <input type="checkbox" className="option-input selected-users"
                                                   id="exampleInputEmail1" aria-describedby="emailHelp"
                                                   value={props.parentState.blank}
                                                   onClick={(event) => props.setParentState({
                                                       ...props.parentState,
                                                       blank: event.target.checked
                                                   })}
                                            /></div>
                                    </td>
                                </tr>

                                </tbody>
                            </table>
                            <table className="table table-striped table-responsive" style={{"tableLayout": "fixed"}}>
                                <tbody>

                                <tr>
                                    <td style={{width: "20%"}}>
                                        <form>

                                            <div className="form-row row">
                                                <div className="form-check form-inline">
                                                    <input defaultChecked className="form-check-input stage-select"
                                                           type="radio"
                                                           name="inlineRadioOptions" onClick={onSetStage}
                                                           value={IS_DEF}/>
                                                    <label>Create Internal Stage </label>
                                                </div>

                                                <div className="form-check form-inline" >
                                                    <input className="form-check-input stage-select" type="radio"
                                                           name="inlineRadioOptions" onClick={onSetStage}
                                                           value={IS_EXT}/>
                                                    <label>Link an External Stage (AWS, Azure, GCP)</label>
                                                </div>
                                                <div className="form-check form-inline">
                                                    <input className="form-check-input stage-select" type="radio"
                                                           name="inlineRadioOptions" onClick={onSetStage}
                                                           id="inlineRadio3" value={IS_STAGE}/>
                                                    <label>Provide an Existing
                                                        Stage (Snowflake)</label>
                                                </div>
                                            </div>
                                            <br/>



                                        <form style={{"padding-left": "20%", border:"none", backgroundColor:"white", margin: "-8px"}}>
                                             {props.parentState.stage_type === IS_EXT ?
                                             <td style={{width:"15%"}}>

                                                <div className="input-group" >
                                                    <div className="form-inline">
                                                       <input defaultChecked
                                                               type="radio"
                                                               name="inlineRadioOptions"
                                                               onClick={setExtType}
                                                               value={EXTERNAL_AWS_TYPE}/>
                                                         <label className="label-align">AWS</label>

                                                        </div>
                                                </div>

                                                <div className="input-group form-inline">
                                                    <div className="form-inline">
                                                        <input type="radio"
                                                               name="inlineRadioOptions"
                                                               onClick={setExtType}
                                                               value={EXTERNAL_GCP_TYPE}/>
                                                        <label >GCP</label>
                                                    </div>
                                                </div>
                                                <div className="input-group form-inline">
                                                    <div className="form-inline">
                                                        <input type="radio"
                                                               name="inlineRadioOptions" onClick={setExtType}
                                                               value={EXTERNAL_AZURE_TYPE}/>
                                                        <label>Azure</label>
                                                    </div>
                                                </div>

                                                </td>:null}
                                        <td style={{width: "100%"}}>
                                        {/*{*/}
                                        {/*    // ExtTypeForms[state.ext_integration]*/}
                                        {/*}*/}
                                        <ExtIntForm stage_type={props.parentState.stage_type}
                                                    ext_int={props.parentState.ext_integration}
                                                    parentState={props.parentState}
                                                    setParentState={props.setParentState}/>
                                                    </td>
                                                      </form>




                                                    </form>

                                                    </td>

                                                    </tr>


                               </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};
export default ChooseConnection









//                                {/* Todo Schedule Window future release*/}
//                                {/*<tr>*/}
//                                {/*    <td>*/}
//
//                                {/*       <form>*/}
//                                {/*          <div className={"row"}>*/}
//                                {/*             <div className="form-check form-check-inline">*/}
//                                {/*                <td>*/}
//                                {/*                   <label>Do you want a Scheduled window?</label>*/}
//                                {/*                </td>*/}
//                                {/*                <td>*/}
//                                {/*                   <div className="form-check form-check-inline">*/}
//                                {/*                      <input className="form-check-input stage-select" type="radio"*/}
//                                {/*                           name="inlineRadioOptions" onClick={onScheduleDate} value={true}>*/}
//                                {/*                      </input>*/}
//                                {/*                      <label>Yes</label>*/}
//                                {/*                   </div>*/}
//                                {/*                </td>*/}
//                                {/*                <td>*/}
//                                {/*                   <div className="form-check form-check-inline">*/}
//                                {/*                      <input defaultChecked className="form-check-input stage-select" type="radio"*/}
//                                {/*                           name="inlineRadioOptions" onClick={onScheduleDate} value={false}>*/}
//                                {/*                      </input>*/}
//                                {/*                      <label>No</label>*/}
//                                {/*                   </div>*/}
//                                {/*                </td>*/}
//                                {/*             </div>*/}
//                                {/*          </div>*/}
//                                {/*       </form>*/}
//                                {/*    </td>*/}
//                                {/*    <br></br>*/}
//                                {/*    <div className="form-group" style={{*/}
//                                {/*            "opacity": props.parentState.mig_time_window === 'false' ? 0 : 1*/}
//
//                                {/*        }}>*/}
//                                {/*        <form>*/}
//                                {/*           <td>*/}
//                                {/*               <label>Scheduled Start Time : </label>*/}
//                                {/*               <input type="time" id="sch_start_time" value={props.parentState.sch_start_time} onInput={(event) => props.setParentState({...props.parentState, sch_start_time: event.target.value})}/>*/}
//                                {/*            </td>*/}
//
//                                {/*           <td>*/}
//                                {/*               <label>Scheduled End Time : </label>*/}
//                                {/*               <input type="time" id="sch_end_time" value={props.parentState.sch_end_time} onInput={(event) => props.setParentState({...props.parentState, sch_end_time: event.target.value})}/>*/}
//                                {/*           </td>*/}
//                                {/*        </form>*/}
//                                {/*    </div>*/}
//                                {/*</tr>*/}
