import React from 'react'
import {Button, FormControl, FormGroup, Alert, Container} from 'react-bootstrap'
import {Link} from 'react-router-dom'
import base_url from './globals'

class Register extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      username: '',
      password: '',
      errorMessage: '',
      errorCount: 0
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
    const username = this.state.username
    const password = this.state.password

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({username: username, password:password}),
      credentials: 'include'
    }

    fetch(base_url+'/register', requestOptions).then((res) => {
      if (res.status === 200) {
        window.location.href = '/'
      } else {
        return res
      }
    }).then((res) => res.json()).then((data) => {
      this.setState({
        errorCount: this.state.errorCount + 1,
        errorMessage: data.message
      })
    })
  }

  updateUsername(event) {
    this.setState({username: event.target.value});
  }
  updatePassword(event) {
    this.setState({password: event.target.value});
  }

  render() {
    return(
      <div className='register-form'>
        <Container style={{maxWidth: 400}}>
          {this.state.errorMessage && <Alert variant="danger">{this.state.errorMessage} - <strong>{this.state.errorCount} attempt(s)</strong></Alert>}
          <form onSubmit={this.handleSubmit}>
            <FormGroup controlId="username" bssize="large">
              <img style={{width:50, display: 'block', margin: 'auto'}} src={require('./icons/football.png')} alt='football icon' />
              <p style={{textAlign: 'center', fontSize: 14, margin: '20px 0'}}>Sign up to view, make and share predictions with live results and scoring.</p>
              <FormControl
                className='form-field'
                placeholder="Username"
                autoFocus
                type="username"
                value={this.state.username}
                onChange={this.updateUsername}
              />
            </FormGroup>
            <FormGroup controlId="password" bssize="large">
              <FormControl
                className='form-field'
                placeholder="Password"
                value={this.state.password}
                type="password"
                onChange={this.updatePassword}
              />
            </FormGroup>
            <Link className='form-buttons secondary-form-button' to='/'>Login</Link>
            <Button className='form-buttons main-form-button' size='lg' disabled={!this.validateForm()} type="submit">
              Sign up
            </Button>
          </form>
        </Container>
      </div>
    )
  }
}

export default Register