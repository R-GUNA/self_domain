import React from "react";
import {validate_database_mapping} from "../util/StepValidationUtil";


let DBMapping = (props) => {
    let handleSourceCheckDBMap = (evt, db) => {
        // evt.target.classList.remove("source_checked");
        let source_check_boxes = document.getElementsByClassName("source_checked");
        let target_check_boxes = document.getElementsByClassName("target_check");
        if (evt.target.checked) {
            for (let box of source_check_boxes) {
                if (box !== evt.target) {
                    box.style.opacity = 0;
                }
            }
            for (let target_box of target_check_boxes) {
                target_box.style.opacity = 1;
            }
            props.setdbmappingState({...props.dbmappingState, checked_source: db});
        } else {
            for (let box of source_check_boxes) {
                box.style.opacity = 1;

            }
            for (let target_box of target_check_boxes) {
                target_box.style.opacity = 0;
            }
        }
    };


    let handleTargetCheckDBMap = (evt, db) => {
        if (evt.target.checked) {

            let source_check_boxes = document.getElementsByClassName("source_checked");
            let target_check_boxes = document.getElementsByClassName("target_check");

            for (let box of source_check_boxes) {
                if (box.checked && !box.disabled) {
                    box.disabled = true
                }
                box.style.opacity = 1;
            }

            for (let target_box of target_check_boxes) {
                target_box.style.opacity = 0;
                if (target_box.checked) {
                    target_box.checked = false;
                }
            }
            props.setdbmappingState({
                ...props.dbmappingState,
                mapped_databases: [...props.dbmappingState.mapped_databases, {
                    source_db: props.dbmappingState.checked_source,
                    target_db: db
                }]
            })
        }
    };
    let handleOnDelete = (event, source_db, target_db, index) => {
        let source_in = document.getElementById("source-" + source_db);
        let target_in = document.getElementById("target-" + target_db);
        let newState = props.dbmappingState.mapped_databases;
        newState.splice(index, 1);
        source_in.checked = false;
        source_in.disabled = false;
        target_in.checked = false;
        props.setdbmappingState({...props.dbmappingState, mapped_databases: newState});
        //select all the checkboxes in schema
        let schema_input_elements = window.$("div#" + source_db + "-" + target_db + " input:checkbox:checked");
        for (let input_element of schema_input_elements) {
            input_element.checked = false;
            input_element.disabled = false;
        }
    };
    let response = validate_database_mapping(props.dbmappingState);

    console.log(response);

//    if (response === null && props.dbmappingState.alert !== false) {
//        props.setdbmappingState({...props.dbmappingState, alert: false, form_error: null});
//        }
//     else if (props.dbmappingState.form_error !== response) {
//        props.setdbmappingState({...props.dbmappingState, alert: true, form_error: response});
//    }re
   if(props.dbmappingState.curr_step === 2){
   if(response===null && props.dbmappingState.alert !== false)
   {props.setdbmappingState ({...props.dbmappingState, alert: false, form_error: null});
   }
   else if(response !== props.dbmappingState.form_error)
   {
    props.setdbmappingState({...props.dbmappingState,alert:true,  form_error: response});
   }
    }

    return (

        <div className="col-md-18 col-sm-18 ">
            <div className="row" style={{justifyContent: "space-between"}}>
                <div className="" style={{width: "25%"}}>
                    <table className="table table-striped jambo_table bulk_action" style={{}}>
                        <thead>
                        <tr className="headings">
                            <th>
                                <div className="icheckbox_flat-green " style={{position: 'relative'}}><input
                                    type="checkbox"
                                    id="check-all"
                                    className="option-input"
                                    style={{position: 'absolute', opacity: 0}}/>
                                    <ins className="iCheck-helper"
                                         style={{
                                             position: 'absolute',
                                             top: '0%',
                                             left: '0%',
                                             display: 'block',
                                             width: '100%',
                                             height: '100%',
                                             margin: '0px',
                                             padding: '100px',
                                             background: 'rgb(255, 255, 255)',
                                             border: '0px',
                                             opacity: '0'
                                         }}/>
                                </div>
                            </th>
                            <th className="column-title" style={{display: 'table-cell'}}>Source Databases
                            </th>


                        </tr>
                        </thead>
                        <tbody>
                        {props.dbmappingState.source_databases.map((value, index) =>
                            <tr className="even pointer">
                                <td className="a-center">
                                    <div className="icheckbox_flat-green " style={{position: 'relative'}}>
                                        <input
                                            type="checkbox"
                                            className="option-input source_checked"
                                            key={value.id} data-key={value} id={"source-" + value}
                                            name="table_records"
                                            onClick={event => handleSourceCheckDBMap(event, value)}
                                            style={{position: 'absolute', opacity: 1}}/>
                                        <ins className="iCheck-helper"
                                             style={{
                                                 position: 'absolute',
                                                 top: '0%',
                                                 left: '0%',
                                                 display: 'block',
                                                 width: '100%',
                                                 height: '100%',
                                                 margin: '0px',
                                                 padding: '0px',
                                                 background: 'rgb(255, 255, 255)',
                                                 border: '0px',
                                                 opacity: '0'
                                             }}/>
                                    </div>
                                </td>
                                {value.length > 15 ? <td className=" " data-toggle="tooltip"
                                                         title={value}> {value.substring(0, 15) + '...'}</td> :
                                    <td className=" "> {value}</td>}
                            </tr>)}
                        </tbody>
                    </table>
                </div>


                <div className="overflow-hidden table-bordered"
                     style={{width: "50%", height: "fit-content"}}>
                    <table className="table table-striped jambo_table bulk_action">
                        <thead>
                        <tr className="headings">
                            <th className="column-title" style={{display: 'table-cell', textAlign: 'center'}}>Source
                                Databases
                            </th>
                            <th className="column-title" style={{display: 'table-cell', textAlign: 'center'}}>Target
                                Databases
                            </th>
                            <th className="column-title" style={{display: 'table-cell', textAlign: 'center'}}>Delete
                            </th>

                        </tr>
                        </thead>
                        <tbody>
                        {props.dbmappingState.mapped_databases.map((value, index) =>
                            <tr className="even pointer">
                                <td className=" " key={value.source_db}>{value.source_db}</td>
                                <td className=" " key={value.target_db}>{value.target_db}</td>
                                <td style={{padding: '0px'}}>
                                    <button className="btn btn-sm"
                                            onClick={event => handleOnDelete(event, value.source_db, value.target_db, index)}
                                            style={{paddingleft: '20px', paddingtop: '10px'}}><i
                                        className="fa fa-trash"/></button>
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
                <div className="" style={{width: "25%"}}>
                    <table className="table table-striped jambo_table bulk_action">
                        <thead>
                        <tr className="headings">
                            <th>
                                <div className="icheckbox_flat-green" style={{position: 'relative'}}><input
                                    type="checkbox"
                                    id="check-all"
                                    className="option-input"
                                    style={{position: 'absolute', opacity: 0}}/>
                                    <ins className="iCheck-helper"
                                         style={{
                                             position: 'absolute',
                                             top: '0%',
                                             left: '0%',
                                             display: 'block',
                                             width: '100%',
                                             height: '100%',
                                             margin: '0px',
                                             padding: '0px',
                                             background: 'rgb(255, 255, 255)',
                                             border: '0px',
                                             opacity: '0'
                                         }}/>
                                </div>
                            </th>
                            <th className="column-title" style={{display: 'table-cell'}}>Target Databases
                            </th>

                        </tr>
                        </thead>
                        <tbody>
                        {props.dbmappingState.target_databases.map((value, index) =>
                            <tr className="even pointer">
                                <td className="a-center ">
                                    <div className="icheckbox_flat-green" style={{position: 'relative'}}>
                                        <input
                                            type="checkbox"
                                            key={value.id}
                                            data-key={value} id={"target-" + value}
                                            onClick={event => handleTargetCheckDBMap(event, value)}
                                            className="option-input target_check"
                                            name="table_records"
                                            style={{position: 'absolute', opacity: 1}}/>
                                        <ins className="iCheck-helper"
                                             style={{
                                                 position: 'absolute',
                                                 top: '0%',
                                                 left: '0%',
                                                 display: 'block',
                                                 width: '100%',
                                                 height: '100%',
                                                 margin: '0px',
                                                 padding: '0px',
                                                 background: 'rgb(255, 255, 255)',
                                                 border: '0px',
                                                 opacity: '0'
                                             }}/>
                                    </div>
                                </td>
                                {value.length > 15 ? <td className=" " data-toggle="tooltip"
                                                         title={value}> {value.substring(0, 15) + '...'}</td> :
                                    <td className=" "> {value}</td>}

                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
};

export default DBMapping