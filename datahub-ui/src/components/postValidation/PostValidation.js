import React, {useContext, useEffect, useState} from "react";
import {store} from "../../store";
import {go} from "../utils/Utils";
import {get_tables_col, save_tables_col} from "./postValidationService";
import {Notification} from "react-pnotify";
import clickDropdown from "../utils/DropDown";

function PostValidation(props) {
    console.log(props);
    const [globalState, dispatch] = useContext(store);
    const [state, setState] = useState({notifications: [], migration_details: {mappings: []}});
    useEffect(res => {
        dispatch({type: 'change loading', payload: true});
        get_tables_col(props.id).then(res => {
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
        }).finally(() => dispatch({type: 'change loading', payload: false}))
    }, []);

    const onSave = (event) => {
        let respData = {"tables": []};
        let data = [];
        for (var select of window.$("select option:selected")) {
            console.log(select);
            if (select.value !== "") {
                let table = {};
                table.table_id = select.getAttribute("data-key");
                table.date_col = select.value;
                data = [...data, table]

            }
        }
        respData.tables = data;
        if (respData.tables.length > 0) {
            dispatch({type: 'change loading', payload: true});
            save_tables_col(respData).then(res => {
                setState({
                    ...state, notifications: [...state.notifications, <Notification
                        type='success'
                        title='Validation Successfully Saved'
                        delay={1500}
                        shadow={false}
                        hide={true}
                        nonblock={true}
                        desktop={true}
                    />],
                    migration_started: true
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
            }).finally(() => dispatch({type: 'change loading', payload: false})
            )
        }

    };

    if (state) {
      if(state.migration_details.mig_type === 'DB'){
        return (
            <div class="right_col" role="main" style={{'min-height': 1047}}>
                {state.notifications.map(value => value)}
                <div class="col-md-12">
                    <div className="pull-right">

                        <button href="" className="btn btn-app" onClick={go}>
                            <i class="fa fa-arrow-left"></i>Back
                        </button>

                    </div>
                    <div class="x_panel">
                        <div class="x_title">
                            <h2><b>Connection </b> - {state.migration_details.source_name} To {state.migration_details.target_name}    </h2>
                            <ul class="nav navbar-right panel_toolbox">
                                <li><a class="collapse-link" onClick={event=>clickDropdown(event,"ValidationDetails-"+props.id)}><i class="fa fa-chevron-up"></i></a>
                                </li>
                            </ul>
                            <div class="clearfix"></div>
                        </div>
                        <div class="x_content" id={"ValidationDetails-"+props.id} style={{display: 'block'}}>
                            <section class="content invoice">
                                {state.migration_details.mappings.map((value, index) =>
                                    <div className="row">
                                        <div className="x_panel">
                                            <div className="x_title">
                                                <h2>Database - {value.source} To {value.target} </h2>
                                                <ul className="nav navbar-right panel_toolbox">
                                                    <li><a onClick={event=>clickDropdown(event,"validationDetailsdb-"+props.id)}className="collapse-link"><i
                                                        className="fa fa-chevron-up"></i></a></li>
                                                </ul>
                                                <div className="clearfix"></div>
                                            </div>
                                            <div className="x-content" id={"validationDetailsdb-"+props.id}>
                                                {value.schemas.map((schema, index1) =>
                                                    <div class="row">
                                                        <div class="x_panel">
                                                            <div class="x_title">
                                                                <h2>Schema - {schema.source} To {schema.target} </h2>
                                                                <ul className="nav navbar-right panel_toolbox">
                                                                    <li><a onClick={event=>clickDropdown(event,"tablelist-"+schema+index1)}className="collapse-link"><i
                                                                    className="fa fa-chevron-up"></i></a></li>
                                                                </ul>

                                                                <div class="clearfix"></div>
                                                            </div>


                                                            <div class="x-content" id={"tablelist-"+schema+index1}>
                                                                <div className="" align="center">
                                                                  <thead>
                                                                    <tr>
                                                                      <th><h4 justify-align="center">Table List</h4></th>
                                                                    </tr>
                                                                  </thead>
                                                                </div>
                                                                <div class="  table">
                                                                    <table class="table table-striped">
                                                                        <thead>
                                                                        <tr>
                                                                            <th></th>
                                                                            <th>Source Table Name</th>

                                                                            <th><label className="form-label"
                                                                                       for="qwerty">Select </label></th>


                                                                        </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                        {schema.tables.map((table, table_index) =>
                                                                            <tr>
                                                                                <td>{table_index+1}</td>
                                                                                <td>{table.table}</td>
                                                                                <td><select id="qwerty"
                                                                                            className="form-control">
                                                                                    <option value={""}>Select</option>
                                                                                    {
                                                                                        table.date_cols.map((col, col_index) =>
                                                                                            <option
                                                                                                data-key={table.table_id}
                                                                                                value={col}>{col}</option>)
                                                                                    }
                                                                                </select></td>
                                                                            </tr>
                                                                        )}
                                                                        <button onClick={onSave} type="submit"
                                                                                className="btn btn-success">
                                                                            Save
                                                                        </button>

                                                                        </tbody>

                                                                    </table>

                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        );
      }
      else
      {
       return(<div className="right_col" role="main" style={{'min-height': 1047}}>
              <div className="col-md-12">
                    <div classNameName="pull-right">

                        <button href="" className="btn btn-app pull-right" onClick={go}>
                            <i className="fa fa-arrow-left"></i>Back
                        </button>

                    </div>
                    <div className="x_panel">

                        <div className="x_title">
                            <h2><b>Connection </b> - {state.migration_details.target_name}
                            </h2>
                            <ul className="nav navbar-right panel_toolbox">
                                                    <li><a onClick={event => {
                                                        clickDropdown(event, "fl-connection-"+props.id)
                                                    }} className="collapse-link"><i className="fa fa-chevron-up"/></a>
                                                    </li>
                                                </ul>
                            <div className="clearfix"></div>
                        </div>

                    </div>
              </div>
       </div>
       );
      }
    }

}

export default PostValidation;