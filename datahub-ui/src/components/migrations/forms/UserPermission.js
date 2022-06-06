import React, {useContext, useEffect, useState} from "react";
import {get_all_users, get_migration_users, user_permission,delete_user_permission} from "../MigrationService";
import {go} from "../../utils/Utils";
import {Notification} from "react-pnotify";
import {store} from "../../../store";

var cloneDeep = require("lodash.clonedeep");
const UserPermission = (props) => {
    const [globalState, dispatch] = useContext(store);
    const [users_state, setUsersState] = useState({
        unsel_users: [],
        users: [],
        selected_users: [],
        notifications: [],
        acc_users: []
        //is_load:false
    });


    useEffect(() => {
        get_all_users().then(res => {
            console.log(res.data);

            get_migration_users(props.id).then(res1 => {
                console.log(res1.data);
                setUsersState({...users_state, users: res.data, selected_users: res1.data});
            });

        },[]);




    }, []);

    const is_set = (index1) =>
    {



    }


    const onSelect = (event, id) => {
        dispatch({type: 'change loading', payload: true})
        let users1 = [];
        let users2 = [];

        for (let usr in users_state.users) {

            if (document.getElementById("User-" + usr).checked === true && document.getElementById("User-" + usr).disabled === false) {
                document.getElementById("User-" + usr).disabled = true;
                users1.push(users_state.users[usr])

                console.log(users1)

                let u = document.getElementById("User-" + usr).getAttribute('data-key');
                console.log(u);
                users2.push(u);
            }
        }

        user_permission(props.id, {users: users2}).then(res => {
                    if(users2.length>0){
                    setUsersState({
                        ...users_state, notifications: [...users_state.notifications, <Notification
                            type='success'
                            title='Success'
//                            text={reason}
                            delay={1500}
                            shadow={false}
                            hide={true}
                            nonblock={true}
                            desktop={true}
                        />]
                    })
                   }

                }).catch(reason => {
                    console.log(reason);
                    setUsersState({
                        ...users_state, notifications: [...users_state.notifications, <Notification
                            type='error'
                            title='error'
                            text={reason}
                            delay={1500}
                            shadow={false}
                            hide={true}
                            nonblock={true}
                            desktop={true}
                        />]
                    })
                }).finally(() => dispatch({type: 'change loading', payload: false}));



                console.log(users_state.selected_users)
                users1.map((value,index)=>{
                console.log(value)

                 users_state.selected_users.push(value)
                 //setUsersState({...users_state,selected_users:value})
                })

                console.log(users_state.selected_users);
    };

    const onDelete = (event,id) => {
        dispatch({type: 'change loading', payload: true})
        let newState = cloneDeep(users_state);
        console.log(newState);
        let a,index1,a1;
        let dUser=[];
        let deletedUser=[];
        let elements = document.getElementsByClassName("selected-users")
        for(let s of newState.selected_users)
        {
            console.log(s)
            a = newState.selected_users.indexOf(s);
            if(document.getElementById("selectedUser-"+a).checked === true)
            {
              for(let usr of users_state.users)
              {
                  if(s.id === usr.id)
                  {
                     index1 = users_state.users.indexOf(usr)
                    console.log(s.name,index1)
                    console.log(usr.name,a)
                    document.getElementById("User-" + index1).checked = false;
                    document.getElementById("User-" + index1).disabled = false;
                    deletedUser.push(s.id)

                  }
              }

            }
        }
        delete_user_permission(props.id, {users: deletedUser}).then(res => {
                    if(deletedUser.length>0)
                    setUsersState({
                        ...users_state, notifications: [...users_state.notifications, <Notification
                            type='success'
                            title='Successfully deleted'
//                            text={reason}
                            delay={1500}
                            shadow={false}
                            hide={true}
                            nonblock={true}
                            desktop={true}
                        />]
                    })


                }).catch(reason => {
                    console.log(reason);
                    setUsersState({
                        ...users_state, notifications: [...users_state.notifications, <Notification
                            type='error'
                            title='error'
                            text={reason}
                            delay={1500}
                            shadow={false}
                            hide={true}
                            nonblock={true}
                            desktop={true}
                        />]
                    })
                }).finally(() => dispatch({type: 'change loading', payload: false}));

        for(let sel of newState.selected_users)
        {

            let index = newState.selected_users.indexOf(sel);
            if(document.getElementById("selectedUser-"+index).checked === false)
            {
              dUser.push(sel)
              console.log("UncheckedUser",dUser);


            }
        }
        newState.selected_users = dUser;
        console.log(newState.selected_users)
        setUsersState(newState)
        console.log(users_state)
         console.log(newState)

        console.log(users_state.selected_users)

        console.log("deletedUser",deletedUser)


        console.log(users_state.selected_users);

    };

    const onSelectall = (event) => {
        console.log(document.getElementById(event.target.id).checked);
        if (event.target.checked === true) {
            for (let usr in users_state.users) {
                document.getElementById("User-" + usr).checked = true;

            }
        } else {
            for (let usr in users_state.users) {
                document.getElementById("User-" + usr).checked = false;
            }
        }

    };

    const onSelectedall = (event) => {
        if (event.target.checked === true) {
            for (let selectedusr in users_state.selected_users) {
                document.getElementById("selectedUser-" + selectedusr).checked = true;
            }
        } else {
            for (let selectedusr in users_state.selected_users) {
                document.getElementById("selectedUser-" + selectedusr).checked = false;
            }
        }
    };



    return (
        <div className="right_col" role="main" style={{minHeight: 1211}}>
            {users_state.notifications.map(value => value)}
            <div className="pull-right">

                <button href="" className="btn btn-app" onClick={go}>
                    <i class="fa fa-arrow-left"></i>Back
                </button>

            </div>
            <div className="x_panel">
                <div className="x_title"><h2>Select Users</h2>

                    <div className="clearfix"></div>
                </div>
                <div className="x-content" id="db-0">
                    <div className="row table-mapping">
                        <div className="table-responsive" style={{width: "20%"}}>
                            <table className="table table-striped jambo_table bulk_action">
                                <thead>
                                <tr className="headings">
                                    <th>

                                        <div className="icheckbox_flat-green " style={{position: "relative"}}><input
                                            type="checkbox" id="select" className="option-input select-user a-center "
                                            style={{opacity: 1, top: '10', bottom: '10', left: '10', right: '10'}}
                                            onClick={(event) => onSelectall(event)}/>
                                            <ins className="iCheck-helper"
                                                 style={{

                                                     top: '0%',
                                                     left: '0%',
                                                     display: 'block',
                                                     width: '100%',
                                                     height: '100%',
                                                     margin: '0px',
                                                     padding: '0px',


                                                     background: 'rgb(255, 255, 255)',
                                                     border: '0px',
                                                     opacity: '0'
                                                 }}/>
                                        </div>
                                    </th>

                                    <th className="column-title" style={{display: "table-cell"}}>Select Users</th>
                                </tr>
                                </thead>
                                <tbody>
                                {users_state.users.map((value, index) => {
                                        let is_render = true;

                                        for (let user_obj of users_state.selected_users) {
                                            if (user_obj.id === value.id) {
                                                //is_render = false;
                                                //console.log(document.getElementById("User-" + index))

                                                //break
                                            }
                                        }
                                        if (is_render === true) {
                                            return (<tr key={value.id} className="even pointer">
                                                <td className="a-center ">
                                                    <div className="icheckbox_flat-green" style={{position: "relative"}}>
                                                        <input
                                                            type="checkbox" className="option-input select-users"
                                                            name="table_records"
                                                            id={"User-" + index}
                                                            style={{top: '10', bottom: '10', left: '10', right: '10'}}

                                                            data-key={value.id}
                                                            value={value.name}
                                                            defaultChecked ={is_set(index)}
                                                            Disabled ={is_set(index)} default
                                                            style={{position: "absolute", opacity: 1}}/>
                                                        <ins className="iCheck-helper"
                                                             data-key={value}
                                                             style={{
                                                                 position: 'absolute',
                                                                 top: '0%',
                                                                 left: '0%',
                                                                 display: 'block',
                                                                 width: '100%',
                                                                 height: '100%',
                                                                 margin: '0px',
                                                                 padding: '0px',
                                                                 background: 'rgb(255, 255, 255)',
                                                                 border: '0px',
                                                                 opacity: '0'
                                                             }}/>
                                                    </div>
                                                </td>
                                                <td className=" ">{value.name}</td>
                                            </tr>)
                                        } else {
                                            return null;
                                        }
                                    }
                                )}
                                </tbody>
                            </table>
                        </div>
                        <div className="btn-group-vertical">
                            <ul className="list-unstyled anchor" style={{paddingTop: '60px', lineHeight: '50px'}}>
                                <li>
                                    <button href="#step-11" className="btn btn-round" isdone="1" rel="1"
                                            onClick={(event, id) => onSelect(event, id)}><i
                                        className="fa fa-arrow-circle-right fa-lg"></i></button>
                                </li>
                                <li>
                                    <button href="#step-11" className="btn btn-round" isdone="1" rel="1"
                                            onClick={(event, index) => onDelete(event, index)}><i
                                        className="fa fa-arrow-circle-left fa-lg"></i></button>
                                </li>
                            </ul>
                        </div>
                        <div className="table-responsive" style={{width: "20%"}}>
                            <table className="table table-striped jambo_table bulk_action">
                                <thead>
                                <tr className="headings">
                                    <th>
                                        <div className="icheckbox_flat-green " style={{position: "relative"}}><input
                                            type="checkbox" id="select" className="option-input select-user a-center "
                                            style={{opacity: 1, top: '10', bottom: '10', left: '10', right: '10'}}
                                            onClick={(event) => onSelectedall(event)}/>
                                            <ins className="iCheck-helper"
                                                 style={{

                                                     top: '0%',
                                                     left: '0%',
                                                     display: 'block',
                                                     width: '100%',
                                                     height: '100%',
                                                     margin: '0px',
                                                     padding: '0px',
                                                     background: 'rgb(255, 255, 255)',
                                                     border: '0px',
                                                     opacity: '0'
                                                 }}/>
                                        </div>
                                    </th>
                                    <th className="column-title" style={{display: 'table-cell'}}>Selected Users
                                    </th>
                                </tr>
                                </thead>
                                <tbody>
                                {users_state.selected_users.map((value, index) =>

                                    <tr key={value.id} className="pointer">
                                        <td className="a-center ">
                                            <div className="icheckbox_flat-green " style={{position: "relative"}}>
                                                <input
                                                    type="checkbox" className="option-input selected-users"
                                                    name="table_records"
                                                    id={"selectedUser-" + index}
                                                    value={value.name}
                                                    data-key={value.id}
                                                    style={{position: "absolute", opacity: 1}}/>
                                                <ins className="iCheck-helper"
                                                     data-key={value.id}

                                                     style={{
                                                         position: 'absolute',
                                                         top: '0%',
                                                         left: '0%',
                                                         display: 'block',
                                                         width: '100%',
                                                         height: '100%',
                                                         margin: '0px',
                                                         padding: '0px',
                                                         background: 'rgb(255, 255, 255)',
                                                         border: '0px',
                                                         opacity: '0'
                                                     }}/>
                                            </div>
                                        </td>
                                        <td className="">{value.name}

                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default UserPermission;