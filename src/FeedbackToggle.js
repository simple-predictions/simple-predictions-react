import React from 'react'
import './Feedback.css'
import {withRouter} from 'react-router-dom'

const FeedbackToggle = (props) => {
  return (
    <div style={{backgroundColor: (window.location.pathname === '/' && props.apiCookie) ? 'black' : '', color: (window.location.pathname === '/' && props.apiCookie) ? '#defc5f' : ''}} onClick={() => {props.onTogglePopup()}} className='feedback-toggle'>
      <div>Feedback</div>
    </div>
  )
}

export default withRouter(FeedbackToggle)