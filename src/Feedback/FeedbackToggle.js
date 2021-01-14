import React from 'react'
import './Feedback.css'
import {withRouter} from 'react-router-dom'
import {useDispatch} from 'react-redux'
import {openPopup} from './feedbackSlice'

const FeedbackToggle = (props) => {
  const dispatch = useDispatch()

  return (
    <div>
      <div style={{backgroundColor: (window.location.pathname === '/' && props.apiCookie) ? 'black' : '', color: (window.location.pathname === '/' && props.apiCookie) ? '#defc5f' : ''}} onClick={() => {dispatch(openPopup())}} className='feedback-toggle'>
        <div>Feedback</div>
      </div>
      <div style={{borderBottomColor: (window.location.pathname === '/' && props.apiCookie) ? 'black' : '', color: (window.location.pathname === '/' && props.apiCookie) ? '#defc5f' : ''}} onClick={() => {dispatch(openPopup())}} className='feedback-toggle-corner'>
        <div className='feedback-corner-text'>Feedback</div>
      </div>
    </div>
  )
}

export default withRouter(FeedbackToggle)