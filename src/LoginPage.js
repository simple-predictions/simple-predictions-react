import React from 'react'
import { Button, FormGroup, FormControl, Alert, Container } from "react-bootstrap"
import { Link } from 'react-router-dom';
import './LoginPage.css'
import base_url from './globals'

class LoginPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      username: '',
      password: '',
      errorMessage: '',
      errorCount: 0,
      buttonEnabled: true
    }
    this.updateUsername = this.updateUsername.bind(this)
    this.updatePassword = this.updatePassword.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  validateForm() {
    return this.state.username.length > 0 && this.state.password.length > 0;
  }

  handleSubmit(event) {
    event.preventDefault();
    if (this.state.buttonEnabled === false) {
      return
    }
    this.setState({
      buttonEnabled: false
    })
    const username = this.state.username
    const password = this.state.password

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({username: username, password:password}),
      credentials: 'include'
    }

    fetch(base_url+'/login', requestOptions).then((res) => {
      if (res.status === 200) {
        window.location.reload(false)
      } else {
        this.setState({
          buttonEnabled: true,
          errorCount: this.state.errorCount + 1,
          errorMessage: 'Your username or password is incorrect. Please try again'
        })
      }
    })
  }

  updateUsername(event) {
    this.setState({username: event.target.value});
  }
  updatePassword(event) {
    this.setState({password: event.target.value});
  }
  render() {
    return (
      <Container style={{maxWidth: 400}}>
        {this.state.errorMessage && <Alert variant="danger">{this.state.errorMessage} - <strong>{this.state.errorCount} attempt(s)</strong></Alert>}
        <form onSubmit={this.handleSubmit}>
          <FormGroup controlId="username" bssize="large">
            <img style={{width:50, display: 'block', margin: 'auto'}} src={require('./icons/football.png')} alt='football icon' />
            <p style={{textAlign: 'center', fontSize: 14, margin: '20px 0'}}>Sign in to view, make and share predictions with live results and scoring.</p>
            <FormControl
              className='form-field'
              placeholder='Username'
              autoFocus
              type="username"
              value={this.state.username}
              onChange={this.updateUsername}
            />
          </FormGroup>
          <FormGroup controlId="password" bssize="large">
            <FormControl
              className='form-field'
              placeholder='Password'
              value={this.state.password}
              type="password"
              onChange={this.updatePassword}
            />
          </FormGroup>
          <Link className='secondary-form-button form-buttons' to='/register'>Sign up</Link>
          <Button className='main-form-button form-buttons' size="lg" disabled={!this.validateForm() || !this.state.buttonEnabled} type="submit">
            Login
          </Button>
        </form>
        <Link style={{textAlign: 'right', width: '100%', marginTop:10}} className='secondary-form-button form-buttons' to='/resetpassword'>Forgot password</Link>
      </Container>
    )
  }
}

export default LoginPage