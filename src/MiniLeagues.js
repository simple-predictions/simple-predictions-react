import React from 'react'
import {Link} from 'react-router-dom'
import {Table} from 'react-bootstrap'

class MiniLeagues extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      minileagues: []
    }
  }
  async componentDidMount() {
    var newState = await this.props.getMiniLeagues()
    this.setState(newState)
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