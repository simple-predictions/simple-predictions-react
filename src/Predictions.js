import React from 'react'
import './Predictions.css'
import GameweekSelector from './GameweekSelector'
import Cookies from 'js-cookie'

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

    fetch(url, {credentials: "include"}).then(response => {
      if (response.status === 401) {
        Cookies.remove('connect.sid')
        this.props.clearApiCookie()
        return []
      }
      return response.json()
    }).then((data) => {
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
    var month = []
    month[0] = "January";
    month[1] = "February";
    month[2] = "March";
    month[3] = "April";
    month[4] = "May";
    month[5] = "June";
    month[6] = "July";
    month[7] = "August";
    month[8] = "September";
    month[9] = "October";
    month[10] = "November";
    month[11] = "December";

    return (
      <div>
        <GameweekSelector onGameweekUpdate={this.handleGameweekChange} gameweek={this.state.gameweek} />
        <form onSubmit={this.handleSubmit}>
          {this.state.user_predictions.map((match) => (
            <div className='outer-container' key={match._id}>
              <div className='kick-off-time-container'>
                {match.kick_off_time.getDate()} 
                {month[match.kick_off_time.getMonth()]} 
                {match.kick_off_time.getHours()}:
                {match.kick_off_time.getMinutes()}
              </div>
              <div className='pred-container'>
                <div className='home-team-container'>
                  {match.home_team}
                </div>
                <div className='score-container'>
                  <input disabled={match.locked ? true : false} name={`${match._id}[home-pred]`} type='number' style={{width:20, textAlign: 'center'}} defaultValue={match.user_predictions[0]['home_pred']} />
                  -
                  <input disabled={match.locked ? true : false} name={`${match._id}[away-pred]`} type='number' style={{width:20, textAlign: 'center'}} defaultValue={match.user_predictions[0]['away_pred']} />
                </div>
                <div className='away-team-container'>
                  {match.away_team}
                </div>
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