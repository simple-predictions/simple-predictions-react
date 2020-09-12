import React from 'react';
import './App.css';
import Header from './Header.js';
import LoginPage from './LoginPage'
import Homepage from './Homepage'
import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import Cookies from 'js-cookie'
import Predictions from './Predictions'
import MiniLeagues from './MiniLeagues'
import MiniLeagueTable from './MiniLeagueTable'

// eslint-disable-next-line
import * as Sentry from '@sentry/browser';

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      apiCookie: ''
    }

    this.clearApiCookie = this.clearApiCookie.bind(this)
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

  render() {
    return(
      <div>
        <Header />
        <Router>
          <Switch>
            {this.state.apiCookie==='' ? <Route path='/'><LoginPage /></Route> : null }
            <Route path={'/minileague/:id'} component={(routeProps) => <MiniLeagueTable routeProps={routeProps} clearApiCookie={this.clearApiCookie} />} />
            <Route path='/minileagues'><MiniLeagues clearApiCookie={this.clearApiCookie} /></Route>
            <Route path='/predictions'><Predictions clearApiCookie={this.clearApiCookie} /></Route>
            <Route exact path='/'>{this.state.apiCookie ? <Homepage /> : <LoginPage />}</Route>
          </Switch>
        </Router>
      </div>
    )
  }
}

export default App;