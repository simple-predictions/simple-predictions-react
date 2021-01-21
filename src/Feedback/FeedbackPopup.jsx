import React, { useState } from 'react';
import {
  FormGroup, Button, FormControl, FormLabel,
} from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import publicIp from 'public-ip';
import baseUrl from '../globals';
import { selectPopupOpen, closePopup } from './feedbackSlice';
import { selectUserUsername, selectUserEmail } from '../User/userSlice';
import { updateAlert } from '../Alerts/alertsSlice';

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

  const setIP = async () => {
    const ip = await publicIp.v4();
    setipAddress(ip);
  };

  setIP();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (buttonEnabled === false) {
      return;
    }
    setButtonEnabled(false);
    const data = new FormData(e.target);
    const issuetype = data.get('issuetype');

    const reqBody = {
      fields: {
        project: {
          key: 'MAIN',
        },
        parent: {
          key: 'MAIN-2',
        },
        summary,
        description: {
          type: 'doc',
          version: 1,
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  text: description,
                  type: 'text',
                },
              ],
            },
          ],
        },
        customfield_10031: username,
        customfield_10033: email,
        customfield_10029: window.location.pathname,
        customfield_10036: ipAddress,
        issuetype: {
          name: issuetype,
        },
      },
    };

    if (issuetype === 'Bug') {
      // Include some extra debugging info
      reqBody.fields.customfield_10032 = window.navigator.userAgent;
    }

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reqBody),
      credentials: 'include',
    };

    fetch(`${baseUrl}/create-jira-issue`, requestOptions).then(() => {
      setButtonEnabled(true);
      setSummary('');
      setDescription('');
    });
    dispatch(updateAlert({ message: 'Your feedback has been recorded. Thank you!' }));
    dispatch(closePopup());
  };

  return (
    <div className="feedback-popup" style={{ display: display ? 'flex' : 'none' }}>
      <div className="feedback-popup-content">
        <h1>Send feedback</h1>
        <button type="button" onClick={() => dispatch(closePopup())} alt="close-button" style={{ background: `url(${crossIcon})` }} className="feedback-popup-close" />
        <form onSubmit={handleSubmit}>
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
