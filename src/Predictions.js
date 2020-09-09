import React from 'react'
import './Predictions.css'
import GameweekSelector from './GameweekSelector'

class Predictions extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      user_predictions: [],
      gameweek: 1
    }

    this.handleGameweekChange = this.handleGameweekChange.bind(this)
  }
  handleGameweekChange(event) {
    this.setState({gameweek: event.target.value})
    this.getUserPredictions(event.target.value)
  }

  getUserPredictions(gameweek) {
    if (gameweek) {
      var url = 'http://127.0.0.1:5000/getuserpredictions?gameweek='+gameweek
    } else {
      url = 'http://127.0.0.1:5000/getuserpredictions'
    }

    fetch(url, {credentials: "include"}).then(response => response.json()).then(data => {
      var final_games_arr = []
      for (var i = 0; i < data.length; i++) {
        var game = data[i]
        if (game['user_predictions'].length === 0) {
          game['user_predictions'].push({home_pred: '-', away_pred: '-'})
        }
        final_games_arr.push(game)
      }  

      this.setState({
        user_predictions: final_games_arr
      })
    })
  }

  componentDidMount() {
    this.getUserPredictions()
  }

  handleSubmit(event) {
    event.preventDefault()
    const data = new FormData(event.target);

    var predsData = []
    for (var [key, value] of data.entries()) {
      var pred_type = key.split('[')[1].split(']')[0]
      var pred_num = value
      const game_id = key.split('[')[0]
      
      const exists = predsData.some(pred => pred.game_id === game_id)
      if (!exists) {
        predsData.push({game_id: game_id})
      }

      const predIndex = predsData.findIndex(pred => pred.game_id === game_id)
      if (pred_type === 'home-pred') {
        predsData[predIndex]['home_pred'] = pred_num
      }
      if (pred_type === 'away-pred') {
        predsData[predIndex]['away_pred'] = pred_num
      }
    }
    
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({predictions: predsData}),
      credentials: 'include'
    }

    fetch('http://127.0.0.1:5000/updatemanypredictions', requestOptions)
  }
  render() {
    return (
      <div>
        <GameweekSelector onGameweekUpdate={this.handleGameweekChange} gameweek={this.state.gameweek} />
        <form onSubmit={this.handleSubmit}>
          {this.state.user_predictions.map((match) => (
            <div className='pred-container' key={match._id}>
              <div className='home-team-container'>
                {match.home_team}
              </div>
              <div className='score-container'>
                <input name={`${match._id}[home-pred]`} type='number' style={{width:20, textAlign: 'center'}} defaultValue={match.user_predictions[0]['home_pred']} />
                -
                <input name={`${match._id}[away-pred]`} type='number' style={{width:20, textAlign: 'center'}} defaultValue={match.user_predictions[0]['away_pred']} />
              </div>
              <div className='away-team-container'>
                {match.away_team}
              </div>
            </div>
          ))}
          <input type='submit' value='Submit' />
        </form>
      </div>
    )
  }
}

export default Predictions