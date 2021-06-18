import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Alert } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { gql, useQuery } from '@apollo/client';
import * as Sentry from '@sentry/react';

import { getUserInfo, selectLoggedIn } from './User/userSlice';
import { getMinileagues } from './MiniLeagues/minileaguesSlice';

import Predictions from './Predictions/Predictions';
import MiniLeagues from './MiniLeagues/MiniLeagues';
import Scoring from './Scoring/Scoring';
import FeedbackToggle from './Feedback/FeedbackToggle';
import FeedbackPopup from './Feedback/FeedbackPopup';
import FrontPage from './FrontPage';
import PageSelector from './PageSelector';
import ResetPassword from './ResetPassword';
import CreateNewPassword from './CreateNewPassword';

import BetaStamp from './BetaStamp';
import { selectAlertVariant, selectAlertMessage, clearAlert } from './Alerts/alertsSlice';

const App = () => {
  const dispatch = useDispatch();

  const alertVariant = useSelector(selectAlertVariant);
  const alertMessage = useSelector(selectAlertMessage);
  const apiCookie = useSelector(selectLoggedIn);

  if (apiCookie) {
    dispatch(getMinileagues());
  } else {
    dispatch(getUserInfo());
  }

  const QUERY = gql`
  query {
    findGameweek {
      number
    }
  }`;

  useQuery(QUERY);

  return (
    <div>
      {alertMessage && <div className="feedback-success-container"><Alert variant={alertVariant} className="feedback-success" onClose={() => dispatch(clearAlert())} dismissible>{alertMessage}</Alert></div>}
      <FeedbackPopup />
      <BetaStamp />
      <Router>
        <FeedbackToggle apiCookie={apiCookie} />
        <Switch>
          {apiCookie && <Route path="/minileagues"><MiniLeagues /></Route>}
          {apiCookie && <Route path="/predictions"><Predictions /></Route>}
          {apiCookie && <Route path="/scores"><Scoring /></Route>}
          <Route path="/register"><FrontPage widget="Register" /></Route>
          <Route path="/resetpassword"><ResetPassword /></Route>
          <Route path="/createnewpassword" component={(routeProps) => <CreateNewPassword location={routeProps.location} />} />
          <Route path="/">{apiCookie ? <PageSelector /> : <FrontPage widget="Login" />}</Route>
        </Switch>
      </Router>
    </div>
  );
};

export default Sentry.withProfiler(App);
