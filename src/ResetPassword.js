import React, {useState} from 'react'
import {FormControl, FormGroup, Container, Button} from 'react-bootstrap'
import base_url from './globals'
import {Redirect} from 'react-router-dom'
import {useDispatch} from 'react-redux'
import {updateAlert} from './Alerts/alertsSlice'

const ResetPassword = () => {
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
    const username = data.get('username')

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({username: username}),
      credentials: 'include'
    }

    fetch(base_url+'/resetpassword', requestOptions).then(async (res) => {
      if (res.status === 200) {
        dispatch(updateAlert({message: 'Please check your email for a link.', variant: 'success'}))
        setRedirect('/')
      } else {
        setButtonEnabled(true)
        const data = await res.json()
        dispatch(updateAlert({message: data, variant: 'danger'}))
      }
    })
  }

  if (redirect) {
    return <Redirect to={redirect} />
  }
  return(
    <div className='standalone-outer-container'>
      <Container className='standalone-inner-container' style={{maxWidth: 400}}>
        <form onSubmit={handleSubmit}>
          <FormGroup controlId="username" bssize="large">
            <img style={{width:50, display: 'block', margin: 'auto'}} src={require('./icons/football.png')} alt='football icon' />
            <p style={{textAlign: 'center', fontSize: 14, margin: '20px 0'}}>Sign in to view, make and share predictions with live results and scoring.</p>
            <FormControl
              className='form-field'
              placeholder='Username'
              autoFocus
              name="username"
            />
          </FormGroup>
          <Button disabled={!buttonEnabled} className='standalone-submit-button main-form-button form-buttons' size="lg" type="submit">
            Reset
          </Button>
        </form>
      </Container>
    </div>
  )
}

export default ResetPassword