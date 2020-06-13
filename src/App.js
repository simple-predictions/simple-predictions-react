import React from 'react';
import './App.css';
import Header from './Header.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import MainView from './mainView.js';
import Game from './game.js';
import * as Sentry from '@sentry/browser';

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {games: [], minileague: [], combinedPoints: []}
  }
  componentDidMount() {
    this.apiCall()
    this.miniLeagueApiCall()
    setInterval(() => {
      this.apiCall()
      this.miniLeagueApiCall()
    }, 1000*10)
  }
  // Check if values changed and update
  componentDidUpdate(prevProps, prevState) {
    if (JSON.stringify(prevState.games) === JSON.stringify(this.state.games) || !prevState.games) {
      //alert('NOT CHANGED')
    } else {
      // Games have updated
      // This will mostly be handled in the GamesTable component in games.js but refreshing minileague scores will be handled here
    }
  }
  render() {
    return(
      <div>
        <Header />
        <Router>
          <Switch>
            <Route path={`/game/:gameId`} render={(routeProps) => <Game routeProps={routeProps} games={this.state.games} />}></Route>
            <Route exact path='/'><MainView games={this.state.games} combinedPoints={this.state.combinedPoints} selectedGame={this.state.selectedGame} /></Route>
          </Switch>
        </Router>
      </div>
    )
  }
  apiCall() {
    fetch('https://simple-predictions-api.herokuapp.com/data').then(res => res.json()).then((data) => {
      this.setState({ games: data })
    }).catch(console.log);
  }

  miniLeagueApiCall() {
    fetch('https://simple-predictions-api.herokuapp.com/minileague').then(res => res.json()).then((data) => {
      this.setState({ minileague: data })
      this.calculatePointsChange()
    })
  }

  calculateWeekPoints(name, username) {
    var player_points = 0;
    this.state.games.map(game => {
      var game_points = game[name+'_points'];
      if (game_points) {
        player_points += game_points
      }
      return game_points;
    })
    return parseInt(player_points);
  }

  convertName(name) {
    if (name === 'JadTheGooner82') name = 'jacob';
    if (name === 'churchstreetgunners') name = 'sol';
    if (name === 'churchstreetsuperhoops') name = 'phil';
    if (name === 'Gunnersof82') name = 'jonny';
    if (name === 'finchleygunners') name = 'lila';
    if (name === 'RedArmy82') name = 'sam';
    return name;
  }

  calculatePointsChange() {
    var points = this.state.minileague;
    points.map(player => {
      var username = player.name
      var name = this.convertName(player.name)
      var player_points = this.calculateWeekPoints(name, username);
      player['points'] += player_points
      player['pointsChange'] = player_points
      return points[name]
    })
    points.sort((a,b) => (a.points < b.points) ? 1 : -1)
    this.setState({combinedPoints:points})
    return points;
  }
}

export default App;