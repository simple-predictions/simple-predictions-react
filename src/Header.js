import React from 'react';
import './header.css'

class Header extends React.Component {
    render() {
        return(
            <div className='row' id='header-row'>
                <img alt='' id='salt' src="https://img.icons8.com/emoji/96/000000/salt-emoji.png"/>
                <h1 style={{textAlign: "center"}}>The Salt Beef League</h1>
                <img alt='' id='beef' src="https://img.icons8.com/officel/80/000000/steak-medium.png"/>
            </div>
        )
    }
}

export default Header;