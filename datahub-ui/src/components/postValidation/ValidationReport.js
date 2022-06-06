import React, {useContext, useEffect, useState} from "react";
import axios from 'axios';
import {store} from "../../store";
import {Notification} from "react-pnotify";
import clickDropdown from "../utils/DropDown";


function ValidationReport(props) {
         const [globalState, dispatch] = useContext(store);
         const [state, setState] = useState({
           report: [],
           popup: [],
           popup1: [],
             notifications:[],
             matched_counts:0,
             mismatched_counts:0
    });
    useEffect(res => {
        dispatch({type: 'change loading', payload: true});
          axios.get(process.env.REACT_APP_API_URL +"/listTableValidation/"+props.id)
          .then(res=>{
                console.log(res.data);
              setState({...state, report: res.data.tables,
                                matched_counts:res.data.matched_counts,
                                mismatched_counts:res.data.mismatched_counts});

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
        }).finally(() => dispatch({type: "change loading", payload: false}))
    }, []);

    const onClickTableStatusOpen=(event,index,validation_id,table_id)=>
    {
    dispatch({type: "change loading", payload: true});
    axios.get(process.env.REACT_APP_API_URL +"/getTableValidationStatus/"+validation_id+"/"+table_id)
    .then(response=>{
        console.log(response.data);
        setState({...state, popup: response.data});
          window.$("modal" + validation_id + table_id).modal('show');
          }

    ).catch(reason => {
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
        }).finally(() => dispatch({type: "change loading", payload: false}))
    };

    const onModalPopup = (event,index, val_id,table_id)=>
    {
      axios.get(process.env.REACT_APP_API_URL +"/showtablehashvalidation/"+val_id+"/"+table_id)
           .then(response=>{
                  console.log(response.data);
                  setState({...state, popup1: response.data});
                  window.$("modal1" + val_id + table_id).modal('show');
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
        }).finally(() => dispatch({type: "change loading", payload: false}))
    }

    const go = () => {
        window.history.back();
    };
    console.log(state.report)
    console.log(state.popup1)
    if(state.report.length>0){
   return (
      <div class="right_col" role="main" style={{'min-height': 1047}}>
          <div class="col-md-12">
             <div className="pull-right">
                          <button href="" className="btn btn-app" onClick={go}>
                            <i class="fa fa-arrow-left"></i>Back
                          </button>
                        </div>
             <div class="x_panel">

                 <div class="x_title">
                     <h2>Validation Report</h2>
                     <ul class="nav navbar-right panel_toolbox">
                                <li><a class="collapse-link"><i class="fa fa-chevron-up"></i></a>
                                </li>
                     </ul>
                     <div class="clearfix"></div>
                 </div>
                     <div class="x_content" style={{display: 'block', paddingLeft: 50, paddingRight: 50}}>
                         <section class="content invoice">

                            <ul class="stats-overview">
                                <li style={{"width": "50%"}}>
                                    <span className="name"> Matched Count </span>
                                    <span className="value text-success">{state.matched_counts} </span>
                                </li>
                                <li style={{"width": "50%"}}>
                                    <span class="name"> Mismatched Count </span>
                                    <span class="value text-success"> {state.mismatched_counts} </span>
                                </li>
                            </ul>
                         </section>


                        <div class="row">
                                    <div class="table container">
                                        <table class="table table-striped">
                                            <thead>
                                                <tr>
                                                    <th></th>
                                                    <th>Table Name</th>
                                                    <th>Source Table Count</th>
                                                    <th>Target Table Count</th>
                                                    <th>Hash Check</th>
                                                    <th></th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                            {state.report.map((value,index)=>
                                            <tr>
                                                <td>{index+1}</td>
                                                <td>{value.table}</td>
                                                <td>{value.src_table_count}</td>
                                                <td>{value.trg_table_count}</td>
                                                <td></td>
                                                {/*<td>{TableStatusConstant[value.status]}</td>*/}
                                               <td>

                                                  <a type="button"  className="btn btn-primary" data-toggle="modal"
                                                        data-target=".bs-example-modal-lg" onClick={event => onClickTableStatusOpen(event,index, props.id,value.table_id)}

                                                     ><i
                                                           class="fa fa-info-circle fa-lg" data-toggle="tooltip" data-placement="left" title="View Details"></i>
                                                  </a>


                                                    <div class="modal fade bs-example-modal-lg" tabindex="-1"
                                                         role="dialog"
                                                         aria-hidden="true" style={{display: 'none'}}
                                                         id={"modal" + props.id + value.table_id}>
                                                        <div class="modal-dialog modal-lg">
                                                            <div class="modal-content">
                                                            <div className="modal-header">
                                                                            <h4 className="modal-title">Table : {state.popup.length>0 ?state.popup[1].table_name : null}
                                                                               </h4>
                                                                            <button type="button"
                                                                                    className="close"
                                                                                    data-dismiss="modal">&times;</button>
                                                            </div>
                                                            <div className="modal-body">
                                                                <div className="row">
                                                                  <div style={{width: "80%"}}>
                                                                    <table class="table table-striped jambo_table bulk_action">
                                                                       <thead>
                                                                          <tr className="heading">

                                                                             <th>Column Name</th>
                                                                             <th>Source Count</th>
                                                                             <th>Target Count</th>
                                                                              <th>Year</th>
                                                                              <th>Quarter</th>
                                                                          </tr>
                                                                       </thead>

                                                                       {state.popup.map((value) =>
                                                                       <tbody>

                                                                         <tr>



                                                                             {value.column_name ? <td>{value.column_name}</td>:<td><b>Table Count</b></td>}

                                                                            <td>{value.source_count}</td>

                                                                            <td>{value.target_count}</td>

                                                                             <td>{value.year ? value.year:"-"}</td>

                                                                             <td>{value.quarter ? value.quarter:"-"}</td>
                                                                         </tr>

                                                                       </tbody>
                                                                        )}
                                                                    </table>
                                                                  </div>
                                                                </div>
                                                                <div className="row">

                                                                    <button type="button"
                                                                        className="btn btn-danger"
                                                                        data-dismiss="modal">Close
                                                                    </button>
                                                                </div>
                                                            </div>

                                                            <div class="modal-footer">

                                                            </div>
                                                        </div>
                                                    </div>
                                                  </div>

                                                  <a type="button"  style={{'margin-left':5}} className="btn btn-primary" data-toggle="modal"
                                                     data-target=".bs-example-modal1-lg " onClick = {(event)=>onModalPopup(event,index, props.id,value.table_id)}
                                                     ><i   data-toggle="tooltip" data-placement="left" title="View Hash Details"
                                                           class="fa fa-info-circle fa-lg" ></i>
                                                  </a>

                                                  <div class="modal fade bs-example-modal1-lg modal-new" tabindex="-1"
                                                         role="dialog"
                                                         aria-hidden="true" style={{display: 'none'}}
                                                         id={"modal1" + props.id + value.table_id}>
                                                        <div class="modal-dialog modal-lg">
                                                            <div class="modal-content">
                                                            <div className="modal-header">
                                                                            <h4 className="modal-title">Details
                                                                               </h4>
                                                                            <button type="button"
                                                                                    className="close"
                                                                                    data-dismiss="modal">&times;</button>
                                                            </div>
                                                            <div className="modal-body">
                                                                <div className="row">
                                                                  <div style={{width: "80%"}}>
                                                                    <table class="table table-striped jambo_table bulk_action">
                                                                       <thead>
                                                                          <tr className="heading">

                                                                             <th>Table</th>
                                                                             <th>Id</th>
                                                                             <th>Status</th>

                                                                          </tr>
                                                                       </thead>
                                                                       {state.popup1.map((value) =>
                                                                          <tbody>
                                                                             <tr>
                                                                                <td>{value.table}</td>
                                                                                <td>{value.id}</td>
                                                                                <td>{value.status}</td>
                                                                             </tr>
                                                                          </tbody>
                                                                       )}
                                                                    </table>
                                                                  </div>
                                                                </div>
                                                                <div className="row">

                                                                    <button type="button"
                                                                        className="btn btn-danger"
                                                                        data-dismiss="modal">Close
                                                                    </button>
                                                                </div>
                                                            </div>

                                                            <div class="modal-footer">

                                                            </div>
                                                        </div>
                                                    </div>
                                                  </div>




                                               </td>
                                            </tr>
                                            )}
                                            </tbody>
                                        </table>
                                    </div>
                        </div>
                     </div>
             </div>
          </div>
      </div>
   );
}
else
{
 return (
      <div class="right_col" role="main" style={{'min-height': 1047}}>
          <div class="col-md-12">
             <div className="pull-right">
                          <button href="" className="btn btn-app" onClick={go}>
                            <i class="fa fa-arrow-left"></i>Back
                          </button>
                        </div>
             <div class="x_panel">

                 <div class="x_title">
                     <h2>Validation Report</h2>
                     <ul class="nav navbar-right panel_toolbox">
                                <li><a class="collapse-link" onClick={event=>clickDropdown(event,"vReport-"+props.id)}><i class="fa fa-chevron-up"></i></a>
                                </li>
                     </ul>
                     <div class="clearfix"></div>
                 </div>
                     <div class="x_content" id={"vReport-"+props.id} style={{display: 'block', paddingLeft: 50, paddingRight: 50}}>
                         <section class="content invoice">

                            <ul class="stats-overview">
                                <li style={{"width": "50%"}}>
                                    <span className="name"> Matched Count </span>
                                    <span className="value text-success">{state.matched_counts} </span>
                                </li>
                                <li style={{"width": "50%"}}>
                                    <span class="name"> Mismatched Count </span>
                                    <span class="value text-success"> {state.mismatched_counts} </span>
                                </li>
                            </ul>
                         </section>


                        <div class="row">
                                    <div class="table container">
                                        <table class="table table-striped">
                                            <thead>
                                                <tr>
                                                    <th></th>
                                                    <th>Table Name</th>
                                                    <th>Source Table Count</th>
                                                    <th>Target Table Count</th>
                                                    <th>Hash Check</th>
                                                    <th></th>

                                                </tr>
                                            </thead>
                                              <tbody>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td style={{fontSize:'20'}}><b><span>No Data Available</span></b></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                            </tbody>
                                        </table>
                                    </div>
                        </div>
                     </div>

             </div>
          </div>
      </div>

)
}
}

export default ValidationReport;