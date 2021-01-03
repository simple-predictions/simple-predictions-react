import React from 'react'
import Cookies from 'js-cookie'
import './PageSelector.css'
import {Link} from 'react-router-dom'

class PageSelector extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      user: {}
    }
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

  render() {
    return (
      <div className='m-0 row selector'>
        <div className='col-md-4 left-col'>
          <div className='left-col-container'>
            <h1 className='left-col-text'>Hi {this.state.user.username}</h1>
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
                  <h4 className='option-title'>Predictions</h4>
                  <h4 className='option-description'>Predict the results of the Premier League games</h4>
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
                <h4 className='option-title'>Mini-leagues</h4>
                <h4 className='option-description'>Compare your predictions against your friends</h4>
              </div>
            </div>
            <div className='col-md-2 last-col'></div>
          </div>
          <div className='row'>
            <div className='col-md-2'></div>
            <div className='col-md-2'>
              <span className='option-circle' />
              <img alt='correct icon' className='option-icon' height={50} src={require('./icons/correct.png')}/>
            </div>
            <div className='col-md-6'>
              <div className='selector-option-container'>
                <h4 className='option-title'>Scores</h4>
                <h4 className='option-description'>Watch your scores as the goals come in</h4>
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