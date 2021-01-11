import React from 'react'
import Cookies from 'js-cookie'
import {Table} from 'react-bootstrap'
import './MiniLeagueTable.css'
import base_url from './globals'

class MiniLeagueTable extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      minileague: {members:[], matches:[]},
      isOpenArr: []
    }
    this.toggleIsOpen = this.toggleIsOpen.bind(this)
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
    this.getMiniLeague()
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps !== this.props) {
      this.getMiniLeague()
    }
  } 

  getMiniLeague() {
    var url = base_url+'/minileaguepredictions?league_id='+this.props.league_id

    fetch(url, {credentials: "include"}).then(response => {
      if (response.status === 401) {
        Cookies.remove('connect.sid')
        this.props.clearApiCookie()
        return []
      }
      return response.json()
    }).then((data) => {
      const isOpenArr = Object.assign({}, ...data['matches'].map(match => ({[match._id]: false})))
      this.setState({
        minileague: data,
        isOpenArr: isOpenArr
      })
    })
  }

  render() {
    return (
      <div className='minileague-prediction-container'>
        <Table borderless className='minileague-prediction-table mini-table'>
          <thead>
            <tr>
              <th>Home Team/Away Team</th>
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
                      <div className='minileague-prediction-table-row-inner-container' style={{textAlign: 'center'}}>{match.home_team} vs {match.away_team}</div>
                    </td>
                    <td>
                      <div className='minileague-prediction-table-row-inner-container'>
                        {this.state.minileague.members.map((member) => {
                          var pred = match.predictions.find(obj => obj.username === member.username)
                          if (pred) {if (pred.home_pred === null) {pred = null}}
                          return (
                            pred ? <div key={member.username}><b>{member.username}</b>: {pred.error_message ? pred.error_message : pred.home_pred+'-'+pred.away_pred }</div> : <div key={member.username}><b>{member.username}</b>: No prediction</div>
                          )  
                        })}
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