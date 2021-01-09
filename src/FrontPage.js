import React from 'react'
import './LoginPage.css'
import LoginPage from './LoginPage'
import Register from './Register'
import base_url from './globals'

class FrontPage extends React.Component {
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
  componentDidMount() {
    window.scrollTo(0, 0)
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

    fetch(base_url+'/login', requestOptions).then((res) => {
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
        <div className="front-page-top">
          <div className='text-container'>
            <h1 className='site-header'>SALT BEEF<br />LEAGUE</h1>
            <h4 className='site-tagline'>Predictions. Results. Live Scores.</h4>
          </div>
        </div>
        <div className='front-page-scrollover'>
          <div className='row m-0'>
            <div className='col-md-7 widget-container'>
              {this.props.widget === 'Login' ? <LoginPage /> : <Register />}
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