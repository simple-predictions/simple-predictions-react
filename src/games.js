import React from 'react';
import { Table } from 'react-bootstrap';
import './games.css'
import GameRow from './gamerow.js';

class GamesTable extends React.Component{
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
    }
    render(){
    return(
        <Table striped bordered hover>
            <thead className='table-header'>
                <tr>
                    <th rowSpan='2' colSpan='1'>Home Team</th>
                    <th rowSpan='2' colSpan='1'>Away Team</th>
                    <th colSpan='6'>Predictions</th>
                    <th rowSpan='2' colSpan='1'>Live Score</th>
                </tr>
                <tr>
                    <th colSpan='1'>Sol</th>
                    <th colSpan='1'>Phillip</th>
                    <th colSpan='1'>Lila</th>
                    <th colSpan='1'>Jonny</th>
                    <th colSpan='1'>Sam</th>
                    <th colSpan='1'>Jacob</th>
                </tr>
            </thead>
            <tbody>
                {this.props.games.map((game) => (
                    <GameRow showAllColumns={true}game={game} />
                ))}
            </tbody>
        </Table>
    )
    }
}

export default GamesTable;