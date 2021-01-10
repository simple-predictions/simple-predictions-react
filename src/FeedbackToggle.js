import React from 'react'
import './Feedback.css'
import {withRouter} from 'react-router-dom'

const FeedbackToggle = (props) => {
  return (
    <div>
      <div style={{backgroundColor: (window.location.pathname === '/' && props.apiCookie) ? 'black' : '', color: (window.location.pathname === '/' && props.apiCookie) ? '#defc5f' : ''}} onClick={() => {props.onTogglePopup()}} className='feedback-toggle'>
        <div>Feedback</div>
      </div>
      <div style={{borderBottomColor: (window.location.pathname === '/' && props.apiCookie) ? 'black' : '', color: (window.location.pathname === '/' && props.apiCookie) ? '#defc5f' : ''}} onClick={() => {props.onTogglePopup()}} className='feedback-toggle-corner'>
        <div className='feedback-corner-text'>Feedback</div>
      </div>
    </div>
  )
}

export default withRouter(FeedbackToggle)