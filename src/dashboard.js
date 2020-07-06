import React from 'react';
import MiniLeagueTable from './minileague';
import GameRow from './gamerow';
import { Table, Card } from 'react-bootstrap';

class Dashboard extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }
    componentDidUpdate(prevProps, prevState) {
        if (JSON.stringify(prevProps.games) !== JSON.stringify(this.props.games)){
            this.checkIfLiveGame()
        }
        if (JSON.stringify(prevProps.combinedPoints) !== JSON.stringify(this.props.combinedPoints)){
            this.findChampion()
        }
    }
    checkIfLiveGame() {
        var allGames = this.props.games;
        if (allGames === null) {
            return;
        }
        var previousGames = []
        var liveGames = []
        var futureGames = []
        for (var x=0; x<allGames.length; x++) {
            var game = allGames[x];
            if (game['status'] === 'IN_PLAY' || game['status'] === 'PAUSED') {
                liveGames.push(game)
            }
            if (game['status'] === 'FINISHED') {
                previousGames.push(game)
            }
            if (game['status'] === 'SCHEDULED' || game['status'] == null) {
                futureGames.push(game)
            }
        }
        if (liveGames.length > 0) {
            this.setState({gamesInPlay: true,liveGames: liveGames, showGame:null});
        } else {
            var lastGame = previousGames[previousGames.length-1]
            var nextGame = futureGames[0]
            var newState = {'gamesInPlay':false, liveGames:null}

            if (lastGame != null) {
                var prevDiff = Math.abs(Date.now() - Date.parse(lastGame.kick_off_time))
                newState['lastGame'] = lastGame
            } else {
                prevDiff = 99999999999999999999999999999999999999
                newState['lastGame'] = null
            }
            if (nextGame != null) {
                var nextDiff = Math.abs(Date.parse(nextGame.kick_off_time) - Date.now())
                newState['nextGame'] = nextGame
            } else {
                nextDiff = 99999999999999999999999999999999999999
                newState['nextGame'] = null
            }
            if (nextDiff > prevDiff) {
                newState['showGame'] = 'prev'
            } else {
                newState['showGame'] = 'next'
            }
            this.setState(newState)
        }
    }

    findChampion() {
        const abrahamsNames = ['churchstreetgunners','churchstreetsuperhoops','finchleygunners']
        const freedlandNames = ['JadTheGooner82','GunnersOf82','RedArmy82']
        var dict = this.props.combinedPoints
        var abrahamsChamp = this.findFirstInArr(abrahamsNames, dict)
        var freedlandChamp = this.findFirstInArr(freedlandNames, dict)
        if (abrahamsChamp.points > freedlandChamp.points) {
            var overallChamp = 'abrahams'
        } else {
            overallChamp = 'freedland'
        }
        this.setState({overallChamp: overallChamp, abrahamsChamp: abrahamsChamp, freedlandChamp: freedlandChamp})
    }

    findFirstInArr(arrOfItems, arrToSearch) {
        for (var x=0; x<arrOfItems.length; x++) {
            var item = arrOfItems[x];
            for (var y=0; y<arrToSearch.length; y++) {
                var toSearch = arrToSearch[y];
                if (toSearch.name === item) {
                    return toSearch
                }
            }
        }
    }

    render() {
        const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
        return(
            <div>
                {this.state.overallChamp != null ?
                <div className='row'>
                    <div className='col-md-4' style={{margin:'auto', textAlign: 'center'}}><h4>The current Abrahams{this.state.overallChamp === 'abrahams' ? ' and overall' : null} champion is:</h4><h1>{this.state.abrahamsChamp.name}{this.state.overallChamp === 'abrahams' ? '!' : null}</h1></div>
                    <div className='col-md-4' style={{margin:'auto', textAlign: 'center'}}><h2>&#11013; {Math.abs(this.state.freedlandChamp.points - this.state.abrahamsChamp.points)} point gap &#10145;</h2></div>
                    <div className='col-md-4' style={{margin:'auto', textAlign: 'center'}}><h4>The current Freedland{this.state.overallChamp === 'freedland' ? ' and overall' : null} champion is:</h4><h1>{this.state.freedlandChamp.name}{this.state.overallChamp === 'freedland' ? '!' : null}</h1></div>
                </div>
                : null }
                <div className='row'>
                    <div className='col-md-2'></div>
                    <div className='col-md-8'>
                        <Card>
                        <Card.Header>{this.state.gamesInPlay != null ? (this.state.gamesInPlay === true ? `Live game - kicked off at ${new Date(this.state.liveGames[0].kick_off_time).getHours()}:${("0"+new Date(this.state.liveGames[0].kick_off_time).getMinutes()).slice(-2)} on ${new Date(this.state.liveGames[0].kick_off_time).getDate()} ${monthNames[new Date(this.state.liveGames[0].kick_off_time).getMonth()]}` : 
                        (this.state.showGame === 'prev' ? `Last game - kicked off at ${new Date(this.state.lastGame.kick_off_time).getHours()}:${("0"+new Date(this.state.lastGame.kick_off_time).getMinutes()).slice(-2)} on ${new Date(this.state.lastGame.kick_off_time).getDate()} ${monthNames[new Date(this.state.lastGame.kick_off_time).getMonth()]}` : 
                        `Next game - kicks off at ${new Date(this.state.nextGame.kick_off_time).getHours()}:${("0"+new Date(this.state.nextGame.kick_off_time).getMinutes()).slice(-2)} on ${new Date(this.state.nextGame.kick_off_time).getDate()} ${monthNames[new Date(this.state.nextGame.kick_off_time).getMonth()]}`)) : null}</Card.Header>
                        <Card.Body>
                        <Table bordered style={{marginBottom: 0}}>
                        <thead className='table-header'>
                            <tr key='upper-header'>
                                <th rowSpan='2' colSpan='1'>Home Team</th>
                                <th rowSpan='2' colSpan='1'>Away Team</th>
                                <th colSpan='6'>Predictions</th>
                                <th rowSpan='2' colSpan='1'>Live Score</th>
                            </tr>
                            <tr key='lower-header'>
                                <th colSpan='1'>Sol</th>
                                <th colSpan='1'>Phillip</th>
                                <th colSpan='1'>Lila</th>
                                <th colSpan='1'>Jonny</th>
                                <th colSpan='1'>Sam</th>
                                <th colSpan='1'>Jacob</th>
                            </tr>
                        </thead>
                        <tbody>
                        {this.state.gamesInPlay != null ?
                            (this.state.gamesInPlay === true ?
                            (this.state.liveGames.map((game) => (
                                <GameRow key={game.id} showAllColumns={true} game={game} />
                            ))) :
                            this.state.showGame === 'prev' ? <GameRow key={this.state.lastGame.id} showAllColumns={true} game={this.state.lastGame}/> : <GameRow key={this.state.nextGame.id} showAllColumns={true} game={this.state.nextGame} />
                            )
                        : null}
                        </tbody></Table></Card.Body></Card>
                    </div>
                </div>
                <div className='row'>
                    <div className='col-md-6'><MiniLeagueTable minileague={this.props.combinedPoints} /></div>
                </div>
            </div>
        )
    }
}

export default Dashboard;