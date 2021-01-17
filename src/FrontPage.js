import React, {useState} from 'react'
import './LoginPage.css'
import './FrontPage.css'
import LoginPage from './LoginPage'
import Register from './Register'
import ResetPassword from './ResetPassword'
import CreateNewPassword from './CreateNewPassword'
import { Button } from 'react-bootstrap'
import $ from 'jquery';


const FrontPage = ({widget, location}) => {
  const [popupOpen, setPopupOpen] = useState(false)
  const [buttonBackgroundColor, setButtonBackgroundColor] = useState('#defc5f')

  const handleScroll = (e) => {
    const yellowBackground = $('.three-steps-row-outer-container')
    const blackBackground = $('.outer-about-row-container')
    if (yellowBackground[0] && blackBackground[0]) {
      const yellowBackgroundHeight = yellowBackground.offset().top
      const blackBackgroundHeight = blackBackground.offset().top
      const currentScrollHeight = $(window).scrollTop()
      const windowHeight = $(window).height()
      const windowWidth = $(window).width()
      if (windowWidth > 600) {
        if ((currentScrollHeight+80 > yellowBackgroundHeight/2) && (currentScrollHeight+50 < blackBackgroundHeight-yellowBackgroundHeight/2)) {
          $('.feedback-toggle').css('background-color', 'black')
          $('.feedback-toggle').css('color', '#defc5f')
        } else {
          $('.feedback-toggle').css('background-color', '#defc5f')
          $('.feedback-toggle').css('color', 'black')
        }
      } else {
        if (currentScrollHeight > 50 && currentScrollHeight-50 < blackBackgroundHeight-windowHeight) {
          $('.feedback-toggle-corner').css('border-bottom-color', 'black')
          $('.feedback-toggle-corner').css('color', '#defc5f')
        } else {
          $('.feedback-toggle-corner').css('border-bottom-color', '#defc5f')
          $('.feedback-toggle-corner').css('color', 'black')
        }
      }

      if ((currentScrollHeight+50 > yellowBackgroundHeight) && (currentScrollHeight+50 < blackBackgroundHeight)) {
        setButtonBackgroundColor('black')
      } else {
        setButtonBackgroundColor('#defc5f')
      }
    }
  }

  window.addEventListener("scroll", handleScroll)

  return (
    <div className="front-page-outer-container">
      {widget === 'Login' ? <LoginPage popupOpen={popupOpen} setPopupOpen={setPopupOpen} /> : widget === 'Register' ? <Register popupOpen={popupOpen} setPopupOpen={setPopupOpen} /> : widget === 'Reset Password' ? <ResetPassword /> : <CreateNewPassword location={location} />}
      <div className='login-button-outer-container'>
        <Button className='btn-lg' style={{backgroundColor: buttonBackgroundColor, color: buttonBackgroundColor === 'black' ? '#defc5f' : 'black'}} onClick={() => setPopupOpen(true)}>{widget}</Button>
      </div>
      <div className="front-page-top">
        <div className='text-container'>
          <h1 className='site-header'>SALT BEEF<br />LEAGUE</h1>
          <h4 className='site-tagline'>Predictions. Results. Live Scores.</h4>
        </div>
      </div>
      <div className='front-page-scrollover'>
        <div className='three-steps-row-outer-container'>
          <div className='row m-0 three-steps-row'>
            <div className='col-lg-4 three-steps-step'>
              <div className='step-number-outer-container'>
                <div className='step-number-container'>01</div>
                <hr className='step-divider' />
              </div>
              <div className='step-text-outer-container'>
                <div className='step-title-container'>Predict</div>
                <p className='step-description-container'>Predict the outcome of all the Premier League fixtures each week.</p>
              </div>
            </div>
            <div className='col-lg-4 three-steps-step'>
              <div className='step-number-outer-container'>
                <div className='step-number-container'>02</div>
                <hr className='step-divider' />
              </div>
              <div className='step-text-outer-container'>
                <div className='step-title-container'>Score</div>
                <p className='step-description-container'>Watch your points accumulate as the goals come in.</p>
              </div>
            </div>
            <div className='col-lg-4 three-steps-step'>
              <div className='step-number-outer-container'>
                <div className='step-number-container'>03</div>
                <hr className='step-divider' />
              </div>
              <div className='step-text-outer-container'>
                <div className='step-title-container'>Compete</div>
                <p className='step-description-container'>Join a mini-league to track your progress against competitors throughout the season.</p>
              </div>
            </div>
          </div>
        </div>
        <div className='row m-0 outer-about-row-container'>
          <div className='about-row row'>
            <div className='col-lg-2'></div>
            <div className='about-row-image-container col-lg-2'>
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
              <img alt='book icon' src={require('./icons/book.png')} className='about-row-icon' />
            </div>
            <div className='about-row-text-container col-lg-6'>
              <div className='about-row-header-container'>Our story</div>
              <div className='about-row-description-container'>The Salt Beef League began as an annual competition between two families on the now discontinued talkSport predictor site. The first iteration of my site used an API provided by talkSport to get users' predictions and displayed them in a clear table. It also scored the games live as the goals came in. This latest iteration, which I'm sure won't be the last, is a standalone website which doesn't depend on talkSport. </div>
            </div>
            <div className='col-lg-2'></div>
          </div>
          <div className='about-row row'>
            <div className='col-lg-2'></div>
            <div className='about-row-image-container col-lg-2'>
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
              <img alt='eye icon' src={require('./icons/eye.png')} className='about-row-icon' />
            </div>
            <div className='about-row-text-container col-lg-6'>
              <div className='about-row-header-container'>Our vision</div>
              <div className='about-row-description-container'>At the moment the site is a showcase of my skills and shows that I can think creatively to problem solve. For example, I haven't paid for any live data and the live scoring works by parsing the Premier League tweets from the Twitter API. I'm keen to get as much feedback and user input as possible to improve this Alpha version further.</div>
            </div>
            <div className='col-lg-2'></div>
          </div>
          <div className='about-row row'>
            <div className='col-lg-2'></div>
            <div className='about-row-image-container col-lg-2'>
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
              <img alt='person icon' src={require('./icons/person.png')} className='about-row-icon' />
            </div>
            <div className='about-row-text-container col-lg-6'>
              <div className='about-row-header-container'>About me</div>
              <div className='about-row-description-container'>I'm a Year 12 student with a passion for programming and problem solving. My only formal coding education has been a work experience placement at Forensic Architecture so I am entirely self-taught and have learnt by practise and experimentation. If you'd like to find out more about me, please go to my <a className='personal-site-link' href='https://www.solabrahams.tech'>personal site.</a></div>
            </div>
            <div className='col-lg-2'></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FrontPage