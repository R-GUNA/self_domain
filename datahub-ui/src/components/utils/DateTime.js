import Moment from "react-moment";
import React from "react";

let DateTime = (props) => {
    if (props.datetime) {
        return (
            <time><Moment format="HH:mm DD/MM/YYYY" date={props.datetime} local/></time>
        )
    } else {
        return (
            <p>-</p>
        )
    }
};

export default DateTime