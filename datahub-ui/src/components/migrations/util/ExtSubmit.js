export let aws_submit = (requestData, state) => {
    requestData.aws_url = state.aws_url;
    requestData.aws_id = state.aws_id;
    requestData.aws_secret = state.aws_secret;
    return requestData;
};


export let gcp_submit = (requestData, state) => {
    requestData.gcp_url = state.gcp_url;
    requestData.gcp_service_json = state.gcp_file.data;
    requestData.gcp_stg_int = state.gcp_stg_int;
    if (state.is_gcp_encrypt === "true") {
        requestData.is_gcp_encrypt = true;
        requestData.gcp_kms = state.gcp_kms;
    } else {
        requestData.is_gcp_encrypt = false;
    }
    return requestData
};


export let database_submit = (requestData, state) => {
    requestData.mapped_databases = state.mapped_databases;
    return requestData
};

export let azure_submit = (requestData, state) => {
    requestData.azure_url = state.azure_url;
    requestData.azure_sas = state.azure_sas;
    return requestData;
};