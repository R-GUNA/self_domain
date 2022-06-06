import {EXTERNAL_AWS_TYPE, EXTERNAL_AZURE_TYPE, EXTERNAL_GCP_TYPE, IS_EXT, IS_STAGE} from "../../utils/Constants";

export let handle_validate = (state, setState, type) => {
    let validate_funct = {
        "connection": validate_choose_connection,
        "dbmapping": validate_database_mapping
    };
    let response = validate_funct[type](state);
    if (response === true && state.alert !== false) {
        setState({...state, alert: false, form_error: null});
    } else if (state.form_error !== response) {
        setState({...state, alert: true, form_error: response});
    }
};

export let validate_choose_connection = (state) => {
    if (state.name === "") {
        return "No Migration Name"
    }
    if (state.source_connection === "") {
        return "Select Source Connection"
    }
    if (state.target_connection === "") {
        return "Select Target Connection"
    }
    let storage_cred_valid_func = {
        [EXTERNAL_AWS_TYPE]: validate_aws_form,
        [EXTERNAL_GCP_TYPE]: validate_gcp_form,
        [EXTERNAL_AZURE_TYPE]: validate_azure_form
    };
    if (state.stage_type === IS_EXT) {
        let is_storage_cred_valid = storage_cred_valid_func[state.ext_integration](state);
        if (is_storage_cred_valid !== null) {
            return is_storage_cred_valid
        }
    }
    if (state.stage_type === IS_STAGE) {
        if (state.hasOwnProperty("stage_name") === false || state.stage_name === "") {
            return "Add Stage Name"
        }
        if (state.hasOwnProperty("stage_schema") === false || state.stage_schema === "") {
            return "Add Stage Schema"
        }
        if (state.hasOwnProperty("stage_db") === false || state.stage_db === "") {
            return "Add Stage DB"
        }
    }
    if(state.mig_time_window === 'true')
    {
       if(state.sch_start_time === null ){

           return "Schedule start time"
       }
       if(state.sch_end_time === null){
           return "Schedule end time"
       }
    }



    return null
};

let validate_gcp_form = (state) => {
    if (state.hasOwnProperty("gcp_url") === false || state.gcp_url === "") {
        return "Add GCP URL"
    }
    if (state.hasOwnProperty("gcp_file") === false) {
        return "Enter GCP SERVICE Account File"
    }
    if (state.hasOwnProperty("gcp_stg_int") === false || state.gcp_stg_int === "") {
        return "Enter GCP Storage Integration"
    }
    if (state.is_gcp_encrypt === "true") {
        if (state.hasOwnProperty("gcp_kms") === false || state.gcp_kms === "") {
            return "Add GCP KMS Key"
        }
    }
    return null
};

let validate_azure_form = (state) => {
    if (state.hasOwnProperty("azure_url") === false || state.azure_url === "") {
        return "Add Azure Url"
    }
    if (state.hasOwnProperty("azure_sas") === false || state.azure_sas === "") {
        return "Add Add Azure SAS"
    }
    return null
};

let validate_aws_form = (state) => {
    if (state.hasOwnProperty("aws_url") === false || state.aws_url === "") {
        return "Add AWS url"
    }

    if (state.hasOwnProperty("aws_id") === false || state.aws_id === "") {
            return "Add AWS KEY ID"
    }
    if (state.hasOwnProperty("aws_secret") === false || state.aws_secret === "") {
            return "Add AWS Secret Key"
    }
    return null
};

export let validate_database_mapping = (state) => {


    if (state.mapped_databases.length === 0) {
        console.log(state.mapped_databases);
        return "Add Database";
        console.log(state);
    }
    return null
};

export let validate_schema_mapping = (state) => {

    if (Object.keys(state.mapped_schema).length === 0) {
        console.log(state.mapped_schema);
        return "Add Schema"
    } else
        return null
};


