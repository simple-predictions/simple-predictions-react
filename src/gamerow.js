import React from 'react';
import { Link } from 'react-router-dom';

class GameRow extends React.Component {
    render() {
        return(
            <tr key={this.props.game.id}>
                {this.props.showAllColumns && 
                <td><img src={require(`./badges/${this.props.game.home_team}.png`)} height={'30'} alt='team badge'/> {this.props.game.home_team}</td>}
                {this.props.showAllColumns && 
                <td><img src={require(`./badges/${this.props.game.away_team}.png`)} height={'30'} alt='team badge'/> {this.props.game.away_team}</td>}
                <td className={`${this.props.game.sol_banker ? 'yellow-text' : null} ${this.props.game.sol_insurance ? 'green-text' : null} ${this.props.game.sol_points>15 ? 'table-success' : null} ${this.props.game.sol_points<0 ? 'table-danger' : null}`}>{this.props.game.sol_home_prediction}-{this.props.game.sol_away_prediction}<strong style={{float: 'right'}}>{this.props.game.sol_points}</strong></td>
                <td className={`${this.props.game.phil_banker ? 'yellow-text' : null} ${this.props.game.phil_insurance ? 'green-text' : null} ${this.props.game.phil_points>15 ? 'table-success' : null} ${this.props.game.phil_points<0 ? 'table-danger' : null}`}>{this.props.game.phil_home_prediction}-{this.props.game.phil_away_prediction}<strong style={{float: 'right'}}>{this.props.game.phil_points}</strong></td>
                <td className={`${this.props.game.lila_banker ? 'yellow-text' : null} ${this.props.game.lila_insurance ? 'green-text' : null} ${this.props.game.lila_points>15 ? 'table-success' : null} ${this.props.game.lila_points<0 ? 'table-danger' : null}`}>{this.props.game.lila_home_prediction}-{this.props.game.lila_away_prediction}<strong style={{float: 'right'}}>{this.props.game.lila_points}</strong></td>
                <td className={`${this.props.game.jonny_banker ? 'yellow-text' : null} ${this.props.game.jonny_insurance ? 'green-text' : null} ${this.props.game.jonny_points>15 ? 'table-success' : null} ${this.props.game.jonny_points<0 ? 'table-danger' : null}`}>{this.props.game.jonny_home_prediction}-{this.props.game.jonny_away_prediction}<strong style={{float: 'right'}}>{this.props.game.jonny_points}</strong></td>
                <td className={`${this.props.game.sam_banker ? 'yellow-text' : null} ${this.props.game.sam_insurance ? 'green-text' : null} ${this.props.game.sam_points>15 ? 'table-success' : null} ${this.props.game.sam_points<0 ? 'table-danger' : null}`}>{this.props.game.sam_home_prediction}-{this.props.game.sam_away_prediction}<strong style={{float: 'right'}}>{this.props.game.sam_points}</strong></td>
                <td className={`${this.props.game.jacob_banker ? 'yellow-text' : null} ${this.props.game.jacob_insurance ? 'green-text' : null} ${this.props.game.jacob_points>15 ? 'table-success' : null} ${this.props.game.jacob_points<0 ? 'table-danger' : null}`}>{this.props.game.jacob_home_prediction}-{this.props.game.jacob_away_prediction}<strong style={{float: 'right'}}>{this.props.game.jacob_points}</strong></td>
                {this.props.showAllColumns && 
                <td className={`${this.props.game.status === 'FINISHED' ? 'table-warning' : null} ${this.props.game.status === 'INPLAY' ? 'table-primary' : null}`}><Link to={`/game/${this.props.game.id}`}>{this.props.game.live_home_score ? `${this.props.game.live_home_score}-${this.props.game.live_away_score}` : (new Date(this.props.game.kick_off_time) > Date.now ? '0-0' : 'Not kicked off') }</Link></td>}
            </tr>
        )
    }
}

export default GameRow;