import React, { useState } from 'react';
import {
  Button, FormControl, FormGroup, Alert, Container,
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import handleSubmit from './RegisterLogic';

const Register = ({ popupOpen, setPopupOpen }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [errorCount, setErrorCount] = useState(0);
  const [buttonEnabled, setButtonEnabled] = useState(true);

  const validateForm = () => username.length > 0 && password.length > 0 && email.length > 0;

  return (
    <div className="login-popup" style={{ display: popupOpen ? 'flex' : 'none' }}>
      <Container style={{ maxWidth: 400 }} className="login-popup-content">
        <button type="button" alt="close-button" style={{ background: 'url(/icons/cross.png)' }} className="login-popup-close" onClick={() => setPopupOpen(false)} />
        {errorMessage && (
        <Alert variant="danger">
          {`${errorMessage} - `}
          <strong>{`${errorCount} attempt(s)`}</strong>
        </Alert>
        )}
        <form onSubmit={(e) => handleSubmit(e,
          buttonEnabled,
          setButtonEnabled,
          username,
          password,
          email,
          setErrorCount,
          errorCount,
          setErrorMessage)}
        >
          <FormGroup controlId="username" bssize="large">
            <img style={{ width: 50, display: 'block', margin: 'auto' }} src="/icons/football.png" alt="football icon" />
            <p style={{ textAlign: 'center', fontSize: 14, margin: '20px 0' }}>Sign up to view, make and share predictions with live results and scoring.</p>
            <FormControl
              className="form-field"
              placeholder="Username"
              autoFocus
              type="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </FormGroup>
          <FormGroup controlId="email" bssize="large">
            <FormControl
              className="form-field"
              placeholder="Email"
              autoFocus
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormGroup>
          <FormGroup controlId="password" bssize="large">
            <FormControl
              className="form-field"
              placeholder="Password"
              value={password}
              type="password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormGroup>
          <Link className="form-buttons secondary-form-button" to="/">Login</Link>
          <Button className="form-buttons main-form-button" size="lg" disabled={!validateForm() || !buttonEnabled} type="submit">
            Sign up
          </Button>
        </form>
      </Container>
    </div>
  );
};

Register.propTypes = {
  popupOpen: PropTypes.bool.isRequired,
  setPopupOpen: PropTypes.func.isRequired,
};

export default Register;
