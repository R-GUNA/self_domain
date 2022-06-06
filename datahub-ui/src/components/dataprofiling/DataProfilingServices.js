import axios from "axios"
import {RequestConfig} from "../utils/Constants";

export let get_columns_table = (data) => {
    let token = localStorage.getItem("user_token");
    RequestConfig.headers.Authorization = "token " + token;
    return axios.post(process.env.REACT_APP_API_URL + "/showcols/", data, RequestConfig);
};

export let save_columns_table = (data) => {
    let token = localStorage.getItem("user_token");
    RequestConfig.headers.Authorization = "token " + token;
    return axios.put(process.env.REACT_APP_API_URL + "/updatecol/", data, RequestConfig)
};

export let update_profile = (data) => {
    let token = localStorage.getItem("user_token");
    RequestConfig.headers.Authorization = "token " + token;
    return axios.put(process.env.REACT_APP_API_URL + "/updateprofile/", data, RequestConfig)
};

export let get_schema_table = (data) => {
    let token = localStorage.getItem("user_token");
    RequestConfig.headers.Authorization = "token " + token;
    return axios.get(process.env.REACT_APP_API_URL + "/gettables/", {params: data}, RequestConfig)
};

export let add_schema_table = (data) => {
    let token = localStorage.getItem("user_token");
    RequestConfig.headers.Authorization = "token " + token;
    return axios.post(process.env.REACT_APP_API_URL + "/addtables/", data, RequestConfig)
};

export let delete_schema_table = (data) => {
    let token = localStorage.getItem("user_token");
    RequestConfig.headers.Authorization = "token " + token;
    return axios.delete(process.env.REACT_APP_API_URL + "/deltable/", {params: data}, RequestConfig)

};

export let start_column_validation = (mig_id)=>{
    let token = localStorage.getItem("user_token");
    RequestConfig.headers.Authorization = "token " + token;
    return axios.put(process.env.REACT_APP_API_URL + "/start_column_validation/"+mig_id,RequestConfig);
}