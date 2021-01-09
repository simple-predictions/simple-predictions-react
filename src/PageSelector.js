import React from 'react'
import Cookies from 'js-cookie'
import './PageSelector.css'
import {Link} from 'react-router-dom'
import {Form, InputGroup, Alert} from 'react-bootstrap'

class PageSelector extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      user: {}
    }

    this.handleSubmit = this.handleSubmit.bind(this)
  }
  componentDidMount() {
    fetch('http://192.168.0.16:5000/userinfo', {credentials: 'include'}).then(response => {
      if (response.status === 401) {
        Cookies.remove('connect.sid')
        this.props.clearApiCookie()
        return []
      }
      return response.json()
    }).then(data => {
      this.setState({
        user: data
      })
    })
  }

  handleSubmit(event) {
    event.preventDefault()
    const data = new FormData(event.target);
    const friend_username = data.get('friend-username')

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({username: friend_username}),
      credentials: 'include'
    }

    fetch('http://192.168.0.16:5000/addfriend', requestOptions).then(res => {
      this.setState({
        responseStatus: res.status
      })
      return res.json()
    }).then(data => {
      this.setState({
        responseMessage: data
      })
    })
  }

  render() {
    return (
      <div className='m-0 row selector'>
        <div className='col-md-4 left-col'>
          <div className='left-col-container'>
            <h1 className='left-col-text'>Hi {this.state.user.username}</h1>
            <h4 className='left-col-follow-text'>Follow someone</h4>
            <Form style={{marginBottom: 10}} onSubmit={this.handleSubmit}>
              <InputGroup>
                <InputGroup.Prepend>
                  <InputGroup.Text>@</InputGroup.Text>
                </InputGroup.Prepend>
                <Form.Control placeholder='Username' type='text' name='friend-username' />
              </InputGroup>
            </Form>
            {this.state.responseMessage && <Alert variant={this.state.responseStatus >= 400 ? 'danger' : 'success'}>{this.state.responseMessage}</Alert>}
          </div>
        </div>
        <div className='col-md-8 selector-col'>
          <div className='row'>
            <div className='col-md-2'></div>
              <div className='col-md-2'>
                <span className='option-circle' />
                <Link to='/predictions' className='option-icon'>
                  <img alt='question mark icon' className='option-icon' height={50} src={require('./icons/question-mark.png')}/>
                </Link>
              </div>
              <div className='col-md-6'>
                <div className='selector-option-container'>
                  <h4 className='option-title text-md-left text-center'>Predictions</h4>
                  <h4 className='option-description text-md-left text-center'>Predict the results of the Premier League games</h4>
                </div>
              </div>
            <div className='col-md-2 last-col'></div>
          </div>
          <div className='row'>
            <div className='col-md-2'></div>
            <div className='col-md-2'>
              <span className='option-circle' />
              <Link to='/minileagues' className='option-icon'>
                <img alt='trophy icon' className='option-icon' height={50} src={require('./icons/trophy.png')}/>
              </Link>
            </div>
            <div className='col-md-6'>
              <div className='selector-option-container'>
                <h4 className='option-title text-md-left text-center'>Mini-leagues</h4>
                <h4 className='option-description text-md-left text-center'>Compare your predictions against your competitors</h4>
              </div>
            </div>
            <div className='col-md-2 last-col'></div>
          </div>
          <div className='row'>
            <div className='col-md-2'></div>
            <div className='col-md-2'>
              <span className='option-circle' />
              <Link to='/scores' className='option-icon'>
                <img alt='correct icon' className='option-icon' height={50} src={require('./icons/correct.png')}/>
              </Link>
            </div>
            <div className='col-md-6'>
              <div className='selector-option-container'>
                <h4 className='option-title text-md-left text-center'>Scores</h4>
                <h4 className='option-description text-md-left text-center'>Watch your scores as the goals come in</h4>
              </div>
            </div>
            <div className='col-md-2 last-col'></div>
          </div>
        </div>
      </div>
    )
  }
}

export default PageSelector