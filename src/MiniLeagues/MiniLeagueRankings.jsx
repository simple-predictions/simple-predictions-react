import React from 'react';
import { Table } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { selectSelectedMinileagueRankings, selectSelectedMinileagueName } from './minileaguesSlice';
import './MiniLeagueRankings.css';

const MiniLeagueRankings = () => {
  const selectedMiniLeague = useSelector(selectSelectedMinileagueRankings);
  const selectedMiniLeagueName = useSelector(selectSelectedMinileagueName);

  return (
    <div className="minileague-rankings-container">
      {selectedMiniLeague.length > 1 ? (
        <Table borderless className="ranking-table mini-table" size="sm">
          <thead>
            <tr>
              <th><strong>Position</strong></th>
              <th><strong>Username</strong></th>
              <th><strong>Points</strong></th>
            </tr>
          </thead>
          <tbody>
            {selectedMiniLeague.map((player, idx) => (
              <tr key={player.username} className="ranking-table-row">
                <td>{idx + 1}</td>
                <td>{player.username}</td>
                <td>{player.points}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <div className="no-mini-league-statement ask-friends-minileague">
          {`Ask your friends to join your mini-league - name: ${selectedMiniLeagueName}`}
        </div>
      )}
    </div>
  );
};

export default MiniLeagueRankings;
