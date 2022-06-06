import React, {useContext, useState} from "react";
import {store} from "../../store";
// import './navigaton.css'
// import './sidemenu.css';
import {A} from 'hookrouter'


function Navigation(props) {
    const [globalState, dispatch] = useContext(store);
    // let {dispatch} = globalState;
    const [state, setState] = useState({
        is_dropdown: false
    });
    console.log(globalState);
    let onClickDropDown = event => {
        setState({...state, is_dropdown: !state.is_dropdown})
    };
    return (
        <div>
            {/* top navigation */}
            <div className="top_nav">
                <div className="nav_menu">
                    <nav className="nav navbar-nav">
                        <ul className=" navbar-right">
                            <li
                                className={state.is_dropdown ? "nav-item dropdown open show" : "nav-item dropdown open"}
                                style={{
                                    paddingLeft: '15px'
                                }}>
                                <a
                                    onClick={onClickDropDown}
                                    className="user-profile dropdown-toggle"
                                    aria-haspopup="true"
                                    id="navbarDropdown"
                                    data-toggle="dropdown"
                                    aria-expanded="false">

                                    <i class="fa fa-user" aria-hidden="true"></i>
                                    &nbsp;{globalState.user.name}
                                </a>
                                <div
                                    className={state.is_dropdown ? "dropdown-menu dropdown-usermenu pull-right show" : "dropdown-menu dropdown-usermenu pull-right"}
                                    aria-labelledby="navbarDropdown">
                                    <A className="dropdown-item" href="/logout"><i
                                        className="fa fa-sign-out pull-right"/>
                                        Log Out</A>
                                </div>
                            </li>
                            <li role="presentation" className="nav-item dropdown open">
                                <a
                                    href="#"
                                    className="dropdown-toggle info-number"
                                    id="navbarDropdown1"
                                    data-toggle="dropdown"
                                    aria-expanded="false">
                                    <i className="fa fa-bullhorn"/>

                                </a>
                                <ul
                                    className="dropdown-menu list-unstyled msg_list"
                                    role="menu"
                                    aria-labelledby="navbarDropdown1">
                                    <li className="nav-item">
                                        <a className="dropdown-item">
                                            <span className="image">
                                            <img src="images/img.jpg" alt="Profile Image"/></span>
                                            <span>
                                                    <span>John Smith</span>
                                                    <span className="time">3 mins ago</span>
                                                </span>
                                            <span className="message">
                                                    Film festivals used to be do-or-die moments for movie makers. They were where...
                                                </span>
                                        </a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="dropdown-item">
                                            <span className="image"><img src="images/img.jpg"
                                                                         alt="Profile Image"/></span>
                                            <span>
                                                    <span>John Smith</span>
                                                    <span className="time">3 mins ago</span>
                                                </span>
                                            <span className="message">
                                                    Film festivals used to be do-or-die moments for movie makers. They were where...
                                                </span>
                                        </a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="dropdown-item">
                                            <span className="image"><img src="images/img.jpg"
                                                                         alt="Profile Image"/></span>
                                            <span>
                                                    <span>John Smith</span>
                                                    <span className="time">3 mins ago</span>
                                                </span>
                                            <span className="message">
                                                    Film festivals used to be do-or-die moments for movie makers. They were where...
                                                </span>
                                        </a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="dropdown-item">
                                            <span className="image"><img src="images/img.jpg"
                                                                         alt="Profile Image"/></span>
                                            <span>
                                                    <span>John Smith</span>
                                                    <span className="time">3 mins ago</span>
                                                </span>
                                            <span className="message">
                                                    Film festivals used to be do-or-die moments for movie makers. They were where...
                                                </span>
                                        </a>
                                    </li>
                                    <li className="nav-item">
                                        <div className="text-center">
                                            <a className="dropdown-item">
                                                <strong>See All Alerts</strong>
                                                <i className="fa fa-angle-right"/>
                                            </a>
                                        </div>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </div>
    )
}

export default Navigation;