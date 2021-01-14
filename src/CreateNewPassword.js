import React, {useState} from 'react'
import {FormControl, FormGroup, Container, Button} from 'react-bootstrap'
import base_url from './globals'
import {Redirect} from 'react-router-dom'
import {useDispatch} from 'react-redux'
import {updateAlert} from './Alerts/alertsSlice'

const CreateNewPassword = ({location}) => {
  const dispatch = useDispatch()
  const [redirect, setRedirect] = useState()
  const [buttonEnabled, setButtonEnabled] = useState(true)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (buttonEnabled === false) {
      return
    }
    setButtonEnabled(false)

    const data = new FormData(e.target)
    const password = data.get('password')
    const params = new URLSearchParams(location.location.search);
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
        setRedirect('/')
        dispatch(updateAlert({message: 'Your password has been updated. Please login below.', variant: 'success'}))
      } else {
        setButtonEnabled(true)
        const data = await res.json()
        dispatch(updateAlert({message: data, variant: 'danger'}))
        this.props.updateAlertMessage(data, 'danger')
      }
    })
  }

  if (redirect) {
    return <Redirect to={redirect} />
  }
  return(
    <Container style={{maxWidth: 400}}>
      <form onSubmit={handleSubmit}>
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
        <Button disabled={!buttonEnabled} className='main-form-button form-buttons' size="lg" type="submit">
          Reset
        </Button>
      </form>
    </Container>
  )
}

export default CreateNewPassword