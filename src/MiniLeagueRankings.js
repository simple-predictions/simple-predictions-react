import React from 'react'
import {Table} from 'react-bootstrap'
import './MiniLeagueRankings.css'

class MiniLeagueRankings extends React.Component {
  render() {
    return(
      <div className='minileague-rankings-container'>
        <Table borderless className='ranking-table mini-table' size='sm'>
          <thead>
            <tr>
              <th><strong>Position</strong></th>
              <th><strong>Username</strong></th>
              <th><strong>Points</strong></th>
            </tr>
          </thead>
          <tbody>
            {this.props.selectedMiniLeague.map((player, idx) => (
              <tr key={player.username} className='ranking-table-row'>
                <td>{idx+1}</td>
                <td>{player.username}</td>
                <td>{player.points}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    )
  }
}

export default MiniLeagueRankings