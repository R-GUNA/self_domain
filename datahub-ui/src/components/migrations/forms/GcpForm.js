import React, {useContext} from "react";
import {store} from "../../../store";

export const GcpForm = (props) => {
    const [globalState, dispatch] = useContext(store);

    let setEncryption = (event) => {
        console.log(event.target.value);
        props.setParentState({...props.parentState, is_gcp_encrypt: event.target.value})
    };
    let setFormUpload = (event) => {
        dispatch({type: 'change loading', payload: true});
        let fReader = new FileReader();
        var file_name = event.target.files[0].name;
        fReader.onload = loadEvent => {
            props.setParentState({
                ...props.parentState,
                gcp_file: {name: file_name, data: JSON.parse(loadEvent.target.result)}
            });
            dispatch({type: 'change loading', payload: false});
        };
        fReader.readAsText(event.target.files[0]);
    };
    return (

        <form className="form-horizontal">


            <div className="row">

                <div className="form-group col-sm-10">
                    <input type="url" className="form-control form-control-sm" id="url"
                           onChange={event => props.setParentState({...props.parentState, gcp_url: event.target.value})}
                           defaultValue={props.parentState.gcp_url} placeholder="Enter URL"/>
                </div>
                <i data-placement="right" data-toggle="tooltip" title="Format: 'gcs://<bucket>[/<path>/]'"
                   className="fa fa-question-circle"/>


                <div className="form-group col-sm-10">
                    {/*<input type="url" className="form-control form-control-sm" id="access-key"*/}
                    {/*       onChange={event => props.setParentState({...props.parentState, gcp_access_key: event.target.value})}*/}
                    {/*       defaultValue={props.parentState.gcp_access_key} placeholder="Enter GCP Access Key"/>*/}
                    <label class="file-upload">
                        Give Service Account Json<input type="file" accept="application/json"
                                                        style={{color: "transparent"}}
                                                        multiple={false}
                                                        onChange={(event) => setFormUpload(event)}/></label>
                    {props.parentState.hasOwnProperty("gcp_file") ? props.parentState.gcp_file.name : null}
                </div>
                <div className="form-group col-sm-10">
                    <input type="url" className="form-control form-control-sm" id="access-key"
                           onChange={event => props.setParentState({
                               ...props.parentState,
                               gcp_stg_int: event.target.value
                           })}
                           defaultValue={props.parentState.gcp_stg_int} placeholder="Enter GCP Storage Integration"/>
                </div>
                 <i data-placement="right" data-toggle="tooltip" title="Format: <integration_name>"
                   className="fa fa-question-circle"/>
                <div className="form-group col-sm-10">
                    <div className="form-check form-check-inline">
                        <input className="form-check-input stage-select" type="radio"
                               defaultChecked={props.parentState.is_gcp_encrypt === "false"}
                               name="inlineRadioOptions" onClick={setEncryption}
                               value={false}/>
                        <label>None</label>
                    </div>
                    <div className="form-check form-check-inline">
                        <input className="form-check-input stage-select" type="radio"
                               name="inlineRadioOptions" onClick={setEncryption}
                               defaultChecked={props.parentState.is_gcp_encrypt === "true"}

                               value={true}/>
                        <label>GCS_SSE_KMS</label>
                    </div>
                </div>
                {props.parentState.is_gcp_encrypt === "true" ? <div className="form-group col-sm-10">
                    <input type="text"
                           onChange={event => props.setParentState({...props.parentState, gcp_kms: event.target.value})}
                           defaultValue={props.parentState.gcp_kms}
                           className="form-control form-control-sm" placeholder="KMS KEY ID"/>
                </div> : null}

            </div>
        </form>

    )
};