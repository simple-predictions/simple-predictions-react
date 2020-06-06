import React from 'react';
import { Table } from 'react-bootstrap';
import './games.css'

const GamesTable = ({ games }) => {
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
                {games.map((game) => (
                    <tr key={game.id}>
                        <td>{game.home_team}</td>
                        <td>{game.away_team}</td>
                        <td className={`${game.sol_banker ? 'yellow-text' : null} ${game.sol_insurance ? 'green-text' : null} ${game.sol_points>15 ? 'table-success' : null} ${game.sol_points<0 ? 'table-danger' : null}`}>{game.sol_home_prediction}-{game.sol_away_prediction}<strong style={{float: 'right'}}>{game.sol_points}</strong></td>
                        <td className={`${game.phil_banker ? 'yellow-text' : null} ${game.phil_insurance ? 'green-text' : null} ${game.phil_points>15 ? 'table-success' : null} ${game.phil_points<0 ? 'table-danger' : null}`}>{game.phil_home_prediction}-{game.phil_away_prediction}<strong style={{float: 'right'}}>{game.phil_points}</strong></td>
                        <td className={`${game.lila_banker ? 'yellow-text' : null} ${game.lila_insurance ? 'green-text' : null} ${game.lila_points>15 ? 'table-success' : null} ${game.lila_points<0 ? 'table-danger' : null}`}>{game.lila_home_prediction}-{game.lila_away_prediction}<strong style={{float: 'right'}}>{game.lila_points}</strong></td>
                        <td className={`${game.jonny_banker ? 'yellow-text' : null} ${game.jonny_insurance ? 'green-text' : null} ${game.jonny_points>15 ? 'table-success' : null} ${game.jonny_points<0 ? 'table-danger' : null}`}>{game.jonny_home_prediction}-{game.jonny_away_prediction}<strong style={{float: 'right'}}>{game.jonny_points}</strong></td>
                        <td className={`${game.sam_banker ? 'yellow-text' : null} ${game.sam_insurance ? 'green-text' : null} ${game.sam_points>15 ? 'table-success' : null} ${game.sam_points<0 ? 'table-danger' : null}`}>{game.sam_home_prediction}-{game.sam_away_prediction}<strong style={{float: 'right'}}>{game.sam_points}</strong></td>
                        <td className={`${game.jacob_banker ? 'yellow-text' : null} ${game.jacob_insurance ? 'green-text' : null} ${game.jacob_points>15 ? 'table-success' : null} ${game.jacob_points<0 ? 'table-danger' : null}`}>{game.jacob_home_prediction}-{game.jacob_away_prediction}<strong style={{float: 'right'}}>{game.jacob_points}</strong></td>
                        <td className={`${game.status === 'FINISHED' ? 'table-warning' : null} ${game.status === 'INPLAY' ? 'table-primary' : null}`}>{game.live_home_score ? `${game.live_home_score}-${game.live_away_score}` : (new Date(game.kick_off_time) > Date.now ? '0-0' : 'Not kicked off') }</td>
                    </tr>
                ))}
            </tbody>
        </Table>
    )
}

export default GamesTable;