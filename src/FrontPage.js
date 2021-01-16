import React, {useState} from 'react'
import './LoginPage.css'
import './FrontPage.css'
import LoginPage from './LoginPage'
import Register from './Register'
import ResetPassword from './ResetPassword'
import CreateNewPassword from './CreateNewPassword'
import { Button } from 'react-bootstrap'

const FrontPage = ({widget, location}) => {
  const [popupOpen, setPopupOpen] = useState(false)

  return (
    <div className="front-page-outer-container">
      {widget === 'Login' ? <LoginPage popupOpen={popupOpen} setPopupOpen={setPopupOpen} /> : widget === 'Register' ? <Register popupOpen={popupOpen} setPopupOpen={setPopupOpen} /> : widget === 'Reset Password' ? <ResetPassword /> : <CreateNewPassword location={location} />}
      <div className='login-button-outer-container'>
        <Button style={{backgroundColor: '#defc5f', color: 'black'}} onClick={() => setPopupOpen(true)}>{widget}</Button>
      </div>
      <div className="front-page-top">
        <div className='text-container'>
          <h1 className='site-header'>SALT BEEF<br />LEAGUE</h1>
          <h4 className='site-tagline'>Predictions. Results. Live Scores.</h4>
        </div>
      </div>
      <div className='front-page-scrollover'>
        <div className='row m-0 three-steps-row'>
          <div className='step-number-row-container'>
            <div className='col-md-4 three-steps-step'>
              <div className='step-number-outer-container'>
                <div className='step-number-container'>01</div>
                <hr className='step-divider' />
              </div>
            </div>
            <div className='col-md-4 three-steps-step'>
              <div className='step-number-outer-container'>
                <div className='step-number-container'>02</div>
                <hr className='step-divider' />
              </div>
            </div>
            <div className='col-md-4 three-steps-step'>
              <div className='step-number-outer-container'>
                <div className='step-number-container'>03</div>
                <hr className='step-divider' />
              </div>
            </div>
          </div>

          <div className='step-text-row-container'>
            <div className='col-md-4 three-steps-step three-steps-step-text'>
              <div className='step-text-outer-container'>
                <div className='step-title-container'>Predict</div>
                <p className='step-description-container'>Predict the outcome of all the Premier League fixtures each week.</p>
              </div>
            </div>
            <div className='col-md-4 three-steps-step three-steps-step-text'>
              <div className='step-text-outer-container'>
                <div className='step-title-container'>Score</div>
                <p className='step-description-container'>Watch your points live as your predictions are scored as the goals come in.</p>
              </div>
            </div>
            <div className='col-md-4 three-steps-step three-steps-step-text'>
              <div className='step-text-outer-container'>
                <div className='step-title-container'>Compete</div>
                <p className='step-description-container'>Join a mini-league to track your progress against your competitors throughout the season.</p>
              </div>
            </div>
          </div>
        </div>
        <div className='row m-0 outer-about-row-container'>
          <div className='about-row'>
            <div className='col-md-2'></div>
            <div className='about-row-image-container col-md-2'>
              <svg className='about-row-icon-hex-outline' viewBox='0 0 120 100'>
                <path d='M38,2 
                        L82,2 
                        A12,12 0 0,1 94,10 
                        L112,44 
                        A12,12 0 0,1 112,56
                        L94,90       
                        A12,12 0 0,1 82,98
                        L38,98
                        A12,12 0 0,1 26,90
                        L8,56
                        A12,12 0 0,1 8,44
                        L26,10
                        A12,12 0 0,1 38,2' />
              </svg>
              <img src={require('./icons/book.png')} className='about-row-icon' />
            </div>
            <div className='about-row-text-container col-md-6'>
              <div className='about-row-header-container'>Our story</div>
              <div className='about-row-description-container'>Here is our story.</div>
            </div>
            <div className='col-md-2'></div>
          </div>
          <div className='about-row'>
            <div className='col-md-2'></div>
            <div className='about-row-image-container col-md-2'>
              <svg className='about-row-icon-hex-outline' viewBox='0 0 120 100'>
                <path d='M38,2 
                        L82,2 
                        A12,12 0 0,1 94,10 
                        L112,44 
                        A12,12 0 0,1 112,56
                        L94,90       
                        A12,12 0 0,1 82,98
                        L38,98
                        A12,12 0 0,1 26,90
                        L8,56
                        A12,12 0 0,1 8,44
                        L26,10
                        A12,12 0 0,1 38,2' />
              </svg>
              <img src={require('./icons/eye.png')} className='about-row-icon' />
            </div>
            <div className='about-row-text-container col-md-6'>
              <div className='about-row-header-container'>Our vision</div>
              <div className='about-row-description-container'>Here is our vision.</div>
            </div>
            <div className='col-md-2'></div>
          </div>
          <div className='about-row'>
            <div className='col-md-2'></div>
            <div className='about-row-image-container col-md-2'>
              <svg className='about-row-icon-hex-outline' viewBox='0 0 120 100'>
                <path d='M38,2 
                        L82,2 
                        A12,12 0 0,1 94,10 
                        L112,44 
                        A12,12 0 0,1 112,56
                        L94,90       
                        A12,12 0 0,1 82,98
                        L38,98
                        A12,12 0 0,1 26,90
                        L8,56
                        A12,12 0 0,1 8,44
                        L26,10
                        A12,12 0 0,1 38,2' />
              </svg>
              <img src={require('./icons/person.png')} className='about-row-icon' />
            </div>
            <div className='about-row-text-container col-md-6'>
              <div className='about-row-header-container'>About me</div>
              <div className='about-row-description-container'>Sol Abrahams.</div>
            </div>
            <div className='col-md-2'></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FrontPage