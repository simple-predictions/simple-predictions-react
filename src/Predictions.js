import React from 'react'
import './Predictions.css'
import DropdownSelector from './DropdownSelector'
import {Alert} from 'react-bootstrap'
import HomepageButton from './HomepageButton'
import base_url from './globals'
import { findAllByTestId } from '@testing-library/react'

class Predictions extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      user_predictions: [],
      gameweek: 0,
      successCount: 0,
      selectorDisabled: true,
      submitEnabled: true
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleGameweekChange = this.handleGameweekChange.bind(this)
    this.closeAlert = this.closeAlert.bind(this)
  }
  async handleGameweekChange(event) {
    this.setState({
      selectorDisabled: true
    })
    var newState = await this.props.getUserPredictions(event.target.value)
    newState.selectorDisabled = false
    this.setState(newState)
  }

  async componentDidMount() {
    var newState = await this.props.getUserPredictions(this.state.gameweek)
    newState.selectorDisabled = false
    this.setState(newState)
  }

  handleSubmit(event) {
    event.preventDefault()
    if (this.state.submitEnabled === false) {
      return
    }
    this.setState({
      submitEnabled: false
    })
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

    fetch(base_url+'/updatemanypredictions', requestOptions).then(res => {
      if (res.status === 200) {
        this.setState({
          successMessage: 'Your predictions have been updated',
          successCount: this.state.successCount + 1
        })
      }
      this.setState({
        submitEnabled: true
      })
    })
  }

  closeAlert() {
    this.setState({
      successMessage: ''
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
        <div className='col-lg-4 left-col-prediction-outer-container'>
          <HomepageButton />
          {this.state.successMessage && <Alert variant="success" dismissible onClose={this.closeAlert}>{this.state.successMessage} - <strong>{this.state.successCount} attempt(s)</strong></Alert>}
          <div className='left-col-prediction-container'>
            <h1 className='left-col-prediction-text'>Predictions</h1>
            <DropdownSelector enabled={this.state.selectorDisabled} length={38} onValueUpdate={this.handleGameweekChange} startingValue={this.state.gameweek} />
            <input disabled={!this.state.submitEnabled} className='predictions-form-submit-button' type='submit' value='Submit' form='predictions-form' />
          </div>
        </div>
        <div className='col-lg-8 right-col'>
          <form id='predictions-form' className='predictions-form' onSubmit={this.handleSubmit}>
            {this.state.user_predictions.map((match) => (
              <div className='outer-container' key={match._id}>
                <div className='outer-pred-container'>
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
                      <input className='prediction-score-input' disabled={match.locked ? true : false} name={`${match._id}[home-pred]`} type='number' style={{textAlign: 'center', backgroundColor: match.locked ? '#c5ccd6' : ''}} defaultValue={match.user_predictions[0]['home_pred']} />
                      -
                      <input className='prediction-score-input' disabled={match.locked ? true : false} name={`${match._id}[away-pred]`} type='number' style={{textAlign: 'center', backgroundColor: match.locked ? '#c5ccd6' : ''}} defaultValue={match.user_predictions[0]['away_pred']} />
                    </div>
                    <div className='away-team-container'>
                      <img alt="away club badge" className='club-badge' height={70} src={require('./badges/'+match.away_team+'.png')}/>
                      <span className='prediction-circle'/>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <input disabled={!this.state.submitEnabled} className='predictions-form-submit-button predictions-form-submit-button-mobile' type='submit' value='Submit' form='predictions-form' />
          </form>
        </div>
      </div>
    )
  }
}

export default Predictions