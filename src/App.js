import React from 'react';
import './App.css';
import Header from './Header.js';
import GamesTable from './games.js';
import 'bootstrap/dist/css/bootstrap.min.css';

class App extends React.Component {
  state = {games: []
  }
  componentDidMount() {
    this.apiCall()
    setInterval(() => {
      this.apiCall()
    }, 1000*10)
  }
  render() {
    return(
      <div>
        <Header />
        <GamesTable games={this.state.games}/>
      </div>
    )
  }
  apiCall() {
    fetch('https://simple-predictions-api.herokuapp.com/data').then(res => res.json()).then((data) => {
      this.setState({ games: data })
    }).catch(console.log);
  }
}

export default App;
