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
                        <td>{this.props.liveStats.fouls.home}</td>
                        <td>Fouls</td>
                        <td>{this.props.liveStats.fouls.away}</td>
                    </tr>
                    <tr>
                        <td>{this.props.liveStats.yellow.home}</td>
                        <td>Yellow cards</td>
                        <td>{this.props.liveStats.yellow.away}</td>
                    </tr>
                    <tr>
                        <td>{this.props.liveStats.red.home}</td>
                        <td>Red cards</td>
                        <td>{this.props.liveStats.red.away}</td>
                    </tr>
                    <tr>
                        <td>{this.props.liveStats.offside.home}</td>
                        <td>Offsides</td>
                        <td>{this.props.liveStats.offside.away}</td>
                    </tr>
                    <tr>
                        <td>{this.props.liveStats.corner.home}</td>
                        <td>Corners</td>
                        <td>{this.props.liveStats.corner.away}</td>
                    </tr>
                    <tr>
                        <td>{this.props.liveStats.save.home}</td>
                        <td>Saves</td>
                        <td>{this.props.liveStats.save.away}</td>
                    </tr>
                </tbody>
            </Table>
        )
    }
}

export default LiveStats