import React, { useState, useEffect } from 'react';
import './Predictions.css';
import { useSelector } from 'react-redux';
import { Alert } from 'react-bootstrap';
import { gql, useQuery, useMutation } from '@apollo/client';
import PropTypes from 'prop-types';
import DropdownSelector from '../DropdownSelector';
import HomepageButton from '../HomepageButton';
import handleSubmit from '../Logic/PredictionsLogic';
import { selectUserID } from '../User/userSlice';

const Predictions = () => {
  window.scrollTo(0, 35);

  const userID = useSelector(selectUserID);
  const [gameweek, setGameweek] = useState();

  const QUERY = gql`
    query {
      matchMany(filter: {gameweek: ${gameweek || 0}}) {
        _id
        home_team
        away_team
        kick_off_time
        gameweek
        locked
        predictions${userID ? `(users: ["${userID}"])` : ''} {
          _id
          home_pred
          away_pred
          banker
          insurance
        }
      }
    }
  `;

  const { loading: queryLoading, error: queryError, data: queryData } = useQuery(QUERY);
  if (queryError) {
    throw new Error(queryError);
  }

  useEffect(() => {
    if (queryData?.matchMany[0].gameweek !== gameweek && queryData) {
      setGameweek(queryData.matchMany[0].gameweek);
    }
  }, [queryData, gameweek]);

  const BATCHED_MUTATION = gql`
    mutation {
      updatePrediction {
        home_pred
      }
    }
  `;

  const [updatePredictions, {
    error: mutationError,
    loading: mutationLoading,
    called: mutationCalled,
  }] = useMutation(BATCHED_MUTATION);
  if (mutationError) {
    throw new Error(mutationError);
  }

  return (
    <div className="m-0 row">
      <div className="col-lg-4 left-col-prediction-outer-container">
        <HomepageButton />
        {!mutationLoading && !mutationError && mutationCalled && (
        <Alert variant="success">
          Predictions successfully updated!
        </Alert>
        )}
        <div className="left-col-prediction-container">
          <h1 className="left-col-prediction-text">Predictions</h1>
          <DropdownSelector
            enabled={queryLoading}
            length={38}
            onValueUpdate={(e) => setGameweek(parseInt(e.target.value, 10))}
            startingValue={gameweek}
          />
          <input disabled={mutationLoading} className="predictions-form-submit-button" type="submit" value="Submit" form="predictions-form" />
        </div>
      </div>
      <div className="col-lg-8 right-col">
        <form id="predictions-form" className="predictions-form" onSubmit={(e) => handleSubmit(e, updatePredictions)}>
          {queryData && queryData.matchMany.map((match) => {
            const kickOffTime = new Date(match.kick_off_time);
            // eslint-disable-next-line no-underscore-dangle
            return <PredictionRow key={match._id} kickOffTime={kickOffTime} match={match} />;
          })}
          <input disabled={mutationLoading} className="predictions-form-submit-button predictions-form-submit-button-mobile" type="submit" value="Submit" form="predictions-form" />
        </form>
      </div>
    </div>
  );
};

const PredictionRow = ({ kickOffTime, match }) => {
  const month = [];
  month[0] = 'January';
  month[1] = 'February';
  month[2] = 'March';
  month[3] = 'April';
  month[4] = 'May';
  month[5] = 'June';
  month[6] = 'July';
  month[7] = 'August';
  month[8] = 'September';
  month[9] = 'October';
  month[10] = 'November';
  month[11] = 'December';

  const [bankerEnabled, setBankerEnabled] = useState(!!match.predictions[0]?.banker);
  const [insuranceEnabled, setInsuranceEnabled] = useState(!!match.predictions[0]?.insurance);

  return (
    // eslint-disable-next-line no-underscore-dangle
    <div className="outer-container" key={match._id}>
      <div className="outer-pred-container">
        <div className="pred-container">
          <div className="home-team-container">
            <img alt="home club badge" className="club-badge" height={70} src={`/badges/${match.home_team}.png`} />
            <span className="prediction-circle" />
          </div>
          <div className="score-container">
            <div className="kick-off-time-container">
              {kickOffTime.getDate()}
              {' '}
              {month[kickOffTime.getMonth()]}
              {' '}
              {kickOffTime.getHours()}
              :
              {(`0${kickOffTime.getMinutes()}`).slice(-2)}
            </div>
            {/* eslint-disable-next-line no-underscore-dangle */}
            <input className="prediction-score-input" disabled={!!match.locked} name={`${match._id}[home-pred]`} type="number" style={{ textAlign: 'center', backgroundColor: match.locked ? '#c5ccd6' : '' }} defaultValue={match.predictions[0]?.home_pred} />
            -
            {/* eslint-disable-next-line no-underscore-dangle */}
            <input className="prediction-score-input" disabled={!!match.locked} name={`${match._id}[away-pred]`} type="number" style={{ textAlign: 'center', backgroundColor: match.locked ? '#c5ccd6' : '' }} defaultValue={match.predictions[0]?.away_pred} />
            <div className="chips-container">
              <button disabled={!!match.locked} type="button" style={{ opacity: bankerEnabled ? 1 : 0.3 }} className="chip-icon-button" onClick={() => setBankerEnabled(!bankerEnabled)}><img className="chip-icon" alt="dollar icon" src="/icons/dollar.png" height={30} /></button>
              {/* eslint-disable-next-line no-underscore-dangle */}
              <input disabled={!!match.locked} type="hidden" name={`${match._id}[banker]`} value={bankerEnabled} />
              <button disabled={!!match.locked} type="button" style={{ opacity: insuranceEnabled ? 1 : 0.3 }} className="chip-icon-button" onClick={() => setInsuranceEnabled(!insuranceEnabled)}><img className="chip-icon" alt="padlock icon" src="/icons/padlock.png" height={30} /></button>
              {/* eslint-disable-next-line no-underscore-dangle */}
              <input disabled={!!match.locked} type="hidden" name={`${match._id}[insurance]`} value={insuranceEnabled} />
            </div>
          </div>
          <div className="away-team-container">
            <img alt="away club badge" className="club-badge" height={70} src={`/badges/${match.away_team}.png`} />
            <span className="prediction-circle" />
          </div>
        </div>
      </div>
    </div>
  );
};

PredictionRow.propTypes = {
  kickOffTime: PropTypes.instanceOf(Date).isRequired,
  match: PropTypes.shape({
    _id: PropTypes.string,
    home_team: PropTypes.string,
    away_team: PropTypes.string,
    locked: PropTypes.bool,
    predictions: PropTypes.arrayOf(PropTypes.shape({
      home_pred: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      away_pred: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      banker: PropTypes.bool,
      insurance: PropTypes.bool,
    })),
  }).isRequired,
};

export default Predictions;
