import React from 'react';
import { Table } from 'react-bootstrap';
import './MiniLeagueTable.css';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import DropdownSelector from '../DropdownSelector';
import {
  selectSelectedMinileagueName,
} from './minileaguesSlice';

const MiniLeagueTable = ({
  table,
  setGameweek,
  gameweek,
  loaded,
}) => {
  const selectedMiniLeagueName = useSelector(selectSelectedMinileagueName);

  return (
    <div className="minileague-prediction-container">
      {table.length > 1 ? (
        <>
          <DropdownSelector
            enabled={!loaded}
            onValueUpdate={(e) => setGameweek(e.target.value)}
            startingValue={gameweek}
            length={38}
          />
          <Table borderless className="minileague-prediction-table mini-table">
            <thead>
              <tr>
                <th>Home Team vs Away Team</th>
                <th>Predictions</th>
              </tr>
            </thead>
            <tbody>
              {table.map((match) => (
                // eslint-disable-next-line no-underscore-dangle
                <React.Fragment key={match._id}>
                  <tr className="minileague-prediction-table-row-clickable minileague-prediction-table-row">
                    <td>
                      <div className="minileague-prediction-table-row-inner-container" style={{ textAlign: 'center' }}>
                        {match.home_team}
                        {' '}
                        vs
                        {' '}
                        {match.away_team}
                        {(match.live_home_score || match.live_home_score === 0)
                        && (match.live_away_score || match.live_away_score === 0)
                        && (
                          <div>
                            {match.live_home_score}
                            -
                            {match.live_away_score}
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="minileague-prediction-table-row-inner-container">
                        {Date.parse(match.kick_off_time) < Date.now()
                          ? (
                            <>
                              {match.members.map((member) => {
                                let pred = member.prediction;
                                if (pred) { if (pred.home_pred === null) { pred = null; } }
                                let backgroundColor;
                                if (pred) {
                                  if (pred.points > 0) {
                                    backgroundColor = 'green';
                                  } else if (pred.points < 0) {
                                    backgroundColor = 'red';
                                  } else {
                                    backgroundColor = 'gray';
                                  }
                                }
                                return (
                                  pred
                                    ? (
                                      <div className="minileague-prediction-row" key={member.username}>
                                        <div className="col-md-6" style={{ display: 'flex', alignItems: 'center' }}><b>{member.username}</b></div>
                                        <div className="col-md-3">{pred.error_message ? pred.error_message : `${pred.home_pred}-${pred.away_pred}` }</div>
                                        <div
                                          className="col-md-3"
                                          style={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            marginLeft: 10,
                                          }}
                                        >
                                          <span
                                            className="minileague-scoring-circle"
                                            style={{
                                              display: 'block',
                                              backgroundColor,
                                            }}
                                          />
                                          <span style={{ fontSize: '0.8rem', position: 'absolute' }}>{pred.points}</span>
                                        </div>
                                      </div>
                                    )
                                    : (
                                      <div className="minileague-prediction-row" key={member.username}>
                                        <div className="col-md-6"><b>{member.username}</b></div>
                                        <div className="col-md-6">No prediction</div>
                                      </div>
                                    )
                                );
                              })}
                            </>
                          )
                          : <div style={{ textAlign: 'center' }}>Not kicked off</div>}
                      </div>
                    </td>
                  </tr>
                  {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                  <tr><th /></tr>
                </React.Fragment>
              ))}
            </tbody>
          </Table>
        </>
      ) : (
        <div className="no-mini-league-statement ask-friends-minileague">
          {`Ask your friends to join your mini-league - name: ${selectedMiniLeagueName}`}
        </div>
      )}
    </div>
  );
};

MiniLeagueTable.propTypes = {
  setGameweek: PropTypes.func.isRequired,
  gameweek: PropTypes.number.isRequired,
  loaded: PropTypes.bool.isRequired,
  table: PropTypes.arrayOf(PropTypes.shape({
    home_team: PropTypes.string,
  })).isRequired,
};

export default MiniLeagueTable;
