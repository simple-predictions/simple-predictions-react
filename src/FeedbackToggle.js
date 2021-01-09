import React from 'react'
import './Feedback.css'

const FeedbackToggle = (props) => {
  return (
    <div onClick={() => {props.onTogglePopup()}} className='feedback-toggle'>
      <div>Feedback</div>
    </div>
  )
}

export default FeedbackToggle