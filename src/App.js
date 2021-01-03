import React from 'react';
import './App.css';
import FrontPage from './FrontPage'
import LoginPage from './LoginPage'
import PageSelector from './PageSelector'
import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import Cookies from 'js-cookie'
import Predictions from './Predictions'
import MiniLeagues from './MiniLeagues'
import MiniLeagueTable from './MiniLeagueTable'
import Register from './Register'

// eslint-disable-next-line
import * as Sentry from '@sentry/browser';

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      apiCookie: ''
    }

    this.clearApiCookie = this.clearApiCookie.bind(this)
    this.getUserPredictions = this.getUserPredictions.bind(this)
    this.getMiniLeagues = this.getMiniLeagues.bind(this)
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
    var url = 'http://192.168.0.16:5000/minileagues'

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

  getUserPredictions(gameweek) {
    if (gameweek) {
      var url = 'http://192.168.0.16:5000/getuserpredictions?gameweek='+gameweek
    } else {
      url = 'http://192.168.0.16:5000/getuserpredictions'
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

  render() {
    return(
      <div>
        <Router>
          <Switch>
            {this.state.apiCookie==='' ? <Route path='/'><FrontPage widget={<LoginPage />} /></Route> : null }
            <Route path={'/minileague/:id'} component={(routeProps) => <MiniLeagueTable routeProps={routeProps} clearApiCookie={this.clearApiCookie} />} />
            <Route path='/minileagues'><MiniLeagues getUserPredictions={this.getUserPredictions} getMiniLeagues={this.getMiniLeagues} clearApiCookie={this.clearApiCookie} /></Route>
            <Route path='/predictions'><Predictions getUserPredictions={this.getUserPredictions} clearApiCookie={this.clearApiCookie} /></Route>
            <Route path='/register'><FrontPage widget={<Register />} /></Route>
            <Route exact path='/'>{this.state.apiCookie ? <PageSelector clearApiCookie={this.clearApiCookie} /> : <FrontPage widget={<LoginPage />} />}</Route>
          </Switch>
        </Router>
      </div>
    )
  }
}

export default App;