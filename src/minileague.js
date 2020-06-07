import React from 'react';
import { Table } from 'react-bootstrap';
import Player from './player.js'
import './minileague.css'

class MiniLeagueTable extends React.Component{
    render(){
    return(
        <Table striped bordered hover>
            <thead className='table-header'>
                <tr>
                    <th colSpan='1'>Position</th>
                    <th colSpan='1'>Name</th>
                    <th colSpan='1'>Points</th>
                    <th colSpan='1'>Change</th>
                </tr>
            </thead>
            <tbody>
                {this.props.minileague.map((player, index) => (
                    <Player key={player._id} player={player} index={index+1}></Player>
                ))}
            </tbody>
        </Table>
    )
    }
}

export default MiniLeagueTable;