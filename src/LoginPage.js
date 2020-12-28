import React from 'react'
import { Button, FormGroup, FormControl, FormLabel, Alert } from "react-bootstrap"
import { Link } from 'react-router-dom';

class LoginPage extends React.Component {
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

    fetch('http://127.0.0.1:5000/login', requestOptions).then((res) => {
      if (res.status === 200) {
        window.location.reload(false)
      } else {
        this.setState({
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
      <div className="login-form">
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
            Login
          </Button>
        </form>
        <Link to='/register'><Button block style={{marginTop: 10}}>Sign up</Button></Link>
      </div>
    )
  }
}

export default LoginPage