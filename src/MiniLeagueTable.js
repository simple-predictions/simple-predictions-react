import React from 'react'
import Cookies from 'js-cookie'
import {Table} from 'react-bootstrap'
import './MiniLeagueTable.css'

class MiniLeagueTable extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      minileague: {members:[], matches:[]}
    }
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
    var url = 'http://192.168.0.16:5000/minileaguepredictions?league_id='+this.props.league_id

    fetch(url, {credentials: "include"}).then(response => {
      if (response.status === 401) {
        Cookies.remove('connect.sid')
        this.props.clearApiCookie()
        return []
      }
      return response.json()
    }).then((data) => {
      this.setState({
        minileague: data
      })
    })
  }

  render() {
    return (
      <div className='minileague-prediction-container'>
        <Table borderless className='minileague-prediction-table mini-table'>
          <thead>
            <tr>
              <th>Home Team</th>
              <th>Away Team</th>
              {this.state.minileague.members.map((member) => (
                <th key={member.username}>{member.username}</th>
              ))}
          </tr>
          </thead>
          <tbody>
            {this.state.minileague.matches.map((match) => (
              <tr key={match.home_team} className='minileague-prediction-table-row'>
                <td>{match.home_team}</td>
                <td>{match.away_team}</td>
                {this.state.minileague.members.map((member) => {
                  var pred = match.predictions.find(obj => obj.username === member.username)
                  if (pred) {if (pred.home_pred === null) {pred = null}}
                  return (
                    pred ? <td key={member.username}>{pred.home_pred+'-'+pred.away_pred}</td> : <td key={member.username}>No prediction</td>
                  )  
                })}
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    )
  }
}

export default MiniLeagueTable