import React from 'react'
import Cookies from 'js-cookie'
import {Table} from 'react-bootstrap'

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
  getMiniLeague() {
    var url = 'http://127.0.0.1:5000/minileaguepredictions?league_id='+this.props.routeProps.match.params.id

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
      <div>
        <Table>
          <thead>
            <tr>
              <th>Home Team</th>
              <th>Away Team</th>
              {this.state.minileague.members.map((member) => (
                <th>{member.username}</th>
              ))}
          </tr>
          </thead>
          <tbody>
            {this.state.minileague.matches.map((match) => (
              <tr>
                <td>{match.home_team}</td>
                <td>{match.away_team}</td>
                {this.state.minileague.members.map((member) => (
                  match.predictions.map((member_prediction) => (
                    member_prediction.username === member.username ? <td>{member_prediction.home_pred+'-'+member_prediction.away_pred}</td> : 'not'
                  ))
                ))}
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    )
  }
}

export default MiniLeagueTable