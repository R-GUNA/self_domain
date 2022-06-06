import {RequestConfig} from "../utils/Constants";
import axios from "axios";


export const get_tables_col = (pk) => {
    let token = localStorage.getItem("user_token");
    RequestConfig.headers.Authorization = "token " + token;
    return axios.get(process.env.REACT_APP_API_URL + "/getdatecols/" + pk)
};

export const save_tables_col = (data) => {
    let token = localStorage.getItem("user_token");
    RequestConfig.headers.Authorization = "token " + token;
    return axios.post(process.env.REACT_APP_API_URL + "/savedatecols/", data, RequestConfig)
};