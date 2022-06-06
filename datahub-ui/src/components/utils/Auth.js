import axios from 'axios'
import {RequestConfig} from "./Constants";

export default class Auth {
    check_auth = () => {
        let token = localStorage.getItem("user_token");
        if (token !== null) {
            return true
        } else {
            return false
        }
    };

    get_profile = () => {
        let token = localStorage.getItem("user_token");
        let headerConfig = RequestConfig;
        headerConfig.headers.Authorization = "token " + token;
        var url = process.env.REACT_APP_API_URL + "/getprofile/";
        return axios.get(url, headerConfig);

    };
    do_auth = (username, password) => {
        var url = process.env.REACT_APP_API_URL + "/generatetoken/";
        let postData = {
            username: username,
            password: password
        };
        return axios.post(url, JSON.stringify(postData), RequestConfig)
    };

    do_signup = (data) => {
        var url = process.env.REACT_APP_API_URL + "/create/";
        return axios.post(url, JSON.stringify(data), RequestConfig);

    };

    do_logout = (id) => {
        var url = process.env.REACT_APP_API_URL + "/logout/" + "?id=" + id;
        return axios.get(url, RequestConfig);
    }
}