import React, {useContext, useEffect, useState} from "react";
import {go} from "../utils/Utils";
import axios from 'axios';
import {navigate} from "hookrouter";
import {store} from "../../store";
import {ClipLoader} from "react-spinners";
import clickDropdown from "../utils/DropDown";

function HashDetails(props) {
    console.log(props.id);
    const [globalState, dispatch] = useContext(store);
    const [state, setState] = useState({
        detail: [],
        mig_name: "",
        source_db: "",
        target_db: "",
        notifications: []
    });
    useEffect(res => {
        dispatch({type: 'change loading', payload: true});

//        axios.get(process.env.REACT_APP_API_URL + "/listValidation/" + props.id)
//            .then(list_res => {
//                axios.get(process.env.REACT_APP_API_URL + "/showmig/" + props.id)
//                   .then(res => {
//                        console.log(res.data);
//                        setState({
//                            ...state, mig_name: res.data.mig_name, source_db: res.data.source_name,
//                            target_db: res.data.target_name, detail: list_res.data
//                        });
//                    }).catch(reason => {
//                    setState({
//                        ...state, notifications: [...state.notifications, <Notification
//                            type='error'
//                            title='error'
//                            text={reason}
//                            delay={1500}
//                            shadow={false}
//                            hide={true}
//                            nonblock={true}
//                            desktop={true}
//                        />]
//                    })
//                }).finally(() => dispatch({type: "change loading", payload: false}))
//            .catch(reason => {
//            setState({
//                ...state, notifications: [...state.notifications, <Notification
//                    type='error'
//                    title='error'
//                    text={reason}
//                    delay={1500}
//                    shadow={false}
//                    hide={true}
//                    nonblock={true}
//                    desktop={true}
//                />]
//            })
//            dispatch({type: "change loading", payload: false});
//        })
//
    }, []);


   if(state.detail.length>0){
    return (
        <div class="right_col" role="main" style={{'min-height': 1047}}>
            {state.notifications.map(value =>
                value)}
            <div class="col-md-12">
                <div className="pull-right">
                    <button href="" className="btn btn-app" onClick={go}>
                        <i class="fa fa-arrow-left"></i>Back
                    </button>

                </div>
                <div class="x_panel">
                    <div class="x_title">
                        <h2>Hash Validation Details </h2>


                        <ul class="nav navbar-right panel_toolbox">
                            <li><a onClick={event=>clickDropdown(event,"summary"+props.id)} class="collapse-link"><i class="fa fa-chevron-up"></i></a>
                            </li>

                        </ul>
                        <div class="clearfix"></div>
                    </div>
                    <div class="x_content" id={"summary"+props.id} style={{display: 'block'}}>
                        <section class="content invoice">



                            <div class="row">
                                <div class="table container">
                                    <table class="table table-striped">
                                        <thead>

                                        <tr>
                                            <th></th>
                                            <th>Table Name</th>
                                            <th>Hash ID</th>
                                            <th>Status</th>
                                            <th></th>


                                        </tr>
                                        </thead>
                                        <tbody>
                                        {state.detail.map((value,index)=>
                                                <tr>
                                                    <td>{index + 1}</td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>

                                                 </tr>





                                        ) }
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
    }
else {
        return (<div className="right_col" role="main" style={{'min-height': 1047}}>
                {state.notifications.map(value =>
                    value)}
                <div class="col-md-12">
                    <div className="pull-right">

                        <button href="" className="btn btn-app" onClick={go}>
                            <i class="fa fa-arrow-left"></i>Back
                        </button>

                    </div>
                    <div class="x_panel">

                        <div class="x_title">
                       <h2>Hash Validation Details
                        </h2>

                        <ul class="nav navbar-right panel_toolbox">
                            <li><a onClick={event=>clickDropdown(event,"summary"+props.id)} class="collapse-link"><i class="fa fa-chevron-up"></i></a>
                            </li>

                        </ul>
                        <div class="clearfix"></div>
                    </div>
                    <div class="x_content" id={"summary"+props.id} style={{display: 'block'}}>
                        <section class="content invoice">



                            <div class="row">
                                <div class="table container">
                                    <table class="table table-striped">
                                        <thead>

                                        <tr>
                                            <th></th>
                                            <th>Table Name</th>
                                            <th>Hash ID</th>
                                            <th>Status</th>
                                            <th></th>


                                        </tr>
                                        </thead>
                                        <tbody>
                                        {state.detail.map((value,index)=>
                                                <tr>
                                                    <td>{index + 1}</td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>

                                                 </tr>





                                        ) }
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
}
}
export default HashDetails;