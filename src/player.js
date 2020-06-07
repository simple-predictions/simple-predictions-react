import React from 'react';

class Player extends React.Component {
    render() {
        return(
            <tr key={this.props.player._id}>
                <td className={`${(this.props.index>this.props.player.position) ? 'table-danger' : (this.props.index<this.props.player.position) ? 'table-success' : null}`}>{this.props.index}({this.props.player.position})</td>
                <td>{this.props.player.name}</td>
                <td>{this.props.player.points}</td>
        <td className={this.props.player.pointsChange>0 ? 'table-success' : (this.props.player.pointsChange<0 ? 'table-danger' : null) }>{this.props.player.pointsChange>0 ? '+' : ''}{this.props.player.pointsChange}</td>
            </tr>
        )
    }
}

export default Player;
