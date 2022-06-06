import {RequestConfig} from "../utils/Constants";
import axios from "axios";

export let get_target_database = (data) => {
    let token = localStorage.getItem("user_token");
    RequestConfig.headers.Authorization = "token " + token;
    return axios({
        method: "get",
        url: process.env.REACT_APP_API_URL + "/fetch_tgt_dbs/",
        params: data,
        headers: RequestConfig.headers
    });
};

export let get_target_schema = (data) => {
    let token = localStorage.getItem("user_token");
    RequestConfig.headers.Authorization = "token " + token;
    return axios({
        method: "get",
        url: process.env.REACT_APP_API_URL + "/fetch_tgt_schemas/",
        params: data,
        headers: RequestConfig.headers
    });
};

export let get_target_tables = (data) => {
    let token = localStorage.getItem("user_token");
    RequestConfig.headers.Authorization = "token " + token;
    return axios({
        method: "get",
        url: process.env.REACT_APP_API_URL + "/fetch_tgt_tables/",
        params: data,
        headers: RequestConfig.headers
    });
};

export let create_migration = (data) => {
    let token = localStorage.getItem("user_token");
    RequestConfig.headers.Authorization = "token " + token;
    return axios.post(process.env.REACT_APP_API_URL + "/create_file_migration/", data, RequestConfig)
};

export let run_file_migration = (mig_id)=> {
    let token = localStorage.getItem("user_token");
    RequestConfig.headers.Authorization = "token " + token;
    return axios.get(process.env.REACT_APP_API_URL + "/run_file_migration/" + mig_id, RequestConfig)
};

export let show_file_migration = (mig_id) => {
    let token = localStorage.getItem("user_token");
    RequestConfig.headers.Authorization = "token " + token;
    return axios.get(process.env.REACT_APP_API_URL + "/show_file_migration/" + mig_id, RequestConfig)
};