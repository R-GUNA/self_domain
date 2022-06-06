import React from "react";

export let Notification = (props) => {
    if (props.globalState.notification) {
        return (
            <Notification
                type={props.globalState.status}
                title={props.globalState.status}
                text={props.globalState.error_text}
                delay={1500}
                shadow={false}
                hide={true}
                nonblock={true}
                desktop={true}/>
        );
    } else {
        return null;
    }
};