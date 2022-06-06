import {RequestConfig} from "../utils/Constants";
import axios from "axios";


export let cloneMigration = (data) => {
    let token = localStorage.getItem("user_token");
    RequestConfig.headers.Authorization = "token " + token;
    return axios.post(process.env.REACT_APP_API_URL + "/clonemig/", data, RequestConfig)
};

export let MigrationLogs = (mig_id) => {
    let token = localStorage.getItem("user_token");
    RequestConfig.headers.Authorization = "token " + token;
    RequestConfig.params = {"mig_id": mig_id};
    return axios.get(`${process.env.REACT_APP_API_URL}/migrationlog/`, RequestConfig)
};