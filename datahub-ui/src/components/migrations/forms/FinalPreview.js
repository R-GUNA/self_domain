import React from "react";
import {SelectedTablesComponent} from "./TableMapping";

let FinalPreview = (props) => {
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

    return (
        <div id="step-4" className="content" style={{display: 'none'}}>
            {props.dbmappingState.tables_data.map((db, index) =>
                <div className="row">
                    <div className="x_panel">
                        <div className="x_title">
                            <h2>{db.source} to {db.target} <small>Add Tables</small></h2>
                            <ul className="nav navbar-right panel_toolbox">
                                <li><a href="#" className="collapse-link"
                                       onClick={(event => clickDropdown(event, "db-" + index))}><i
                                    className="fa fa-chevron-up"></i></a>
                                </li>
                            </ul>
                            <div className="clearfix"></div>
                        </div>
                        <div className="x-content" id={"db-" + index}>
                            {db.schemas.map((schema, indexSchema) =>
                                <div className="row table-mapping">
                                    <div className="table-responsive" style={{width: "50%", height: "fit-content"}}>
                                        <table className="table table-striped jambo_table bulk_action">
                                            <thead>
                                            <tr className="headings">
                                                <th></th>
                                                <th className="column-title" style={{display: 'table-cell'}}>Mapped
                                                    Tables {schema.source} - {schema.target}</th>
                                            </tr>
                                            </thead>

                                            <SelectedTablesComponent
                                                selected_tables={props.dbmappingState.selected_tables}
                                                database_map={{source: db.source, target: db.target}}
                                                schema_map={{source: schema.source, target: schema.target}}/>

                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
};

export default FinalPreview