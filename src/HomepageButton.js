import React from 'react'
import { Link } from 'react-router-dom'
import './HomepageButton.css'

const HomepageButton = () => {
  return(
    <div className='homepage-button-container'>
      <Link to='/' style={{position: 'fixed'}}>
        <img alt='home icon' src={require('./icons/home.png')} height={50} />
      </Link>
    </div>
  )
}

export default HomepageButton