import React from 'react';
import { Table } from 'react-bootstrap';
import './games.css'
import GameRow from './gamerow.js';

class GamesTable extends React.Component{
    constructor(props) {
        super(props)
        this.state = {
            totalPoints: {
                Sol: 0,
                Phillip: 0,
                Lila: 0,
                Jonny: 0,
                Jacob: 0,
                Sam: 0
            }
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (JSON.stringify(prevProps.games) === JSON.stringify(this.props.games) || !prevProps.games) {
          //alert('NOT CHANGED')
        } else {
          var old_games = prevProps.games
          var new_games = this.props.games
          // Loop through new games
          new_games.map((new_game) => {
              old_games.map((old_game) => {
                  if (new_game.id === old_game.id) {
                      // Same game found
                      if (new_game.live_home_score !== old_game.live_home_score || new_game.live_away_score !== old_game.live_away_score) {
                          // Score has changed
                          alert(`A goal has been scored in ${new_game.home_team} vs ${new_game.away_team}`)
                      }
                  }
                  return old_game;
              })
              return new_game;
          })
        }

        // Set state total scores by player
        if (this.props.playerPoints !== prevProps.playerPoints) {
            if (this.props.playerPoints.length > 0) {
                console.log(this.props.playerPoints)
                var totalPoints = {};
                for (var i=0; i < this.props.playerPoints.length; i++) {
                    var playerName = this.props.playerPoints[i].name
                    if (playerName === 'JadTheGooner82') {playerName = 'Jacob'};
                    if (playerName === 'Gunnersof82') {playerName = 'Jonny'};
                    if (playerName === 'RedArmy82') {playerName = 'Sam'};
                    if (playerName === 'churchstreetgunners') {playerName = 'Sol'};
                    if (playerName === 'finchleygunners') {playerName = 'Lila'};
                    if (playerName === 'churchstreetsuperhoops') {playerName = 'Phillip'};
                    totalPoints[playerName] = this.props.playerPoints[i].pointsChange
                }
                console.log(totalPoints)
                this.setState({
                    totalPoints: totalPoints
                })
                console.log(this.state.totalPoints)
            }
        }
    }
    render(){
    return(
        <Table striped bordered hover>
            <thead className='table-header'>
                <tr key='upper-header'>
                    <th rowSpan='2' colSpan='1'>Home Team</th>
                    <th rowSpan='2' colSpan='1'>Away Team</th>
                    <th colSpan='6'>Predictions</th>
                    <th rowSpan='2' colSpan='1'>Live Score</th>
                </tr>
                <tr key='lower-header'>
                    <th colSpan='1'>Sol <strong>{this.state.totalPoints.Sol}</strong></th>
                    <th colSpan='1'>Phillip <strong>{this.state.totalPoints.Phillip}</strong></th>
                    <th colSpan='1'>Lila <strong>{this.state.totalPoints.Lila}</strong></th>
                    <th colSpan='1'>Jonny <strong>{this.state.totalPoints.Jonny}</strong></th>
                    <th colSpan='1'>Sam <strong>{this.state.totalPoints.Sam}</strong></th>
                    <th colSpan='1'>Jacob <strong>{this.state.totalPoints.Jacob}</strong></th>
                </tr>
            </thead>
            <tbody>
                {this.props.games.map((game) => (
                    <GameRow key={game.id} showAllColumns={true}game={game} />
                ))}
            </tbody>
        </Table>
    )
    }
}

export default GamesTable;