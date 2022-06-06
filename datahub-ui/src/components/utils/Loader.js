import PropagateLoader from "react-spinners/PropagateLoader";
import React from "react";

function Loader(props) {
    return (
        <div className={props.loading ? "loader-box" : null}>
            <PropagateLoader
                sizeUnit={"px"}
                size={15}
                color={'#57b2ff'}
                loading={props.loading}
            /></div>
    )
}

export default Loader