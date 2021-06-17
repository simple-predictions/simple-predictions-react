import React, { useState } from 'react';
import './Scoring.css';
import { gql, useQuery } from '@apollo/client';
import { useSelector } from 'react-redux';
import HomepageButton from '../HomepageButton';
import DropdownSelector from '../DropdownSelector';
import { selectUserUsername } from '../User/userSlice';

const Scoring = () => {
  window.scrollTo(0, 35);

  const [gameweek, setGameweek] = useState(0);
  const [userID, setUserID] = useState('');
  const username = useSelector(selectUserUsername);

  const USERS_QUERY = gql`
    query {
      userOne(filter: {username: "${username}"}) {
        _id
        username
        totalPoints
        friends {
          username
          _id
        }
      }
    }
  `;

  const { loading: userQueryLoading, data: userQueryData } = useQuery(USERS_QUERY);
  let friends = [];
  let totalPoints = 0;
  if (userQueryLoading === false) {
    totalPoints = userQueryData.userOne.totalPoints;
    // eslint-disable-next-line no-underscore-dangle
    friends = [{ _id: userQueryData.userOne._id, username: 'Mine' }, ...userQueryData.userOne.friends];
  }
  const QUERY = gql`
    query {
      matchMany(filter: {gameweek: ${gameweek || 0}}) {
        _id
        gameweek
        home_team
        away_team
        kick_off_time
        gameweek
        locked
        live_home_score
        live_away_score
        predictions${userID ? `(users: ["${userID}"])` : ''} {
          _id
          home_pred
          away_pred
          banker
          insurance
          points
        }
      }
    }
  `;

  const { loading: queryLoading, data: queryData } = useQuery(QUERY);

  if (!queryLoading && gameweek === 0) {
    setGameweek(queryData.matchMany[0].gameweek);
  }

  return (
    <div className="m-0 row">
      <div className="col-lg-4 left-col-scoring-outer-container">
        <HomepageButton />
        <div className="left-col-scoring-container">
          <h1 className="left-col-scoring-text">Scores</h1>
          <DropdownSelector
            enabled={userQueryLoading || queryLoading}
            length={38}
            onValueUpdate={(e) => setGameweek(e.target.value)}
            startingValue={gameweek}
          />
          <div className="total-points-container">{`Total points: ${totalPoints}`}</div>
        </div>
      </div>
      <div className="col-lg-8 right-col">
        <div>
          <div className="scored-header-row" style={{ marginBottom: 0 }}>
            <div className="scored-header-row-inner-container" style={{ paddingBottom: 0 }}>
              <div className="home-team-container col-md-2" style={{ opacity: 0 }}>
                <img alt="home club badge" className="club-badge" height={70} src="/badges/Arsenal.png" />
                <span className="prediction-circle" />
              </div>
              <div className="col-md-8 scored-match-data-container scored-match-data-header">
                <div className="col-md-4">
                  {/* eslint-disable-next-line no-underscore-dangle */}
                  <DropdownSelector enabled={userQueryLoading || queryLoading} style={{ border: 'solid 1px #defc5f' }} onValueUpdate={(e) => setUserID(friends[e.target.value - 1]._id)} length={friends.length} minileagueArr={friends.map((friend) => ({ name: friend.username }))} />
                </div>
                <div className="col-md-4" />
                <div className="col-md-4" />
              </div>
              <div className="away-team-container col-md-2" style={{ opacity: 0 }}>
                <img alt="away club badge" className="club-badge" height={70} src="/badges/Arsenal.png" />
                <span className="prediction-circle" />
              </div>
            </div>
          </div>
          <div className="scored-header-row">
            <div className="scored-header-row-inner-container" style={{ paddingTop: 0 }}>
              <div className="home-team-container col-md-2" style={{ opacity: 0 }}>
                <img alt="home club badge" className="club-badge" height={70} src="/badges/Arsenal.png" />
                <span className="prediction-circle" />
              </div>
              <div className="col-md-8 scored-match-data-container scored-match-data-header">
                <div className="col-md-4">
                  Predicted Score
                </div>
                <div className="col-md-4">
                  Live Score
                </div>
                <div className="col-md-4">
                  Points
                </div>
              </div>
              <div className="away-team-container col-md-2" style={{ opacity: 0 }}>
                <img alt="away club badge" className="club-badge" height={70} src="/badges/Arsenal.png" />
                <span className="prediction-circle" />
              </div>
            </div>
          </div>
        </div>
        {!queryLoading && queryData.matchMany.map((match) => {
          let backgroundColor;
          if (match.predictions[0]?.points > 0) {
            backgroundColor = 'green';
          } else if (match.predictions[0]?.points < 0) {
            backgroundColor = 'red';
          } else {
            backgroundColor = 'gray';
          }
          return (
            <div key={match.home_team} className="scored-match-container">
              <div className="scored-match-inner-container">
                <div className="home-team-container col-md-2">
                  <img alt="home club badge" className="club-badge" height={70} src={`/badges/${match.home_team}.png`} />
                  <span className="prediction-circle" />
                </div>
                <div className="scored-match-data-container col-md-8">
                  <div className="predicted-score-container col-md-4" style={{ backgroundColor: '#defc5f' }}>
                    {match.predictions[0]?.home_pred}
                    {' '}
                    -
                    {' '}
                    {match.predictions[0]?.away_pred}
                  </div>
                  <div className="live-score-container col-md-4" style={{ backgroundColor: '#defc5f' }}>
                    {match.live_home_score}
                    {' '}
                    -
                    {' '}
                    {match.live_away_score}
                    {match.status === 'IN_PLAY' ? <div className="pulsing-circle" /> : <div />}
                  </div>
                  <div className="scored-points-container col-md-4">
                    <span style={{ position: 'relative', zIndex: 999 }}>{match.predictions[0]?.points || 0}</span>
                    <span className="points-circle prediction-circle" style={{ backgroundColor }} />
                  </div>
                </div>
                <div className="away-team-container col-md-2">
                  <img alt="away club badge" className="club-badge" height={70} src={`/badges/${match.away_team}.png`} />
                  <span className="prediction-circle" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Scoring;
