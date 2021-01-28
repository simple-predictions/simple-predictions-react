import React, { useState } from 'react';
import {
  FormControl, FormGroup, Container, Button,
} from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import handleSubmit from './ResetPasswordLogic';

const ResetPassword = () => {
  const dispatch = useDispatch();
  const [redirect, setRedirect] = useState();
  const [buttonEnabled, setButtonEnabled] = useState(true);

  if (redirect) {
    return <Redirect to={redirect} />;
  }
  return (
    <div className="standalone-outer-container">
      <Container className="standalone-inner-container" style={{ maxWidth: 400 }}>
        <form onSubmit={(e) => handleSubmit(
          e,
          buttonEnabled,
          setButtonEnabled,
          dispatch,
          setRedirect,
        )}
        >
          <FormGroup controlId="username" bssize="large">
            <img style={{ width: 50, display: 'block', margin: 'auto' }} src="/icons/football.png" alt="football icon" />
            <p style={{ textAlign: 'center', fontSize: 14, margin: '20px 0' }}>Sign in to view, make and share predictions with live results and scoring.</p>
            <FormControl
              className="form-field"
              placeholder="Username"
              autoFocus
              name="username"
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

export default ResetPassword;
