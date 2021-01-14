import React from 'react'
import './LoginPage.css'
import LoginPage from './LoginPage'
import Register from './Register'
import ResetPassword from './ResetPassword'
import CreateNewPassword from './CreateNewPassword'

const FrontPage = ({widget, location}) => {
  window.scrollTo(0, 0)
  
  return (
    <div className="login-form">
      <div className="front-page-top">
        <div className='text-container'>
          <h1 className='site-header'>SALT BEEF<br />LEAGUE</h1>
          <h4 className='site-tagline'>Predictions. Results. Live Scores.</h4>
        </div>
      </div>
      <div className='front-page-scrollover'>
        <div className='row m-0'>
          <div className='col-md-7 widget-container'>
            {widget === 'Login' ? <LoginPage /> : widget === 'Register' ? <Register /> : widget === 'Reset Password' ? <ResetPassword /> : <CreateNewPassword location={location} />}
          </div>
          <div className='col-md-5 d-none d-lg-block d-xl-block saltbeef-background-col'>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FrontPage