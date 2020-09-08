import React from 'react'
import './Predictions.css'

class Predictions extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      user_predictions: []
    }
  }
  componentDidMount() {
    fetch('http://127.0.0.1:5000/getuserpredictions', {credentials: "include"}).then(response => response.json()).then(data => {
      var final_games_arr = []
      for (var i = 0; i < data.length; i++) {
        var game = data[i]
        if (game['user_predictions'].length === 0) {
          game['user_predictions'].push({test_attribute: 'test'})
        }
        final_games_arr.push(game)
      }  

      this.setState({
        user_predictions: final_games_arr
      })
    })
  }
  render() {
    return (
      <div>
        {this.state.user_predictions.map((match) => (
          <div class='pred-container'>
            <div class='home-team-container'>
              {match.home_team}
            </div>
            <div class='score-container'>
              1
            </div>
            <div class='away-team-container'>
              {match.away_team}
            </div>
            {console.log(match)}
          </div>
        ))}
      </div>
    )
  }
}

export default Predictions