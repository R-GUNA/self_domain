import {EXTERNAL_AWS_TYPE, EXTERNAL_AZURE_TYPE, EXTERNAL_GCP_TYPE, IS_EXT, IS_STAGE} from "../../utils/Constants";
import {AwsForm} from "./AwsForm";
import React from "react";
import {GcpForm} from "./GcpForm";
import {AzureForm} from "./AzureForm";
import {StageForm} from "./StageForm";

export let ExtIntForm = (props) => {
    if (props.stage_type === IS_EXT) {
        if (props.ext_int === EXTERNAL_AWS_TYPE) {
            return (<AwsForm parentState={props.parentState} setParentState={props.setParentState}/>)
        } else if (props.ext_int === EXTERNAL_GCP_TYPE) {
            return (<GcpForm parentState={props.parentState} setParentState={props.setParentState}/>)
        } else if (props.ext_int === EXTERNAL_AZURE_TYPE) {
            return (<AzureForm parentState={props.parentState} setParentState={props.setParentState}/>)
        }
    }
    if (props.stage_type === IS_STAGE) {
        return (<StageForm parentState={props.parentState} setParentState={props.setParentState}/>)
    }
    return null
};