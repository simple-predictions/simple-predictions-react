import React from 'react';
import './Feedback.css';
import { withRouter } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { openPopup } from './feedbackSlice';

const FeedbackToggle = ({ apiCookie }) => {
  const dispatch = useDispatch();

  return (
    <div>
      <button type="button" style={{ backgroundColor: (window.location.pathname === '/' && apiCookie) ? 'black' : '', color: (window.location.pathname === '/' && apiCookie) ? '#defc5f' : '' }} onClick={() => { dispatch(openPopup()); }} className="feedback-toggle">
        <div>Feedback</div>
      </button>
      <button type="button" style={{ borderBottomColor: (window.location.pathname === '/' && apiCookie) ? 'black' : '', color: (window.location.pathname === '/' && apiCookie) ? '#defc5f' : '' }} onClick={() => { dispatch(openPopup()); }} className="feedback-toggle-corner">
        <div className="feedback-corner-text">Feedback</div>
      </button>
    </div>
  );
};

FeedbackToggle.propTypes = {
  apiCookie: PropTypes.bool,
};
FeedbackToggle.defaultProps = {
  apiCookie: false,
};

export default withRouter(FeedbackToggle);
