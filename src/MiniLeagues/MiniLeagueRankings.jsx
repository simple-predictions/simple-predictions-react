import React from 'react';
import { Table } from 'react-bootstrap';
import PropTypes from 'prop-types';
import './MiniLeagueRankings.css';

const MiniLeagueRankings = ({ rankings }) => {
  const selectedMiniLeagueName = rankings.name;
  const selectedMiniLeague = rankings.members.sort((a, b) => b.totalPoints - a.totalPoints);

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
                <td>{player.totalPoints}</td>
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

MiniLeagueRankings.propTypes = {
  rankings: PropTypes.shape({
    name: PropTypes.string.isRequired,
    members: PropTypes.arrayOf(PropTypes.shape({
      totalPoints: PropTypes.number.isRequired,
      username: PropTypes.string.isRequired,
    })),
  }).isRequired,
};

export default MiniLeagueRankings;
