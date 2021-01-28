import React, { useState } from 'react';
import './Predictions.css';
import { useDispatch, useSelector } from 'react-redux';
import { Alert } from 'react-bootstrap';
import PropTypes from 'prop-types';
import DropdownSelector from '../DropdownSelector';
import HomepageButton from '../HomepageButton';
import handleSubmit from '../Logic/PredictionsLogic';
import {
  getPredictions, selectUserPredictions, selectUserPredictionsGameweek, selectUserPredictionsStatus,
} from './predictionsSlice';

const Predictions = () => {
  window.scrollTo(0, 35);
  const userPredictions = useSelector(selectUserPredictions);
  const gameweek = useSelector(selectUserPredictionsGameweek);
  const status = useSelector(selectUserPredictionsStatus);
  const [successCount, setSuccessCount] = useState(0);
  const [selectorDisabled, setSelectorDisabled] = useState(true);
  const [submitEnabled, setSubmitEnabled] = useState(true);
  const [successMessage, setSuccessMessage] = useState();
  const dispatch = useDispatch();

  if (gameweek && selectorDisabled && status !== 'pending') {
    setSelectorDisabled(false);
  }

  if (status === 'pending' && !selectorDisabled) {
    setSelectorDisabled(true);
  }

  return (
    <div className="m-0 row">
      <div className="col-lg-4 left-col-prediction-outer-container">
        <HomepageButton />
        {successMessage && (
        <Alert variant="success" dismissible onClose={() => setSuccessMessage('')}>
          {`${successMessage} - `}
          <strong>
            {`${successCount} attempt(s)`}
          </strong>
        </Alert>
        )}
        <div className="left-col-prediction-container">
          <h1 className="left-col-prediction-text">Predictions</h1>
          <DropdownSelector
            enabled={selectorDisabled}
            length={38}
            onValueUpdate={(e) => dispatch(getPredictions(e.target.value))}
            startingValue={gameweek}
          />
          <input disabled={!submitEnabled} className="predictions-form-submit-button" type="submit" value="Submit" form="predictions-form" />
        </div>
      </div>
      <div className="col-lg-8 right-col">
        <form id="predictions-form" className="predictions-form" onSubmit={(e) => handleSubmit(e, setSubmitEnabled, setSuccessMessage, successCount, setSuccessCount)}>
          {userPredictions.map((match) => {
            const kickOffTime = new Date(match.kick_off_time);
            // eslint-disable-next-line no-underscore-dangle
            return <PredictionRow key={match._id} kickOffTime={kickOffTime} match={match} />;
          })}
          <input disabled={!submitEnabled} className="predictions-form-submit-button predictions-form-submit-button-mobile" type="submit" value="Submit" form="predictions-form" />
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

  const [bankerEnabled, setBankerEnabled] = useState(!!match.user_predictions[0].banker);
  const [insuranceEnabled, setInsuranceEnabled] = useState(!!match.user_predictions[0].insurance);

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
            <input className="prediction-score-input" disabled={!!match.locked} name={`${match._id}[home-pred]`} type="number" style={{ textAlign: 'center', backgroundColor: match.locked ? '#c5ccd6' : '' }} defaultValue={match.user_predictions[0].home_pred} />
            -
            {/* eslint-disable-next-line no-underscore-dangle */}
            <input className="prediction-score-input" disabled={!!match.locked} name={`${match._id}[away-pred]`} type="number" style={{ textAlign: 'center', backgroundColor: match.locked ? '#c5ccd6' : '' }} defaultValue={match.user_predictions[0].away_pred} />
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
    user_predictions: PropTypes.arrayOf(PropTypes.shape({
      home_pred: PropTypes.string,
      away_pred: PropTypes.string,
      banker: PropTypes.bool,
      insurance: PropTypes.bool,
    })),
  }).isRequired,
};

export default Predictions;
