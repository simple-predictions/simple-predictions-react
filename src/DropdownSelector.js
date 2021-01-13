import React from 'react'
import './DropdownSelector.css'

class DropdownSelector extends React.Component {
  render() {
    return (
      <div className='dropdown-container' style={this.props.divStyle}>
        <img style={this.props.arrowStyle} alt='dropdown arrow' className="dropdown-arrow" height={20} src={require('./icons/arrow.png')}/>
        <select disabled={this.props.enabled} style={this.props.style} value={this.props.startingValue} onChange={this.props.onValueUpdate}>
          {[...Array(this.props.length)].map((x, i) => (
            <option key={i+1} value={i+1}>{this.props.minileagueArr ? this.props.minileagueArr[i].name : 'Gameweek '+(i+1)}</option>
          ))}
        </select>
      </div>
    )
  }
}

export default DropdownSelector