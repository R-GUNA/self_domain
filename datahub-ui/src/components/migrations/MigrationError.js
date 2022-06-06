import React, {useContext, useEffect, useState} from "react";
import {navigate} from "hookrouter";
import {get_logs} from "./MigrationService";
import {store} from "../../store";
import DateTime from "../utils/DateTime";
import {go} from "../utils/Utils";
import clickDropdown from "../utils/DropDown";

function MigrationError(props) {
    const [globalState, dispatch] = useContext(store);
    const [state, setState] = useState(null);
    useEffect(() => {
        dispatch({type: 'change loading', payload: true});
        get_logs(props.id).then(res => {
            setState({logs: res.data.logs,mig_type:res.data.mig_type});
            console.log(props)
        }).catch(reason => {
        }).finally(() => dispatch({type: 'change loading', payload: false}))
    }, []);
    console.log(state)
    if (state) {
        return (
            <div class="right_col" role="main" style={{'min-height': 1047}}>
                <div class="col-md-12">
                    <div className="pull-right">

                        <button className="btn btn-app" onClick={go}>
                            <i class="fa fa-arrow-left"></i>Back
                        </button>

                    </div>
                    <div class="x_panel">
                        <div class="x_title">
                            <h2>Migration Log Report </h2>  
                            <ul className="nav navbar-right panel_toolbox">
                            <li><a  onClick={event=>clickDropdown(event,"log-"+props.id)}className="collapse-link"><i className="fa fa-chevron-up"></i></a>
                            </li>
                        </ul>

                            <div class="clearfix"></div>
                        </div>
                        <div class="x_content" id={"log-"+props.id}style={{display: 'block'}}>
                            <section class="content invoice">


                                <div class="row">
                                    <div class="table container" >
                                        <table class="table table-striped">
                                            <thead>
                                            <tr>
                                                <th></th>
                                                <th>Log Name</th>
                                                <th>Created Time</th>
                                                <th></th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {state.logs.map((value, index) =>
                                                <tr>
                                                    <td>{index + 1}</td>
                                                    <td>{value.log_name}</td>
                                                    <td><DateTime datetime={value.log_date}/></td>
                                                    <td>
                                                     <a href={process.env.REACT_APP_API_URL + "/logdetails/" + value.log_id + "?type=csv"}
                                                           className="btn btn-primary"><i
                                                            className="fa fa-download"/> Generate CSV
                                                        </a>
                                                        <button type="button" class="btn btn-primary"
                                                                onClick={event => navigate("/" + props.id + "/" + value.log_id + "/error_detail")}>View
                                                            Details
                                                        </button>
                                                        <a href={"/"+ props.id + '/' + state.mig_type +'/viewdetails'} className="btn btn-primary">View Mapping Detail</a>

                                                    </td>
                                                </tr>
                                            )}
                                            </tbody>
                                        </table>
                                    </div>

                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        );
    } else {
        return (<div className="right_col" role="main" style={{'min-height': 1047}}>
            <div className="col-md-12">
                <div className="pull-right">

                        <button className="btn btn-app" onClick={go}>
                            <i class="fa fa-arrow-left"></i>Back
                        </button>

                    </div>
                <div className="x_panel">
                    <div className="x_title">
                        <h2>Migration Log Report </h2>
                        <ul className="nav navbar-right panel_toolbox">
                            <li><a onClick={event=>clickDropdown(event,"logs-"+props.id)} className="collapse-link"><i className="fa fa-chevron-up"></i></a>
                            </li>
                        </ul>
                        <div className="clearfix"></div>
                    </div>
                    <div className="x_content" id={"logs-"+props.id}style={{display: 'block'}}>
                        <section className="content invoice">


                            <div className="row">
                                <div className="table container">
                                    <table className="table table-striped">
                                        <thead>
                                        <tr>
                                            <th></th>
                                            <th>Log Name</th>
                                            <th>Created Time</th>
                                            <th></th>
                                        </tr>
                                        </thead>
                                        <tbody >
                                          <tr>
                                             <td colspan="2"></td>

                                             <td style={{fontSize:'20'}}><b>No Data Available</b></td>
                                             <td colspan='3'></td>
                                          </tr>
                                        </tbody>
                                    </table>
                                </div>

                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>)
    }
}

export default MigrationError;