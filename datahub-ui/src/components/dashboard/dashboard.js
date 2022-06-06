import "../utils/custom.css"
import Sidebar from "../sidemenu/sidemenu";
import Navigation from "../navigation/navigation";
import React from "react";

export default function Dashboard(props) {
    return (
        <div className="nav-md">
            <div className="container body">
                <div className="main_container">
                    <div className="col-md-3 left_col">
                        <Sidebar/>
                    </div>
                    <Navigation/>
                    <div>
                        {props.routeResult}
                    </div>
                </div>
            </div>
        </div>
    )
}