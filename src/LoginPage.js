import React, {useState} from 'react'
import { Button, FormGroup, FormControl, Alert, Container } from "react-bootstrap"
import { Link } from 'react-router-dom';
import './LoginPage.css'
import base_url from './globals'
import {getUserInfo} from './User/userSlice'
import {useDispatch} from 'react-redux'

const LoginPage = ({popupOpen, setPopupOpen}) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [errorCount, setErrorCount] = useState(0)
  const [buttonEnabled, setButtonEnabled] = useState(true)
  const dispatch = useDispatch()

  const validateForm = () => {
    return username.length > 0 && password.length > 0;
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    if (buttonEnabled === false) {
      return
    }
    setButtonEnabled(false)

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({username: username, password:password}),
      credentials: 'include'
    }

    fetch(base_url+'/login', requestOptions).then((res) => {
      if (res.status === 200) {
        dispatch(getUserInfo())
      } else {
        setButtonEnabled(true)
        setErrorCount(errorCount + 1)
        setErrorMessage('Your username or password is incorrect. Please try again')
      }
    })
  }

  return (
    <div className='login-popup' style={{display: popupOpen ? 'flex' : 'none'}}>
      <Container style={{maxWidth: '90vw'}} className='login-popup-content'>
        <img alt='close-button' src={require('./icons/cross.png')} className="login-popup-close" onClick={() => setPopupOpen(false)} />
        {errorMessage && <Alert variant="danger">{errorMessage} - <strong>{errorCount} attempt(s)</strong></Alert>}
        <form onSubmit={handleSubmit}>
          <FormGroup controlId="username" bssize="large">
            <img style={{width:50, display: 'block', margin: 'auto'}} src={require('./icons/football.png')} alt='football icon' />
            <p style={{textAlign: 'center', fontSize: 14, margin: '20px 0'}}>Sign in to view, make and share predictions with live results and scoring.</p>
            <FormControl
              className='form-field'
              placeholder='Username'
              autoFocus
              type="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </FormGroup>
          <FormGroup controlId="password" bssize="large">
            <FormControl
              className='form-field'
              placeholder='Password'
              value={password}
              type="password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormGroup>
          <Link className='secondary-form-button form-buttons' to='/register'>Sign up</Link>
          <Button className='main-form-button form-buttons' size="lg" disabled={!validateForm() || !buttonEnabled} type="submit">
            Login
          </Button>
        </form>
        <Link style={{textAlign: 'right', width: '100%', marginTop:10}} className='secondary-form-button form-buttons' to='/resetpassword'>Forgot password</Link>
      </Container>
    </div>
  )
}

export default LoginPage