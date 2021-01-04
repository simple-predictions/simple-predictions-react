import React from 'react'
import './Predictions.css'
import DropdownSelector from './DropdownSelector'
import {Alert} from 'react-bootstrap'
import HomepageButton from './HomepageButton'

class Predictions extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      user_predictions: [],
      gameweek: 0,
      successCount: 0
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleGameweekChange = this.handleGameweekChange.bind(this)
  }
  async handleGameweekChange(event) {
    var newState = await this.props.getUserPredictions(event.target.value)
    this.setState(newState)
  }

  async componentDidMount() {
    var newState = await this.props.getUserPredictions(this.state.gameweek)
    this.setState(newState)
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

    fetch('http://192.168.0.16:5000/updatemanypredictions', requestOptions).then(res => {
      if (res.status === 200) {
        this.setState({
          successMessage: 'Your predictions have been updated',
          successCount: this.state.successCount + 1
        })
      }
    })
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
      <div className='m-0 row'>
        <div className='col-md-4 left-col-prediction-outer-container'>
          <HomepageButton />
          {this.state.successMessage && <Alert variant="success">{this.state.successMessage} - <strong>{this.state.successCount} attempt(s)</strong></Alert>}
          <div className='left-col-prediction-container'>
            <h1 className='left-col-prediction-text'>Predictions</h1>
            <DropdownSelector length={38} onValueUpdate={this.handleGameweekChange} startingValue={this.state.gameweek} />
            <input className='predictions-form-submit-button' type='submit' value='Submit' form='predictions-form' />
          </div>
        </div>
        <div className='col-md-8 right-col'>
          <form id='predictions-form' className='predictions-form' onSubmit={this.handleSubmit}>
            {this.state.user_predictions.map((match) => (
              <div className='outer-container' key={match._id}>
                <div className='outer-pred-container'>
                    {/*<div className='points-container'>
                      Points: {match.user_predictions[0]['points']}
                    </div>
                    <div style={{background: match.status === 'IN_PLAY' ? '#ff2121' : '#ffd230'}} className='live-score'>
                      <div style={{display: match.status === 'IN_PLAY' ? 'inline-block' : 'none'}} className='pulsing-circle'></div>
                      {match.live_home_score}
                      -
                      {match.live_away_score}
                    </div>
                    <div className='status'>
                      Status: {match.status}
                    </div>*/}
                  <div className='pred-container'>
                    <div className='home-team-container'>
                      <img alt="home club badge" className='club-badge' height={70} src={require('./badges/'+match.home_team+'.png')}/>
                      <span className='prediction-circle'/>
                    </div>
                    <div className='score-container'>
                      <div className='kick-off-time-container'>
                      {match.kick_off_time.getDate()}{' '}
                      {month[match.kick_off_time.getMonth()]}{' '}
                      {match.kick_off_time.getHours()}:
                      {("0" + match.kick_off_time.getMinutes()).slice(-2)}
                      </div>
                      <input disabled={match.locked ? true : false} name={`${match._id}[home-pred]`} type='number' style={{width:20, textAlign: 'center', backgroundColor: match.locked ? '#c5ccd6' : ''}} defaultValue={match.user_predictions[0]['home_pred']} />
                      -
                      <input disabled={match.locked ? true : false} name={`${match._id}[away-pred]`} type='number' style={{width:20, textAlign: 'center', backgroundColor: match.locked ? '#c5ccd6' : ''}} defaultValue={match.user_predictions[0]['away_pred']} />
                    </div>
                    <div className='away-team-container'>
                      <img alt="away club badge" className='club-badge' height={70} src={require('./badges/'+match.away_team+'.png')}/>
                      <span className='prediction-circle'/>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </form>
        </div>
      </div>
    )
  }
}

export default Predictions