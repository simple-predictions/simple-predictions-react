import React from 'react'
import Cookies from 'js-cookie'
import {Link} from 'react-router-dom'
import {Table} from 'react-bootstrap'

class MiniLeagues extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      minileagues: []
    }
    this.getMiniLeagues = this.getMiniLeagues.bind(this)
  }
  componentDidMount() {
    this.getMiniLeagues()
  }
  getMiniLeagues() {
    var url = 'http://127.0.0.1:5000/minileagues'

    fetch(url, {credentials: "include"}).then(response => {
      if (response.status === 401) {
        Cookies.remove('connect.sid')
        this.props.clearApiCookie()
        return []
      }
      return response.json()
    }).then((data) => {
      var final_leagues_arr = []
      for (var i = 0; i < data.length; i++) {
        var league = data[i]
        var members = league['members']
        var usernames = []
        for (var x = 0; x < members.length; x++) {
          var member = members[x]
          var username = member['username']
          usernames.push(username)
        }
        var members_str = usernames.join(', ')
        league['members_str'] = members_str
        final_leagues_arr.push(league)
      }

      this.setState({
        minileagues: final_leagues_arr
      })
    })
  }

  render () {
    return (
      <Table>
        <thead>
          <tr>
            <th>League name</th>
            <th>Members</th>
            <th>Links</th>
          </tr>
        </thead>
        <tbody>
          {this.state.minileagues.map((league) => (
            <tr key={league.name}>
              <td>{league.name}</td>
              <td>{league.members_str}</td>
              <td><Link to={`/minileague/${league._id}`} ><button>View minileague</button></Link></td>
            </tr>
          ))}
        </tbody>
      </Table>
    )
  }
}

export default MiniLeagues