import React from "react";

var cloneDeep = require('lodash.clonedeep');

export let SelectedTablesComponent = (props) => {
    let selected_obj = [];
    for (let obj of props.selected_tables) {
        if (obj.source === props.database_map.source && obj.target === props.database_map.target) {
            for (let schema_obj of obj.schemas) {
                if (schema_obj.target === props.schema_map.target && props.schema_map.source === schema_obj.source) {
                    selected_obj = schema_obj.tables;

                }

            }
        }
    }


    return (
        <tbody>
        {selected_obj.map((value, index) =>
            <tr className="even pointer">
                {props.isEditable ?
                    <td className="a-center ">
                        <div className="icheckbox_flat-green "
                             style={{position: 'relative'}}><input type="checkbox"
                                                                   className={"option-input "+"mapped" + "-" + props.database_map.source + "-" + props.database_map.target + "--" + props.schema_map.source + "-" + props.schema_map.target}
                                                                   name="selected_table_records"
                                                                   key={index}
                                                                   data-key={value}
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
                    : <td></td>}
                <td className=" " key={index}>{value}</td>
            </tr>
        )}
        </tbody>

    )
};

let TableMapping = (props) => {
    const clickDropdown = (evt, id) => {
        evt.preventDefault();
        let ele = document.getElementById(id);
        console.log(ele.style.display);
        if (ele.style.display === "none") {
            ele.style.display = "block";
        } else {
            ele.style.display = "none";
        }
    };

    let onTableCheck = (evt, database_map, schema_map) => {
        let newState = cloneDeep(props.dbmappingState);
        let selected_obj = {};
        let count = 0;
        let selected_tables = [];
        for (let ele of document.getElementsByClassName(database_map.source + "-" + database_map.target + "--" + schema_map.source + "-" + schema_map.target)) {
            if (ele.checked && !ele.disabled) {
                selected_tables = [...selected_tables, ele.getAttribute("data-key")];
                ele.disabled = true
            }
        }
        for (let obj in newState.selected_tables) {
            obj = parseInt(obj);
            if (newState.selected_tables[obj].source === database_map.source && newState.selected_tables[obj].target === database_map.target) {
                selected_obj = newState.selected_tables[obj];
                count = obj;
                break
            }
        }
        if (selected_obj.hasOwnProperty("source")) {
            // selected_obj.schemas = [...selected_obj.schemas , {source:schema_map.source , target:schema_map.target , tables :selected_tables}]
            let has_selected_schema_map = false;
            for (let schema in selected_obj.schemas) {
                schema = parseInt(schema);
                if (selected_obj.schemas[schema].source === schema_map.source && selected_obj.schemas[schema].target === schema_map.target) {
                    selected_obj.schemas[schema].tables = [...selected_obj.schemas[schema].tables, ...selected_tables];
                    has_selected_schema_map = true;
                    break
                }
            }
            if (!has_selected_schema_map) {
                selected_obj.schemas = [...selected_obj.schemas, {
                    source: schema_map.source,
                    target: schema_map.target,
                    tables: selected_tables
                }]
            }

            newState.selected_tables.splice(count, 1);
            newState.selected_tables.push(selected_obj)
        } else {
            newState = {
                ...newState, selected_tables: [...newState.selected_tables,
                    {
                        source: database_map.source, target: database_map.target,
                        schemas: [{source: schema_map.source, target: schema_map.target, tables: selected_tables}]
                    }]
            }
        }
        props.setDBmappingState(newState);
    };

    let onRemoveTables = (event, db_index, schema_index, database_map, schema_map) => {
        let unselected_objs = [];
        let selected_objs = [];
        let newState = cloneDeep(props.dbmappingState);
        // get all unselected checkboxes
        for (let ele of document.getElementsByClassName("mapped" + "-" + database_map.source + "-" + database_map.target + "--" + schema_map.source + "-" + schema_map.target)) {
            if (!ele.checked) {
                unselected_objs.push(ele.getAttribute("data-key"))
            } else {
                selected_objs.push(ele.getAttribute("data-key"))
            }
        }
        newState.selected_tables[db_index].schemas[schema_index].tables = unselected_objs;
        props.setDBmappingState(newState);
        //uncheck all selected checkboxes in source
        for (let ele of document.getElementsByClassName(database_map.source + "-" + database_map.target + "--" + schema_map.source + "-" + schema_map.target)) {
            if (selected_objs.indexOf(ele.getAttribute("data-key")) > -1) {
                ele.disabled = false;
                ele.checked = false
            }
        }

    };
    if (props.dbmappingState.curr_step === 3) {
        let submit_element = window.$("#step-button");
        submit_element.css('opacity', '1');
        let prev_element = window.$("#step-prev-button");
        prev_element.css('opacity', '1');
    }
    let Selectall = (event, db, schema, mapped = false) => {

        if (mapped) {
            for (var check of window.$("." + "mapped-" + db.source + "-" + db.target + "--" + schema.source + "-" + schema.target)) {
                if (event.target.checked) {
                    check.checked = true
                } else {
                    check.checked = false
                }
            }
        } else {
            for (var check of window.$("." + db.source + "-" + db.target + "--" + schema.source + "-" + schema.target)) {
                if (event.target.checked) {
                    check.checked = true
                } else {
                    check.checked = false
                }
            }
        }

    };
    if (props.dbmappingState.tables_data.length > 0) {
        return (
            <div id="step-3" className="content" style={{display: 'none'}}>
                {props.dbmappingState.tables_data.map((db, index) =>
                    <div className="row">
                        <div className="x_panel">
                            <div className="x_title">
                                <h2>{db.source} to {db.target}
                                </h2>
                                <ul className="nav navbar-right panel_toolbox">
                                    <li><a href="#" className="collapse-link"
                                           onClick={(event => clickDropdown(event, "dbmapping-"+db + index))}><i
                                        className="fa fa-chevron-up"></i></a>
                                    </li>
                                </ul>
                                <div className="clearfix"></div>
                            </div>

                            <div>



                                <div className="x-content" id={"dbmapping-"+db + index}>
                                    {db.schemas.map((schema, indexSchema) =>
                                        <div>
                                          <div className="x_title">
                                <h2>{schema.source} to {schema.target}
                                </h2>
                                <ul className="nav navbar-right panel_toolbox">
                                    <li><a  className="collapse-link"
                                           onClick={(event => clickDropdown(event, "db-"+ schema+ index))}><i
                                        className="fa fa-chevron-up"></i></a>
                                    </li>
                                </ul>
                                <div className="clearfix"></div>
                            </div>


                                      <div id={"db-"+ schema+ index}>
                                        <div className="row table-mapping" >

                                            <div className=""  style={{width: "30%"}}>

                                                <table className="table table-striped jambo_table bulk_action">
                                                    <thead>
                                                    <tr className="headings">
                                                        <th>
                                                            <div className="icheckbox_flat-green " style={{
                                                                position: 'relative',
                                                                paddingBottom: 15,
                                                                paddingLeft: 1
                                                            }}>
                                                                <input type="checkbox"
                                                                       id="check-all"
                                                                       className="option-input"
                                                                       style={{position: 'absolute', opacity: 1}}
                                                                       onClick={event => Selectall(event, db, schema)}/>
                                                                <ins className="iCheck-helper"
                                                                     style={{
                                                                         position: 'absolute',
                                                                         top: '50%',
                                                                         left: '50%',
                                                                         display: 'block',
                                                                         width: '100%',
                                                                         height: '100%',
                                                                         margin: '50px',
                                                                         padding: '50px',
                                                                         background: 'rgb(255, 255, 255)',
                                                                         border: '0px',
                                                                         opacity: '0'
                                                                     }}/>
                                                            </div>
                                                        </th>
                                                        <th className="column-title"
                                                            style={{display: 'table-cell'}}>Select
                                                            Tables
                                                        </th>

                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    {schema.tables.map((table, index) =>
                                                        <tr className="even pointer">
                                                            <td className="a-center ">
                                                                <div className="icheckbox_flat-green "
                                                                     style={{position: 'relative'}}><input
                                                                    type="checkbox"
                                                                    className={"option-input " + db.source + "-" + db.target + "--" + schema.source + "-" + schema.target}
                                                                    key={index}
                                                                    data-key={table}
                                                                    name="table_records"
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
                                                            {table.length > 15 ? <td className=" " data-toggle="tooltip"
                                                                                     title={table}> {table.substring(0, 15) + '...'}</td> :
                                                                <td className=" "> {table}</td>}
                                                        </tr>)}
                                                    </tbody>
                                                </table>
                                            </div>

                                            <div class="btn-group-vertical">

                                                <button href="#step-11" className="btn btn-secondary"
                                                        style={{paddingTop: '60px', lineHeight: '50px'}}
                                                        onClick={event => onTableCheck(event, {
                                                            source: db.source,
                                                            target: db.target
                                                        }, {source: schema.source, target: schema.target})}
                                                        isdone="1" rel="1">
                                                    <i className="fa fa-arrow-circle-right fa-lg"></i>
                                                </button>

                                                <button href="#step-11" className="btn btn-secondary"
                                                        style={{paddingBottom: '60px', lineHeight: '50px'}}
                                                        onClick={event => onRemoveTables(event, index, indexSchema, {
                                                            source: db.source,
                                                            target: db.target
                                                        }, {source: schema.source, target: schema.target})}
                                                        class="btn btn-secondary" isdone="1" rel="1">
                                                    <i className="fa fa-arrow-circle-left fa-lg"></i>
                                                </button>

                                            </div>


                                            <div className=""
                                                 style={{width: "30%"}}>
                                                <table className="table table-striped jambo_table bulk_action">
                                                    <thead>
                                                    <tr className="headings">
                                                        <th>
                                                            <div className="icheckbox_flat-green " style={{
                                                                position: 'relative',
                                                                paddingBottom: 15,
                                                                paddingLeft: 1
                                                            }}>
                                                                <input type="checkbox"
                                                                       id="check-all"
                                                                       className="option-input"
                                                                       onClick={event => Selectall(event, db, schema, true)}
                                                                       style={{position: 'absolute', opacity: 1}}/>
                                                                <ins className="iCheck-helper"
                                                                     style={{
                                                                         position: 'absolute',
                                                                         top: '50%',
                                                                         left: '50%',
                                                                         display: 'block',
                                                                         width: '100%',
                                                                         height: '100%',
                                                                         margin: '50px',
                                                                         padding: '50px',
                                                                         background: 'rgb(255, 255, 255)',
                                                                         border: '0px',
                                                                         opacity: '0'
                                                                     }}/>
                                                            </div>
                                                        </th>
                                                        <th className="column-title"
                                                            style={{display: 'table-cell'}}>Mapped
                                                            Tables {schema.source} - {schema.target}</th>
                                                    </tr>
                                                    </thead>


                                                    <SelectedTablesComponent
                                                        selected_tables={props.dbmappingState.selected_tables}
                                                        isEditable={true}
                                                        database_map={{source: db.source, target: db.target}}
                                                        schema_map={{source: schema.source, target: schema.target}}/>

                                                </table>
                                            </div>

                                        </div>
                                        </div>
                                      </div>
                                    )}

                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        )
    } else {
        return (
            <div>

            </div>
        )
    }
};

export default TableMapping;