import React from 'react'
import Cookies from 'js-cookie'
import {Table} from 'react-bootstrap'
import './MiniLeagueTable.css'
import base_url from './globals'
import DropdownSelector from './DropdownSelector'

class MiniLeagueTable extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      minileague: {members:[], matches:[]},
      isOpenArr: [],
      gameweek: 0
    }
    this.toggleIsOpen = this.toggleIsOpen.bind(this)
    this.handleGameweekChange = this.handleGameweekChange.bind(this)
  }

  toggleIsOpen(id) {
    var isOpenArr = this.state.isOpenArr
    isOpenArr[id] = !(this.state.isOpenArr[id])
    console.log(isOpenArr)
    this.setState({
      isOpenArr: isOpenArr
    })
  }
  componentDidMount() {
    this.getMiniLeague(0)
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps !== this.props) {
      this.getMiniLeague(0)
    }
  } 

  getMiniLeague(gameweek) {
    var url = base_url+'/minileaguepredictions?league_id='+this.props.league_id+'&gameweek='+gameweek

    fetch(url, {credentials: "include"}).then(response => {
      if (response.status === 401) {
        Cookies.remove('connect.sid')
        this.props.clearApiCookie()
        return []
      }
      return response.json()
    }).then((data) => {
      const isOpenArr = Object.assign({}, ...data['preds']['matches'].map(match => ({[match._id]: false})))
      this.setState({
        minileague: data['preds'],
        isOpenArr: isOpenArr,
        gameweek: data['gameweek']
      })
    })
  }

  async handleGameweekChange(event) {
    this.getMiniLeague(event.target.value)
  }

  render() {
    return (
      <div className='minileague-prediction-container'>
        <DropdownSelector onValueUpdate={this.handleGameweekChange} startingValue={this.state.gameweek} length={38} />
        <Table borderless className='minileague-prediction-table mini-table'>
          <thead>
            <tr>
              <th>Home Team vs Away Team</th>
              <th>Predictions</th>
              {/*this.state.minileague.members.map((member) => (
                <th key={member.username}>{member.username}</th>
              ))*/}
          </tr>
          </thead>
          <tbody>
            {this.state.minileague.matches.map((match) => (
              <React.Fragment key={match._id}>
                <tr onClick={() => this.toggleIsOpen(match._id)} className={`minileague-prediction-table-row-clickable minileague-prediction-table-row ${this.state.isOpenArr[match._id] ? 'hide-curved-corners' : ''}`}>
                    <td>
                      <div className='minileague-prediction-table-row-inner-container' style={{textAlign: 'center'}}>
                        {match.home_team} vs {match.away_team}
                        {(match.live_home_score || match.live_home_score === 0) && (match.live_away_score || match.live_away_score === 0) &&
                          <div>
                            {match.live_home_score} - {match.live_away_score}
                          </div>
                        }
                      </div>
                    </td>
                    <td>
                      <div className='minileague-prediction-table-row-inner-container'>
                        {Date.parse(match.kick_off_time) < Date.now() ?
                        <React.Fragment>
                          {this.state.minileague.members.map((member) => {
                            var pred = match.predictions.find(obj => obj.username === member.username)
                            if (pred) {if (pred.home_pred === null) {pred = null}}
                            return (
                              pred ? 
                              <div className='minileague-prediction-row' key={member.username}>
                                <div className='col-md-6' style={{display: 'flex', alignItems: 'center'}}><b>{member.username}</b></div>
                                <div className='col-md-3'>{pred.error_message ? pred.error_message : pred.home_pred+'-'+pred.away_pred }</div>
                                <div className='col-md-3' style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginLeft: 10}}>
                                  <span className='minileague-scoring-circle' style={{display: 'block', backgroundColor: pred.points > 0 ? 'green' : pred.points < 0 ? 'red' : 'gray'}} />
                                  <span style={{fontSize: '0.8rem', position: 'absolute'}}>{pred.points}</span>
                                </div>
                              </div>
                              : 
                              <div className='minileague-prediction-row' key={member.username}>
                                <div className='col-md-6'><b>{member.username}</b></div>
                                <div className='col-md-6'>No prediction</div>
                              </div>
                            )  
                          })}
                        </React.Fragment>
                        : <div style={{textAlign: 'center'}}>Not kicked off</div>}
                      </div>
                    </td>
                </tr>
                <tr><th></th></tr>
              </React.Fragment>
            ))}
          </tbody>
        </Table>
      </div>
    )
  }
}

export default MiniLeagueTable