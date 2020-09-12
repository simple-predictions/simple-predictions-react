import React from 'react'
import {Link} from 'react-router-dom';

class Homepage extends React.Component {
  render() {
    return (
      <div>
        <h1>Welcome to Simple Predictions v2</h1>
        <div className='row'>
          <div className='col-md-4'>
            <Link to='/predictions'><button>Make Predictions</button></Link>
          </div>
          <div className='col-md-4'>
            <Link to='/minileagues'><button>View Minileagues</button></Link>
          </div>
        </div>
      </div>
    )
  }
}

export default Homepage