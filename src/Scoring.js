import React from 'react'
import './Scoring.css'
import HomepageButton from './HomepageButton'
import DropdownSelector from './DropdownSelector'

class Scoring extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      user_predictions: [],
      followingList: []
    }
    this.getFollowingList = this.getFollowingList.bind(this)
    this.handleUpdate = this.handleUpdate.bind(this)
  }
  async componentDidMount() {
    var newState = await this.props.getUserPredictions()
    newState.user_predictions = newState.user_predictions.filter((val) => val.kick_off_time < Date.now())
    this.getFollowingList()
    this.setState(newState)
  }

  getFollowingList() {
    fetch('http://192.168.0.16:5000/friends', {credentials: 'include'}).then(res => res.json()).then(data => {
      this.setState({
        followingList: data
      })
    })
  }

  async handleUpdate(event) {
    var friend_username = this.state.followingList[event.target.value-1].name
    if (friend_username === 'Mine') friend_username = null
    var newState = await this.props.getUserPredictions(0, friend_username)
    newState.user_predictions = newState.user_predictions.filter((val) => val.kick_off_time < Date.now())
    this.setState(newState)
  }

  render() {
    return (
      <div className='m-0 row'>
        <div className='col-md-4 left-col-scoring-outer-container'>
          <HomepageButton />
          <div className='left-col-scoring-container'>
            <h1 className='left-col-scoring-text'>Scores</h1>
          </div>
        </div>
        <div className='col-md-8 right-col'>
          <div className='scored-header-row' style={{marginBottom: 0}}>
            <div className='scored-header-row-inner-container' style={{paddingBottom: 0}}>
              <div className='col-md-3'></div>
              <div className='col-md-6'>
                <div className='col-md-4'>
                  <DropdownSelector arrowStyle={{marginTop: 8}} style={{border: 'solid 1px #defc5f'}} onValueUpdate={this.handleUpdate} length={this.state.followingList.length} minileagueArr={this.state.followingList} />
                </div>
                <div className='col-md-4'>
                </div>
                <div className='col-md-4'>
                </div>
              </div>
            </div>
          </div>
          <div className='scored-header-row'>
            <div className='scored-header-row-inner-container'>
              <div className='col-md-3'></div>
              <div className='col-md-6'>
                <div className='col-md-4'>
                  Predicted Score
                </div>
                <div className='col-md-4'>
                  Live Score
                </div>
                <div className='col-md-4'>
                  Points
                </div>
              </div>
            </div>
          </div>
          {this.state.user_predictions.map(match => (
            <div key={match.home_team} className='scored-match-container'>
              <div className='scored-match-inner-container'>
                <div className='home-team-container col-md-3'>
                  <img alt="home club badge" className='club-badge' height={70} src={require('./badges/'+match.home_team+'.png')}/>
                  <span className='prediction-circle'/>
                </div>
                <div className='scored-match-data-container col-md-6'>
                  <div className='predicted-score-container col-md-4' style={{backgroundColor: '#defc5f'}}>
                    {match.user_predictions[0].home_pred} - {match.user_predictions[0].away_pred}
                  </div>
                  <div className='live-score-container col-md-4' style={{backgroundColor: '#defc5f'}}>
                    {match.status === 'IN_PLAY' ? <div style={{display: 'inline-block', width:25}}/> : <div />}
                    {match.live_home_score} - {match.live_away_score}
                    {match.status === 'IN_PLAY' ? <div className='pulsing-circle' /> : <div />}
                  </div>
                  <div className='scored-points-container col-md-4'>
                    <span style={{position: 'relative', zIndex: 999}}>{match.user_predictions[0].points || 0}</span>
                    <span className='points-circle prediction-circle' style={{backgroundColor: match.user_predictions[0].points > 0 ? 'green' : match.user_predictions[0].points < 0 ? 'red' : 'gray'}}/>
                  </div>
                </div>
                <div className='away-team-container col-md-3'>
                  <img alt="away club badge" className='club-badge' height={70} src={require('./badges/'+match.away_team+'.png')}/>
                  <span className='prediction-circle'/>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }
}

export default Scoring