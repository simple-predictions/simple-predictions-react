import React from 'react'
import {Table} from 'react-bootstrap'
import { useSelector } from 'react-redux'
import {selectSelectedMinileagueRankings} from './minileaguesSlice'
import './MiniLeagueRankings.css'

const MiniLeagueRankings = () => {
  const selectedMiniLeague = useSelector(selectSelectedMinileagueRankings)

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
          {selectedMiniLeague.map((player, idx) => (
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

export default MiniLeagueRankings