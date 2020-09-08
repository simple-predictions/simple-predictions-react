import React from 'react';
import './App.css';
import Header from './Header.js';
import LoginPage from './LoginPage'
import Homepage from './Homepage'
import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import Cookies from 'js-cookie'
import Predictions from './Predictions'

// eslint-disable-next-line
import * as Sentry from '@sentry/browser';

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      apiCookie: ''
    }
  }
  componentDidMount() {
    var apiCookie = Cookies.get('connect.sid')
    if (apiCookie !== '') {
      this.setState({apiCookie: apiCookie})
    }
  }
  render() {
    return(
      <div>
        <Header />
        <Router>
          <Switch>
            <Route path='/predictions'><Predictions /></Route>
            <Route exact path='/'>{this.state.apiCookie ? <Homepage /> : <LoginPage />}</Route>
          </Switch>
        </Router>
      </div>
    )
  }
}

export default App;