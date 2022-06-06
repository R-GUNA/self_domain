import React, {createContext} from "react";

const store = createContext({
    is_loading:false,
    status:"",
    error_text:"",
    user:{}
});

const reducer = (state,action) => {
    switch (action.type) {
        case 'save user':
            return {...state, user: action.payload};
        case 'change loading':
            return {...state, is_loading: action.payload};
        // case 'raise notification':
        //     return {...state,notification:action.payload.notification,
        //         status:action.payload.status,error_text:action.payload.error_text};
        default:
            throw new Error("This error");
    }
};
const StateProvider = ({reducer ,initialState, children}) => {
    return <store.Provider value={reducer}>{children}</store.Provider>
};

export {store, StateProvider , reducer}