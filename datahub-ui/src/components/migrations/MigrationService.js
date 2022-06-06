import axios from "axios";
import {RequestConfig} from "../utils/Constants";


export let get_connections = () => {
    let token = localStorage.getItem("user_token");
    RequestConfig.headers.Authorization = "token " + token;
    return axios.get(process.env.REACT_APP_API_URL + "/fetchconns/", RequestConfig);
};

export let get_databases = (data) => {
    let token = localStorage.getItem("user_token");
    RequestConfig.headers.Authorization = "token " + token;
    return axios({
        method: "get",
        url: process.env.REACT_APP_API_URL + "/fetchdbs/",
        params: data,
        headers: RequestConfig.headers
    });
};

export let get_schemas = (data) => {
    let token = localStorage.getItem("user_token");
    RequestConfig.headers.Authorization = "token " + token;
    return axios.post(process.env.REACT_APP_API_URL + "/fetchschemas/", data, RequestConfig)
};

export let get_tables = (data) => {
    let token = localStorage.getItem("user_token");
    RequestConfig.headers.Authorization = "token " + token;
    return axios.post(process.env.REACT_APP_API_URL + "/fetchtables/", data, RequestConfig)
};

export let check_migration = (name) => {
    let token = localStorage.getItem("user_token");
    RequestConfig.headers.Authorization = "token " + token;
    return axios({
        method: "get",
        url: process.env.REACT_APP_API_URL + "/check_migration/",
        params: {name:name},
        headers: RequestConfig.headers
    });
}

export let create_migration = (data) => {
    let token = localStorage.getItem("user_token");
    RequestConfig.headers.Authorization = "token " + token;
    return axios.post(process.env.REACT_APP_API_URL + "/createmig/", data, RequestConfig)
};

export let get_migrations = (token, status_code = "[]" , mig_type=null) => {
    RequestConfig.headers.Authorization = "token " + token;
    // if (status_code.length > 0) {
    //     let local_config = Object.assign({}, RequestConfig);
    //     local_config.params = {status_code: status_code};
    //     return axios.get(process.env.REACT_APP_API_URL + "/listmig/", local_config);
    // }
    let local_config = Object.assign({}, RequestConfig);
    local_config.params = {status_code: status_code};
    if (mig_type){
        local_config.params.mig_type=mig_type;
    }
    // return axios.get(process.env.REACT_APP_API_URL + "/listmig/", local_config);
    return axios.get(process.env.REACT_APP_API_URL + "/listmig/", local_config);
};
export let start_migration = (id) => {
    let token = localStorage.getItem("user_token");
    RequestConfig.headers.Authorization = "token " + token;

    return axios.get(process.env.REACT_APP_API_URL + "/startmig/" + id, RequestConfig)
};

export let get_all_users = () => {
    let token = localStorage.getItem("user_token");
    RequestConfig.headers.Authorization = "token " + token;

    return axios.get(process.env.REACT_APP_API_URL + "/getallusers/?", RequestConfig)
};

export let get_show_migration = (id) => {
    let token = localStorage.getItem("user_token");
    RequestConfig.headers.Authorization = "token " + token;

    return axios.get(process.env.REACT_APP_API_URL + "/showmig/" + id, RequestConfig)

};

export let get_logs = (mig_id) => {
    let token = localStorage.getItem("user_token");
    RequestConfig.headers.Authorization = "token " + token;

    return axios.get(process.env.REACT_APP_API_URL + "/getlogs/" + mig_id, RequestConfig)
};

export let get_error_details = (log_id) => {
    let token = localStorage.getItem("user_token");
    RequestConfig.headers.Authorization = "token " + token;
    return axios.get(process.env.REACT_APP_API_URL + "/logdetails/" + log_id, RequestConfig)
};

export let get_count_migrations = () => {
    let token = localStorage.getItem("user_token");
    RequestConfig.headers.Authorization = "token " + token;
    return axios.get(process.env.REACT_APP_API_URL + "/countdetail/", RequestConfig)
};

export let run_validation_api = (mig_id) => {
    let token = localStorage.getItem("user_token");
    RequestConfig.headers.Authorization = "token " + token;
    return axios.get(process.env.REACT_APP_API_URL + "/validateMigration/" + mig_id, RequestConfig)
};

export let user_permission = (mig_id, data) => {
    let token = localStorage.getItem("user_token");
    RequestConfig.headers.Authorization = "token " + token;
    return axios.put(process.env.REACT_APP_API_URL + "/permission/" + mig_id, data, RequestConfig)
};

export let delete_user_permission = (mig_id, data) => {
    let token = localStorage.getItem("user_token");
    RequestConfig.headers.Authorization = "token " + token;
    return axios.delete(process.env.REACT_APP_API_URL + "/permission/" + mig_id, {data:data}, RequestConfig)
};


export let get_migration_users = (mig_id) => {
    let token = localStorage.getItem("user_token");
    RequestConfig.headers.Authorization = "token " + token;
    return axios.get(process.env.REACT_APP_API_URL + "/getmigrationusers/" + mig_id, RequestConfig)
};

