import React from 'react'

class DropdownSelector extends React.Component {
  render() {
    return (
      <select value={this.props.startingValue} onChange={this.props.onValueUpdate}>
        {[...Array(this.props.length)].map((x, i) => (
          <option key={i+1} value={i+1}>{this.props.minileagueArr ? this.props.minileagueArr[i].name : 'Gameweek '+(i+1)}</option>
        ))}
      </select>
    )
  }
}

export default DropdownSelector