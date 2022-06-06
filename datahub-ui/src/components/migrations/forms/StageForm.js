import React from "react";


export const StageForm = (props) => {
    let setForm = (event, type) => {
        props.setParentState({...props.parentState, [type]: event.target.value})
    };
    return (
        <form className="form-horizontal">


         <div >
            <div className="row" >
                <div className="form-group col-sm-10" >
                    <input type="text" id="stage_name" className="form-control form-control-sm"
                           onChange={(event => {
                               setForm(event, "stage_name")
                           })} defaultValue={props.parentState.stage_name}
                           placeholder="Enter Stage Name"/>

                </div>
             <i data-placement="right" data-toggle="tooltip" title="Internal/External Linked Stage name"
                   className="fa fa-question-circle"/>
            </div>

            <div className="row">
                <div className="form-group col-sm-10">
                    <input type="text" id="stage_schema" className="form-control form-control-sm"
                           onChange={(event => {
                               setForm(event, "stage_schema")
                           })} defaultValue={props.parentState.stage_schema}
                           placeholder="Enter Stage Schema"/>

                </div>
                 <i data-placement="right" data-toggle="tooltip" title="Schema name under which above stage was created"
                   className="fa fa-question-circle"/>
            </div>

            <div className="row">
                <div className="form-group col-sm-10">
                    <input type="text" id="stage_db" className="form-control form-control-sm"
                           onChange={(event => {
                               setForm(event, "stage_db")
                           })} defaultValue={props.parentState.stage_db}
                           placeholder="Enter Stage DB"/>

                </div>
                <i data-placement="right" data-toggle="tooltip" title="Database name under which above stage was created"
                   className="fa fa-question-circle"/>
            </div>
         </div>

        </form>
    )
};