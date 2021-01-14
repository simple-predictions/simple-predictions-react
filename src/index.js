import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as Sentry from '@sentry/browser';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { Provider, useDispatch } from 'react-redux'
import store from './store/store'

const environment = process.env.NODE_ENV || 'development';

Sentry.init({dsn: "https://0c405d571e4a4582b1cc30e23089964f@o342120.ingest.sentry.io/5267310", environment: environment})

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
