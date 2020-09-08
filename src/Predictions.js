import React from 'react'

class Predictions extends React.Component {
  componentDidMount() {
    fetch('http://127.0.0.1:5000/getuserpredictions', {credentials: "include"}).then(response => console.log(response))
  }
  render() {
    return (
      <h5>test</h5>
    )
  }
}

export default Predictions