import React from 'react'
import './LoginPage.css'
import LoginPage from './LoginPage'
import Register from './Register'
import ResetPassword from './ResetPassword'
import CreateNewPassword from './CreateNewPassword'

class FrontPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      errorMessage: '',
      errorCount: 0
    }
  }
  componentDidMount() {
    window.scrollTo(0, 0)
  }
  
  render() {
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
              {this.props.widget === 'Login' ? <LoginPage /> : this.props.widget === 'Register' ? <Register /> : this.props.widget === 'Reset Password' ? <ResetPassword updateAlertMessage={this.props.updateAlertMessage} /> : <CreateNewPassword updateAlertMessage={this.props.updateAlertMessage} location={this.props.location} />}
            </div>
            <div className='col-md-5 d-none d-lg-block d-xl-block saltbeef-background-col'>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default FrontPage