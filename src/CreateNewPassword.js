import React from 'react'
import {FormControl, FormGroup, Container, Button} from 'react-bootstrap'
import base_url from './globals'
import {Redirect} from 'react-router-dom'

class CreateNewPassword extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      redirect: null,
      buttonEnabled: true
    }
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  handleSubmit(event) {
    event.preventDefault()
    this.setState({
      buttonEnabled: false
    })
    const data = new FormData(event.target)
    const password = data.get('password')
    const params = new URLSearchParams(this.props.location.location.search);
    const verification_token = params.get('verification_token');
    const username = params.get('username')

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({username: username, verification_token: verification_token, password: password}),
      credentials: 'include'
    }
    
    fetch(base_url+'/createnewpassword', requestOptions).then(async (res) => {
      if (res.status === 200) {
        this.setState({
          redirect: '/'
        })
        this.props.updateAlertMessage('Your password has been updated. Please login below.', 'success')
      } else {
        this.setState({
          buttonEnabled: true
        })
        const data = await res.json()
        this.props.updateAlertMessage(data, 'danger')
      }
    })
  }

  render() {
    if (this.state.redirect) {
      console.log(this.state.redirect)
      return <Redirect to={this.state.redirect} />
    }
    return(
      <Container style={{maxWidth: 400}}>
        <form onSubmit={this.handleSubmit}>
          <FormGroup controlId="username" bssize="large">
            <img style={{width:50, display: 'block', margin: 'auto'}} src={require('./icons/football.png')} alt='football icon' />
            <p style={{textAlign: 'center', fontSize: 14, margin: '20px 0'}}>Sign in to view, make and share predictions with live results and scoring.</p>
            <FormControl
              className='form-field'
              placeholder='New password'
              autoFocus
              name="password"
            />
          </FormGroup>
          <Button disabled={!this.state.buttonEnabled} className='main-form-button form-buttons' size="lg" type="submit">
            Reset
          </Button>
        </form>
      </Container>
    )
  }
}

export default CreateNewPassword