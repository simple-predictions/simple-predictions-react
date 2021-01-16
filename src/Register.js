import React, {useState} from 'react'
import {Button, FormControl, FormGroup, Alert, Container} from 'react-bootstrap'
import {Link} from 'react-router-dom'
import base_url from './globals'

const Register = ({popupOpen, setPopupOpen}) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [errorCount, setErrorCount] = useState(0)
  const [buttonEnabled, setButtonEnabled] = useState(true)

  const handleSubmit = (e) => {
    e.preventDefault();
    if (buttonEnabled === false) {
      return
    }
    setButtonEnabled(false)

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({username: username, password:password, email: email}),
      credentials: 'include'
    }

    fetch(base_url+'/register', requestOptions).then((res) => {
      if (res.status === 200) {
        window.location.href = '/'
      } else {
        return res
      }
    }).then((res) => res.json()).then((data) => {
      setErrorCount(errorCount + 1)
      setErrorMessage(data.message)
      setButtonEnabled(true)
    })
  }

  const validateForm = () => {
    return username.length > 0 && password.length > 0 && email.length > 0;
  }

  return(
    <div className='login-popup' style={{display: popupOpen ? 'flex' : 'none'}}>
      <Container style={{maxWidth: 400}} className='login-popup-content'>
        <img alt='close-button' src={require('./icons/cross.png')} className="login-popup-close" onClick={() => setPopupOpen(false)} />
        {errorMessage && <Alert variant="danger">{errorMessage} - <strong>{errorCount} attempt(s)</strong></Alert>}
        <form onSubmit={handleSubmit}>
          <FormGroup controlId="username" bssize="large">
            <img style={{width:50, display: 'block', margin: 'auto'}} src={require('./icons/football.png')} alt='football icon' />
            <p style={{textAlign: 'center', fontSize: 14, margin: '20px 0'}}>Sign up to view, make and share predictions with live results and scoring.</p>
            <FormControl
              className='form-field'
              placeholder="Username"
              autoFocus
              type="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </FormGroup>
          <FormGroup controlId="email" bssize="large">
            <FormControl
                className='form-field'
                placeholder="Email"
                autoFocus
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
          </FormGroup>
          <FormGroup controlId="password" bssize="large">
            <FormControl
              className='form-field'
              placeholder="Password"
              value={password}
              type="password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormGroup>
          <Link className='form-buttons secondary-form-button' to='/'>Login</Link>
          <Button className='form-buttons main-form-button' size='lg' disabled={!validateForm() || !buttonEnabled} type="submit">
            Sign up
          </Button>
        </form>
      </Container>
    </div>
  )
}

export default Register