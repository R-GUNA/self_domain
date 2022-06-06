import React, {useContext, useState} from 'react';
import {store} from "../../store";
import axios from "axios";

function Lostpswd(props) {
    const [globalState, dispatch] = useContext(store);
    const [lostState, setLostState] = useState({
        p1: "",
        p2: ""
    });

    const handleOnSubmit = (event) => {
        if (lostState.p1 === lostState.p2) {
            let url = process.env.REACT_APP_API_URL + '/updateuser/' + globalState.user.id;
            axios.put(lostState, {password: lostState.p1})
        } else
            alert("mismatch");
    };

    return (
        <div className="login_wrapper">
            <div className="animated fadeInRight form ">

                <section className="login_content">
                    <form onSubmit={event => handleOnSubmit(event)}>

                        <h1 className="animate">Reset password</h1>
                        <div>
                            <input type="password" name="p1" className="form-control" placeholder="enter new password"
                                   onChange={event => setLostState(Object.assign(lostState, {p1: event.target.value}))}
                                   required/>
                        </div>
                        <div>
                            <input type="password" name="p2" className="form-control" placeholder="confirm password"
                                   onChange={event => setLostState(Object.assign(lostState, {p2: event.target.value}))}
                                   required/>
                        </div>
                        <div>

                            <button type="submit" className="btn btn-primary">Reset</button>
                        </div>

                        <div className="clearfix"></div>


                    </form>
                </section>
            </div>
        </div>

    );
}

export default Lostpswd;