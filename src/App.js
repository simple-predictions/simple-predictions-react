import React, {useState} from 'react';
import './App.css';
import FrontPage from './FrontPage'
import PageSelector from './PageSelector'
import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import Cookies from 'js-cookie'
import Predictions from './Predictions/Predictions'
import MiniLeagues from './MiniLeagues/MiniLeagues'
import MiniLeagueTable from './MiniLeagues/MiniLeagueTable'
import Scoring from './Scoring/Scoring'
import FeedbackToggle from './Feedback/FeedbackToggle'
import FeedbackPopup from './Feedback/FeedbackPopup'
import {Alert} from 'react-bootstrap'
import base_url from './globals'

import {getUserInfo, selectLoggedIn} from './User/userSlice'
import {getPredictions} from './Predictions/predictionsSlice'
import {getMinileagues} from './MiniLeagues/minileaguesSlice'
import {getScoredPreds} from './Scoring/scoringSlice'
import {useDispatch, useSelector} from 'react-redux'

// eslint-disable-next-line
import * as Sentry from '@sentry/browser';
import BetaStamp from './BetaStamp';
import { selectAlertVariant, selectAlertMessage, clearAlert } from './Alerts/alertsSlice';

const App = () => {
  const dispatch = useDispatch()

  const alertVariant = useSelector(selectAlertVariant)
  const alertMessage = useSelector(selectAlertMessage)

  const [displayFeedbackPopup, setDisplayFeedbackPopup] = useState(false)
  const apiCookie = useSelector(selectLoggedIn)

  if (apiCookie) {
    dispatch(getPredictions())
    dispatch(getMinileagues())
    dispatch(getScoredPreds([]))
  } else {
    dispatch(getUserInfo())
  }

  return(
    <div>
      {alertMessage && <div className='feedback-success-container'><Alert variant={alertVariant} className='feedback-success' onClose={() => dispatch(clearAlert())} dismissible>{alertMessage}</Alert></div>}
      <FeedbackPopup />
      <BetaStamp />
      <Router>
        <FeedbackToggle apiCookie={apiCookie} />
        <Switch>
          {/*!apiCookie ? <Route path='/'><FrontPage widget={'Login'} /></Route> : null */}
          {/*<Route path={'/minileague/:id'} component={(routeProps) => <MiniLeagueTable routeProps={routeProps} clearApiCookie={this.clearApiCookie} />} />*/}
          {apiCookie && <Route path='/minileagues'><MiniLeagues /></Route>}
          {apiCookie &&<Route path='/predictions'><Predictions /></Route>}
          {apiCookie &&<Route path='/scores'><Scoring /></Route>}
          <Route path='/register'><FrontPage widget={'Register'} /></Route>
          <Route path='/resetpassword'><FrontPage widget={'Reset Password'} /></Route>
          <Route path='/createnewpassword' component={(routeProps) => <FrontPage widget={'Create new password'} location={routeProps} />}></Route>
          <Route exact path='/'>{apiCookie ? <PageSelector /> : <FrontPage widget={'Login'} />}</Route>
        </Switch>
      </Router>
    </div>
  )
}

export default App;