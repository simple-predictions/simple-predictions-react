import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';
import { Provider } from 'react-redux';
import LogRocket from 'logrocket';
import setupLogRocketReact from 'logrocket-react';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import App from './App';
import * as serviceWorker from './serviceWorker';
import store from './store/store';
import baseUrl from './globals';

const environment = process.env.NODE_ENV || 'development';

LogRocket.init(`simple-predictions/react-${environment}`);
setupLogRocketReact(LogRocket);

Sentry.init({
  dsn: 'https://0c405d571e4a4582b1cc30e23089964f@o342120.ingest.sentry.io/5267310',
  environment,
  normalizeDepth: 10,
  integrations: [new Integrations.BrowserTracing({
    tracingOrigins: ['192.168.0.22:5000', '192.168.0.22', 'api.saltbeefleague.co.uk'],
  })],
  tracesSampleRate: 1.0,
});

LogRocket.getSessionURL((sessionURL) => {
  Sentry.setTag('logrocket', sessionURL);
});

const client = new ApolloClient({
  uri: `${baseUrl}/graphql`,
  cache: new InMemoryCache(),
  credentials: 'include',
});

ReactDOM.render(
  <Provider store={store}>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </Provider>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
