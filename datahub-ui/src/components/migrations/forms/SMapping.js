import React from "react";
import {validate_schema_mapping} from "../util/StepValidationUtil";

const cloneDeep = require("lodash.clonedeep");

let SMapping = (props) => {
    let clickDropdown = (evt, id) => {
        evt.preventDefault();
        let ele = document.getElementById(id);
        console.log(ele.style.display);
        if (ele.style.display === "none") {
            ele.style.display = "block";
        } else {
            ele.style.display = "none";
        }
    };

    let handleOnDelete = (event, source_database, target_database, index) => {
        let source_check_boxes = document.getElementsByClassName(source_database + "-schema_source_checked");
        let target_check_boxes = document.getElementsByClassName(target_database + "-schema_target_checked");
        let newState = props.dbmappingState.mapped_schema;
        let removed_schema = newState[source_database + " " + target_database].splice(index, 1)[0];
        for (let box of source_check_boxes) {
            if (box.checked && box.disabled && removed_schema.source === box.name) {
                box.disabled = false;
                box.checked = false
            }
        }
        for (let box of target_check_boxes) {
            if (box.checked && box.disabled && removed_schema.target === box.name) {
                box.disabled = false;
                box.checked = false
            }
        }
        props.setDBmappingState({...props.dbmappingState, mapped_schema: newState})
    };


    let handleSourceCheckSchemaMap = (evt, target_database, source_database, schema) => {
        // evt.target.classList.remove(source_database + "-schema_source_checked");
        let source_check_boxes = document.getElementsByClassName(source_database + "-schema_source_checked");
        let target_check_boxes = document.getElementsByClassName(target_database + "-schema_target_checked");
        console.log(evt.target.checked);
        if (evt.target.checked) {
            for (let box of source_check_boxes) {
                if (box !== evt.target) {
                    box.style.opacity = 0;
                }
            }
            for (let target_box of target_check_boxes) {
                target_box.style.opacity = 1;
            }
            const new_check_source_schema = Object.assign({}, props.dbmappingState, {checked_source_schema: {[source_database]: schema}});
            props.setDBmappingState(new_check_source_schema);

        } else {
            for (let box of source_check_boxes) {
                box.style.opacity = 1;

            }
            for (let target_box of target_check_boxes) {
                target_box.style.opacity = 0;
            }
        }
    };

    let handleTargetCheckSchemaMap = (evt, target_database, source_database, schema) => {
        let newState = cloneDeep(props.dbmappingState);

        if (evt.target.checked) {
            let source_check_boxes = document.getElementsByClassName(source_database + "-schema_source_checked");
            let target_check_boxes = document.getElementsByClassName(target_database + "-schema_target_checked");

            for (let box of source_check_boxes) {
                if (box.checked) {
                    box.disabled = true
                }
                box.style.opacity = 1;
            }

            for (let target_box of target_check_boxes) {
                target_box.style.opacity = 0;
            }
            let selected_source_schema = props.dbmappingState.checked_source_schema[source_database];

            if (!(props.dbmappingState.mapped_schema.hasOwnProperty([source_database + " " + target_database]))) {
                newState.mapped_schema[source_database + " " + target_database] = [{
                    source: selected_source_schema,
                    target: schema
                }]
            } else {
                newState.mapped_schema[source_database + " " + target_database] = [...newState.mapped_schema[source_database + " " + target_database], {
                    source: selected_source_schema,
                    target: schema
                }]
            }

            props.setDBmappingState(newState);

        }
    };
    let response = validate_schema_mapping(props.dbmappingState);
    console.log(response);
    if (props.dbmappingState.schema_mapping.length > 0) {
    window.scrollTo(0, 0)
        return (

            <div>
                {props.dbmappingState.schema_mapping.map((db, index) =>
                    <div className="row" id={db.source.name + "-" + db.target.name}>
                        <div className="x_panel">
                            <div className="x_title">
                                <h2>Database - {db.source.name} To {db.target.name} </h2>
                                <ul className="nav navbar-right panel_toolbox">
                                    <li><a  className="collapse-link"
                                           onClick={(event => clickDropdown(event, "db-" + index))}><i
                                        className="fa fa-chevron-up"></i></a>
                                    </li>
                                </ul>
                                <div className="clearfix"></div>
                            </div>
                            <div className="x-content" id={"db-" + index}>
                                <div className=" table-mapping">
                                    <div className="" style={{width: "25%"}}>
                                        <table className="table table-striped jambo_table bulk_action">
                                            <thead>
                                            <tr className="headings">
                                                <th>

                                                    <div className="icheckbox_flat-green "
                                                         style={{position: 'relative'}}>
                                                        <input type="checkbox"
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
                                                <th className="column-title" style={{display: 'table-cell'}}>Source
                                                    Schema
                                                </th>

                                            </tr>
                                            </thead>
                                            <tbody>
                                            {db.source.schemas.map((value, index) =>
                                                <tr className="even pointer">
                                                    <td className="a-center ">
                                                        <div className="icheckbox_flat-green "
                                                             style={{position: 'relative'}}><input type="checkbox"
                                                                                                   className={"option-input " + db.source.name + "-schema_source_checked"}
                                                                                                   key={index}
                                                                                                   data-key={index}
                                                                                                   id={db.source.name + "-source-" + index}
                                                                                                   name={value}
                                                                                                   onClick={(event => {
                                                                                                       handleSourceCheckSchemaMap(event, db.target.name, db.source.name, value)
                                                                                                   })}
                                                                                                   style={{
                                                                                                       position: 'absolute',
                                                                                                       opacity: 1
                                                                                                   }}/>
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
                                                <th className="column-title" style={{display: 'table-cell'}}>Mapped
                                                    Source
                                                    Schemas
                                                </th>
                                                <th className="column-title" style={{display: 'table-cell'}}>Mapped
                                                    Target
                                                    Schemas
                                                </th>
                                                <th className="column-title" style={{display: 'table-cell'}}>Delete</th>

                                            </tr>
                                            </thead>
                                            <tbody>
                                            {props.dbmappingState.mapped_schema.hasOwnProperty([db.source.name + " " + db.target.name])
                                                ? props.dbmappingState.mapped_schema[db.source.name + " " + db.target.name].map((value, index) =>
                                                    <tr className="even pointer">
                                                        <td className=" "
                                                        >{value.source}</td>
                                                        <td className=" "
                                                        >{value.target}</td>
                                                        <td style={{padding: '0px'}}>
                                                            <button className="btn btn-sm"
                                                                    style={{paddingleft: '20px', paddingtop: '10px'}}
                                                                    onClick={event => handleOnDelete(event, db.source.name, db.target.name, index)}>
                                                                <i
                                                                    className="fa fa-trash"/></button>
                                                        </td>
                                                    </tr>) : null}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="" style={{width: "25%"}}>
                                        <table className="table table-striped jambo_table bulk_action">
                                            <thead>
                                            <tr className="headings">
                                                <th>
                                                    <div className="icheckbox_flat-green"
                                                         style={{position: 'relative'}}>
                                                        <input type="checkbox"
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
                                                <th className="column-title" style={{display: 'table-cell'}}>Target
                                                    Schema
                                                </th>

                                            </tr>
                                            </thead>
                                            <tbody>
                                            {db.target.schemas.map((value, index) =>
                                                <tr className="even pointer">
                                                    <td className="a-center ">
                                                        <div className="icheckbox_flat-green"
                                                             style={{position: 'relative'}}><input type="checkbox"
                                                                                                   key={index}
                                                                                                   data-key={index}
                                                                                                   id={db.target.name + "-target-" + index}
                                                                                                   onClick={event => {
                                                                                                       handleTargetCheckSchemaMap(event, db.target.name, db.source.name, value)
                                                                                                   }}
                                                                                                   className={"option-input " + db.target.name + "-schema_target_checked"}
                                                                                                   name={value}
                                                                                                   style={{
                                                                                                       position: 'absolute',
                                                                                                       opacity: 0
                                                                                                   }}/>
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
                        </div>
                    </div>
                )}
            </div>
        )
    } else {
        return null
    }
};

export default SMapping;