import React, {useContext, useState} from 'react';
// import './sidemenu.css';
import {store} from "../../store";
import {A, usePath} from 'hookrouter'

import logo_datahub from '../../assets/images/logo_datahub.png';


function Sidebar() {
    const [globalState, dispatch] = useContext(store);
    const path = usePath();

    var [State, setState] = useState(
        {
            Connections: false,
            Migrations: false,
            Users: false
        }
    );
    let nav_toggle = evt => {
        let sel_ele = evt.target;
        if (evt.target.text === undefined) {
            sel_ele = sel_ele.parentElement;
        }

        let status = State[sel_ele.text];
        setState({[sel_ele.text]: !status})
    };

    return (
        <div>
            <div className="left_col scroll-view">
                <div className="navbar nav_title" style={{
                    border: 0
                }}>
                    <img src={logo_datahub} alt="..." style={{width: 228, height: 55}}/>

                </div>
                <div className="clearfix"/>
                <div id="sidebar-menu" className="main_menu_side hidden-print main_menu">
                    <div className="menu_section">
                        {/*<h3>General</h3>*/}
                        <ul className="nav side-menu">
                            <li className={path === "/" ? "active" : null}>
                                <A href="/"><i className="fa fa-home"/>Home</A>
                            </li>
                            {globalState.user.isadmin ?
                                <li className={State.Users ? 'active' : null}>
                                    <a onClick={nav_toggle}><i className="fa fa-users"/>Users
                                        <span className='fa fa-chevron-down'/></a>
                                    <ul className={State.Users ? "nav child_menu animate fadeInDown dropdown-down-ul" : "nav child_menu animate fadeOutUp dropdown-up-ul"}>
                                        <li>
                                            <A href="/auth">Create User</A>
                                        </li>
                                        <li>
                                            <A href="/view">View Users</A>
                                        </li>

                                    </ul>
                                </li> : null
                            }
                            <li className={State.Connections ? 'active' : null}>
                                <a onClick={nav_toggle}><i className="fa fa-link"/>Connections
                                    <span className='fa fa-chevron-down'/></a>
                                <ul className={State.Connections ? "nav child_menu animate fadeInDown dropdown-down-ul" : "nav child_menu animate fadeOutUp dropdown-up-ul"}>
                                    <li>
                                        <A href="/createconnections">Create Connection</A>
                                    </li>
                                    <li>
                                        <A href="/viewconnections">View Connections</A>
                                    </li>

                                </ul>
                            </li>
                            <li className={State.Migrations ? 'active' : null}>
                                <A href="#" onClick={nav_toggle}><i className="fa fa-database"/>Migrations
                                    <span className='fa fa-chevron-down'/></A>
                                <ul className={State.Migrations ? "nav child_menu animate fadeInDown dropdown-down-ul" : "nav child_menu animate fadeOutUp dropdown-up-ul"}>
                                    <li style={{listStyleType: "none"}}>
                                        <A href="/migration/configure/database">Configure Database</A>
                                    </li>
                                    <li style={{listStyleType: "none"}}>
                                        <A href="/migration/configure/file">Configure File</A>
                                    </li>
                                    <li style={{listStyleType: "none"}}>
                                        <A href="/migration/metadataprofiling">Metadata Validation</A>
                                    </li>
                                    <li style={{listStyleType: "none"}}>
                                        <A href="/migration/status">Execution & Status</A>
                                    </li>
                                    <li style={{listStyleType: "none"}}>
                                        <A href="/migration/validation">Post Validation</A>
                                    </li>
                                </ul>
                            </li>


                        </ul>
                    </div>
                </div>
                {/* /sidebar menu */}
                {/* /menu footer buttons */}
            </div>

        </div>
    );


}

export default Sidebar;