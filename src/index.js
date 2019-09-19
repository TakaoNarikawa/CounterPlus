import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Result from './Result';
import * as serviceWorker from './serviceWorker';
import {
    BrowserRouter,
    Route,
    Link
} from 'react-router-dom'

const Router = () => (
    <BrowserRouter>
        <div>
            <Route exact path='/' component={App} />
            <Route path='/result' component={Result} />
        </div>
    </BrowserRouter>
)

ReactDOM.render(<Router />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
