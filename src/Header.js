import React from 'react';
import {Navbar, Nav} from 'react-bootstrap'
import './header.css'
import Cookies from 'js-cookie'

class Header extends React.Component {
  render() {
    return(
      /*<div className='row' id='header-row'>
        <img alt='' id='salt' src="https://img.icons8.com/emoji/96/000000/salt-emoji.png"/>
        <h1 style={{textAlign: "center"}}>The Salt Beef League</h1>
        <img alt='' id='beef' src="https://img.icons8.com/officel/80/000000/steak-medium.png"/>
      </div>*/
      <Navbar bg="#defc5f" expand="lg" style={{marginBottom: 10}}>
        <Navbar.Brand href="#home">Salt Beef League</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          {Cookies.get('connect.sid') ?
            <Nav className="mr-auto">
              <Nav.Link href="/">Home</Nav.Link>
                <Nav.Link href="/predictions">Predictions</Nav.Link>
                <Nav.Link href="/minileagues">Minileague</Nav.Link>
            </Nav>
          : 
          <Nav>
            <Navbar.Text>Please log in</Navbar.Text>
          </Nav>}
        </Navbar.Collapse>
      </Navbar>
    )
  }
}

export default Header;