import React, { useState } from 'react';
import './Predictions.css';
import { useDispatch, useSelector } from 'react-redux';
import { Alert } from 'react-bootstrap';
import DropdownSelector from '../DropdownSelector';
import HomepageButton from '../HomepageButton';
import baseUrl from '../globals';
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

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitEnabled(false);

    const data = new FormData(e.target);

    const predsData = [];
    for (let i = 0; i < data.entries().length; i += 1) {
      const key = data.entries()[i];
      const value = data.entries()[i];
      const predType = key.split('[')[1].split(']')[0];
      const predNum = value;
      const gameID = key.split('[')[0];

      const exists = predsData.some((pred) => pred.game_id === gameID);
      if (!exists) {
        predsData.push({ game_id: gameID });
      }

      const predIndex = predsData.findIndex((pred) => pred.game_id === gameID);
      if (predType === 'home-pred') {
        predsData[predIndex].home_pred = predNum;
      }
      if (predType === 'away-pred') {
        predsData[predIndex].away_pred = predNum;
      }
    }

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ predictions: predsData }),
      credentials: 'include',
    };

    fetch(`${baseUrl}/updatemanypredictions`, requestOptions).then((res) => {
      if (res.status === 200) {
        setSuccessMessage('Your predictions have been updated');
        setSuccessCount(successCount + 1);
      }
      setSubmitEnabled(true);
    });
  };

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
        <form id="predictions-form" className="predictions-form" onSubmit={handleSubmit}>
          {userPredictions.map((match) => {
            const kickOffTime = new Date(match.kick_off_time);
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
                    </div>
                    <div className="away-team-container">
                      <img alt="away club badge" className="club-badge" height={70} src={`/badges/${match.away_team}.png`} />
                      <span className="prediction-circle" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          <input disabled={!submitEnabled} className="predictions-form-submit-button predictions-form-submit-button-mobile" type="submit" value="Submit" form="predictions-form" />
        </form>
      </div>
    </div>
  );
};

export default Predictions;