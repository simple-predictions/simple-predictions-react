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
import FeedbackToggle from './FeedbackToggle'
import FeedbackPopup from './FeedbackPopup'
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

const App = () => {
  /*constructor(props) {
    super(props)
    this.state = {
      apiCookie: '',
      displayFeedbackPopup: false,
      alertMessage: '',
      alertVariant: ''
    }

    this.clearApiCookie = this.clearApiCookie.bind(this)
    this.getUserPredictions = this.getUserPredictions.bind(this)
    this.getMiniLeagues = this.getMiniLeagues.bind(this)
    this.toggleFeedbackPopup = this.toggleFeedbackPopup.bind(this)
    this.updateAlertMessage = this.updateAlertMessage.bind(this)
  }
  
  componentDidMount() {
    var apiCookie = Cookies.get('connect.sid')
    if (apiCookie !== '') {
      this.setState({apiCookie: apiCookie})
    }
  }

  clearApiCookie() {
    this.setState({apiCookie: ''})
  }

  getMiniLeagues() {
    var url = base_url+'/minileagues'

    return fetch(url, {credentials: "include"}).then(response => {
      if (response.status === 401) {
        Cookies.remove('connect.sid')
        this.clearApiCookie()
        return []
      }
      return response.json()
    }).then((data) => {
      var final_leagues_arr = []
      for (var i = 0; i < data.length; i++) {
        var league = data[i]
        var members = league['members']
        var usernames = []
        for (var x = 0; x < members.length; x++) {
          var member = members[x]
          var username = member['username']
          usernames.push(username)
        }
        var members_str = usernames.join(', ')
        league['members_str'] = members_str
        final_leagues_arr.push(league)
      }

      return {
        minileagues: final_leagues_arr
      }
    })
  }

  getUserPredictions(gameweek, username) {
    if (username) {
      var url = base_url+'/friendpredictions?username='+username
      if (gameweek) {
        url += '&gameweek='+gameweek
      }
    } else {
      url = base_url+'/getuserpredictions'
      if (gameweek) {
        url += '?gameweek='+gameweek
      }
    }

    return fetch(url, {credentials: "include"}).then(response => {
      if (response.status === 401) {
        Cookies.remove('connect.sid')
        console.log("COOKIE REMOVED")
        this.clearApiCookie()
        return {data: []}
      }
      return response.json()
    }).then((data) => {
      var gameweek_num = data.gameweek
      data = data.data
      var final_games_arr = []
      for (var i = 0; i < data.length; i++) {
        var game = data[i]
        if (game['user_predictions'].length === 0) {
          game['user_predictions'].push({home_pred: '-', away_pred: '-'})
        }
        if (new Date(game['kick_off_time']).getTime() < Date.now()) {
          game['locked'] = true
        } else {
          game['locked'] = false
        }
        game['kick_off_time'] = new Date(game['kick_off_time'])
        final_games_arr.push(game)
      }  

      return {
        gameweek: gameweek_num,
        user_predictions: final_games_arr
      }
    })
  }

  toggleFeedbackPopup() {
    this.setState({
      displayFeedbackPopup: !this.state.displayFeedbackPopup
    })
  }

  updateAlertMessage(message, variant='success') {
    this.setState({
      alertMessage: message,
      alertVariant: variant
    })
  }*/

  const dispatch = useDispatch()

  const [alertVariant, setAlertVariant] = useState()
  const [alertMessage, setAlertMessage] = useState()
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
      {alertMessage && <div className='feedback-success-container'><Alert variant={alertVariant} className='feedback-success' onClose={() => this.setState({alertMessage: ''})} dismissible>{alertMessage}</Alert></div>}
      {/*<FeedbackPopup updateAlertMessage={this.updateAlertMessage} onTogglePopup={this.toggleFeedbackPopup} display={displayFeedbackPopup} />*/}
      <BetaStamp />
      <Router>
        {/*<FeedbackToggle apiCookie={apiCookie} onTogglePopup={this.toggleFeedbackPopup} />*/}
        <Switch>
          {!apiCookie ? <Route path='/'><FrontPage widget={'Login'} /></Route> : null }
          {/*<Route path={'/minileague/:id'} component={(routeProps) => <MiniLeagueTable routeProps={routeProps} clearApiCookie={this.clearApiCookie} />} />*/}
          <Route path='/minileagues'><MiniLeagues /></Route>
          <Route path='/predictions'><Predictions /></Route>
          {/*<Route path='/register'><FrontPage widget={'Register'} /></Route>*/}
          <Route path='/scores'><Scoring /></Route>
          {/*<Route path='/resetpassword'><FrontPage widget={'Reset Password'} updateAlertMessage={this.updateAlertMessage} /></Route>
          <Route path='/createnewpassword' component={(routeProps) => <FrontPage widget={'Create new password'} location={routeProps} updateAlertMessage={this.updateAlertMessage} />}></Route>*/}
          <Route exact path='/'>{apiCookie ? <PageSelector /> : <FrontPage widget={'Login'} />}</Route>
        </Switch>
      </Router>
    </div>
  )
}

export default App;