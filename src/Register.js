import React from 'react'
import {Button, FormLabel, FormControl, FormGroup, Alert} from 'react-bootstrap'

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

    fetch('http://127.0.0.1:5000/register', requestOptions).then((res) => {
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
        <h3 style={{textAlign: 'center'}}>Sign up</h3>
        {this.state.errorMessage && <Alert variant="danger">{this.state.errorMessage} - <strong>{this.state.errorCount} attempt(s)</strong></Alert>}
        <form onSubmit={this.handleSubmit}>
          <FormGroup controlId="username" bssize="large">
            <FormLabel>Username</FormLabel>
            <FormControl
              autoFocus
              type="username"
              value={this.state.username}
              onChange={this.updateUsername}
            />
          </FormGroup>
          <FormGroup controlId="password" bssize="large">
            <FormLabel>Password</FormLabel>
            <FormControl
              value={this.state.password}
              type="password"
              onChange={this.updatePassword}
            />
          </FormGroup>
          <Button block bssize="large" disabled={!this.validateForm()} type="submit">
            Register
          </Button>
        </form>
      </div>
    )
  }
}

export default Register