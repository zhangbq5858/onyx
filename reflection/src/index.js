import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Start from './homepage/Start';
import Reg from './homepage/Reg';
import Login from './homepage/Login';
import Reflection from './note/Reflection';
import registerServiceWorker from './registerServiceWorker';
import { Router, Route } from 'react-router-dom';
import createHistory from 'history/createBrowserHistory';

const getConfirmation = (message, callback) => {
    const allowTransition = window.confirm(message)
    callback(allowTransition)
}

const history = createHistory();
const supportsHistory = 'pushState' in window.history;

ReactDOM.render(
    <Router basename='/' forceRefresh={supportsHistory}
        getUserConfirmation={getConfirmation} keyLength={6} history={history}>
        <div>
        <Route exact path='/' component={Start}></Route>
        <Route exact path='/signup' component={Reg}></Route>
        <Route exact path='/signin' component={Login}></Route>
        <Route exact path='/reflection' component={Reflection}></Route>
        </div>
    </Router>, document.getElementById('root'));
 registerServiceWorker();

 export default history;