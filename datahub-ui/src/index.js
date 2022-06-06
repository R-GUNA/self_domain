import React, {useReducer} from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/app/App';
import 'animate.css'
import '@fortawesome/fontawesome-free'
import {StateProvider, reducer} from "./store";
import * as serviceWorker from './serviceWorker';

const IndexApp = () => {
    const initialState = {
        is_loading:false,
        user:{},
        notification:false,
        status:"",
        error_text:"",
    };
    return(<StateProvider initialState={initialState} reducer={useReducer(reducer, initialState)}>
        <App/>
    </StateProvider>)
};
ReactDOM.render(<IndexApp /> ,document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA

serviceWorker.register();
