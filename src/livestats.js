import React from 'react';
import { Table } from 'react-bootstrap'
import './livestats.css'

class LiveStats extends React.Component {
    render() {
        return(
            <Table borderless>
                <tbody className={'liveStatsTable'}>
                    <tr>
                        <td>{this.props.liveStats.possession.home}</td>
                        <td>Possession</td>
                        <td>{this.props.liveStats.possession.away}</td>
                    </tr>
                    <tr>
                        <td>{this.props.liveStats.fouls.home ? this.props.liveStats.fouls.home : 0}</td>
                        <td>Fouls</td>
                        <td>{this.props.liveStats.fouls.away ? this.props.liveStats.fouls.away : 0}</td>
                    </tr>
                    <tr>
                        <td>{this.props.liveStats.yellow.home ? this.props.liveStats.yellow.home : 0}</td>
                        <td>Yellow cards</td>
                        <td>{this.props.liveStats.yellow.away ? this.props.liveStats.yellow.away : 0}</td>
                    </tr>
                    <tr>
                        <td>{this.props.liveStats.offside.home ? this.props.liveStats.offside.home : 0}</td>
                        <td>Offsides</td>
                        <td>{this.props.liveStats.offside.away ? this.props.liveStats.offside.away : 0}</td>
                    </tr>
                    <tr>
                        <td>{this.props.liveStats.corner.home ? this.props.liveStats.corner.home : 0}</td>
                        <td>Corners</td>
                        <td>{this.props.liveStats.corner.away ? this.props.liveStats.corner.away : 0}</td>
                    </tr>
                    <tr>
                        <td>{this.props.liveStats.save.home ? this.props.liveStats.save.home : 0}</td>
                        <td>Saves</td>
                        <td>{this.props.liveStats.save.away ? this.props.liveStats.save.away : 0}</td>
                    </tr>
                </tbody>
            </Table>
        )
    }
}

export default LiveStats