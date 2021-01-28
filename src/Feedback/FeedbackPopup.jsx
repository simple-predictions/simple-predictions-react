import React, { useState } from 'react';
import {
  FormGroup, Button, FormControl, FormLabel,
} from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { selectPopupOpen, closePopup } from './feedbackSlice';
import { selectUserUsername, selectUserEmail } from '../User/userSlice';
import { updateAlert } from '../Alerts/alertsSlice';
import { handleSubmit, setIP } from '../Logic/FeedbackLogic';

const crossIcon = require('../icons/cross.png');

const FeedbackPopup = () => {
  const display = useSelector(selectPopupOpen);
  const [summary, setSummary] = useState('');
  const [description, setDescription] = useState('');
  const [buttonEnabled, setButtonEnabled] = useState(true);
  const [ipAddress, setipAddress] = useState('');
  const username = useSelector(selectUserUsername);
  const email = useSelector(selectUserEmail);
  const dispatch = useDispatch();

  setIP(setipAddress);
  return (
    <div className="feedback-popup" style={{ display: display ? 'flex' : 'none' }}>
      <div className="feedback-popup-content">
        <h1>Send feedback</h1>
        <button type="button" onClick={() => dispatch(closePopup())} alt="close-button" style={{ background: `url(${crossIcon})` }} className="feedback-popup-close" />
        <form onSubmit={(e) => handleSubmit(
          e,
          buttonEnabled,
          setButtonEnabled,
          summary,
          description,
          username,
          email,
          ipAddress,
          setSummary,
          setDescription,
          updateAlert,
          closePopup,
          dispatch,
        )}
        >
          <FormGroup controlId="issuetype" bssize="large">
            <FormLabel>Issue Type</FormLabel>
            <select name="issuetype">
              <option value="Bug">Something&#39;s gone wrong</option>
              <option value="Feedback">Feedback/Suggestion</option>
            </select>
          </FormGroup>
          <FormGroup controlId="summary" bssize="large">
            <FormLabel>Brief Summary</FormLabel>
            <FormControl
              className="form-field"
              autoFocus
              name="summary"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
            />
          </FormGroup>
          <FormGroup controlId="description" bssize="large">
            <FormLabel>Description</FormLabel>
            <FormControl
              as="textarea"
              className="form-field"
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </FormGroup>
          <Button disabled={!buttonEnabled} size="lg" type="submit">
            Submit
          </Button>
        </form>
      </div>
    </div>
  );
};

export default FeedbackPopup;
