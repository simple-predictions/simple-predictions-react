import React, { useState } from 'react';
import {
  FormControl, FormGroup, Container, Button,
} from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { Redirect } from 'react-router-dom';
import ReactRouterPropTypes from 'react-router-prop-types';
import baseUrl from './globals';
import { updateAlert } from './Alerts/alertsSlice';

const CreateNewPassword = ({ location }) => {
  CreateNewPassword.propTypes = {
    location: ReactRouterPropTypes.location.isRequired,
  };

  const dispatch = useDispatch();
  const [redirect, setRedirect] = useState();
  const [buttonEnabled, setButtonEnabled] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (buttonEnabled === false) {
      return;
    }
    setButtonEnabled(false);

    const formData = new FormData(e.target);
    const password = formData.get('password');
    const params = new URLSearchParams(location.search);
    const verificationToken = params.get('verification_token');
    const username = params.get('username');

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, verification_token: verificationToken, password }),
      credentials: 'include',
    };

    fetch(`${baseUrl}/createnewpassword`, requestOptions).then(async (res) => {
      if (res.status === 200) {
        setRedirect('/');
        dispatch(updateAlert({ message: 'Your password has been updated. Please login below.', variant: 'success' }));
      } else {
        setButtonEnabled(true);
        const data = await res.json();
        dispatch(updateAlert({ message: data, variant: 'danger' }));
      }
    });
  };

  if (redirect) {
    return <Redirect to={redirect} />;
  }
  return (
    <div className="standalone-outer-container">
      <Container className="standalone-inner-container" style={{ maxWidth: 400 }}>
        <form onSubmit={handleSubmit}>
          <FormGroup controlId="username" bssize="large">
            <img style={{ width: 50, display: 'block', margin: 'auto' }} src="/icons/football.png" alt="football icon" />
            <p style={{ textAlign: 'center', fontSize: 14, margin: '20px 0' }}>Sign in to view, make and share predictions with live results and scoring.</p>
            <FormControl
              className="form-field"
              placeholder="New password"
              autoFocus
              name="password"
            />
          </FormGroup>
          <Button disabled={!buttonEnabled} className="standalone-submit-button main-form-button form-buttons" size="lg" type="submit">
            Reset
          </Button>
        </form>
      </Container>
    </div>
  );
};

export default CreateNewPassword;
