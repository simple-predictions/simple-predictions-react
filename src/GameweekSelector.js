import React from 'react'

class GameweekSelector extends React.Component {
  render() {
    return (
      <select value={this.props.gameweek} onChange={this.props.onGameweekUpdate}>
        {[...Array(38)].map((x, i) => (
          <option key={i+1} value={i+1}>Gameweek {i+1}</option>
        ))}
      </select>
    )
  }
}

export default GameweekSelector