import React from 'react';
import { Card, Table, Button } from 'react-bootstrap';
import './team.css';
import {Win, Lose, Draw} from './result_icons.js';
import GameRow from './gamerow.js'

class Team extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            lastFiveGames: [],
            teamGames: [],
            homePosition: 0,
            awayPosition: 0,
            previousMeetings: []
        }
    }

    componentDidMount() {
        this.getPrevResults()
        this.findTeamGames()
        this.findPreviousMeetings()
    }

    componentDidUpdate(prevProps, prevState) {
        if (JSON.stringify(prevProps.games) !== JSON.stringify(this.props.games)) {
            this.findTeamGames()
        }
        if (prevProps.routeProps.match.params.teamName !== this.props.routeProps.match.params.teamName) {
            this.findTeamGames()
            this.getPrevResults()
        }
        if (JSON.stringify(prevState.teamGames) !== JSON.stringify(this.state.teamGames)) {
            this.findPreviousMeetings()
        }
    }

    getPremID(input_name) {
        var name = input_name || this.props.routeProps.match.params.teamName
        name = this.fixTeamNamePrem(name)
        const id_dict = {
            'Arsenal':1,
            'Aston Villa':2,
            'AFC Bournemouth':127,
            'Brighton':131,
            'Burnley':43,
            'Chelsea':4,
            'Crystal Palace':6,
            'Everton':7,
            'Leicester':26,
            'Liverpool':10,
            'Man City':11,
            'Man Utd':12,
            'Newcastle':23,
            'Norwich City':14,
            'Sheffield United':18,
            'Southampton':20,
            'Spurs':21,
            'Watford':33,
            'West Ham':25,
            'Wolves':38
        }
        const id = id_dict[name]
        return id
    }

    getPrevResults() {
        var team_id = this.getPremID();
        var url = 'https://simple-predictions-api.herokuapp.com/premierleague/football/fixtures?comps=1&compSeasons=274&page=0&pageSize=40&sort=desc&statuses=C&altIds=true&teams='+team_id
        fetch(url).then(response => response.json()).then(data => {
            var lastFiveGames = data['content'].slice(0,5)
            for (var x=0; x<lastFiveGames.length; x++) {
                var game = lastFiveGames[x];
                var homeTeamID = game['teams'][0]['team']['id']
                //var awayTeamID = game['teams'][1]['team']['id']
                var homeTeamScore = game['teams'][0]['score']
                var awayTeamScore = game['teams'][1]['score']
                if (homeTeamScore > awayTeamScore) {
                    // Home Team won
                    if (homeTeamID === team_id) {
                        // Current team are at home
                        var outcome = 'win'
                    } else {
                        // Current team are away
                        outcome = 'lose'
                    }
                } else if (homeTeamScore === awayTeamScore) {
                    // Draw
                    outcome = 'draw'
                } else {
                    // Away Team won
                    if (homeTeamID === team_id) {
                        // Current team are at home
                        outcome = 'lose'
                    } else {
                        // Current team are away
                        outcome = 'win'
                    }
                }
                lastFiveGames[x]['current_team_outcome'] = outcome
            }
            this.setState({
                lastFiveGames: lastFiveGames
            })
        })
    }

    fixTeamNamePrem(name) {
        if (name==='Bournemouth') {name='AFC Bournemouth'}
        if (name==='Crystal Pal') {name='Crystal Palace'}
        if (name==='Tottenham') {name='Spurs'}
        return name
    }

    fixTeamNameFiles(name) {
        if (name==='AFC Bournemouth') {name='Bournemouth'}
        if (name==='Crystal Palace') {name='Crystal Pal'}
        if (name==='Spurs') {name='Tottenham'}
        if (name==='Sheffield Utd') {name='Sheffield United'}
        if (name==='Leicester City') {name='Leicester'}
        if (name==='Newcastle United') {name='Newcastle'}
        return name
    }

    findTeamGames() {
        var games = this.props.games;
        var currentTeamName = this.fixTeamNameFiles(this.props.routeProps.match.params.teamName);
        var teamGames = []
        for (var x=0; x<games.length; x++) {
            var game = games[x];
            var homeTeam = game['home_team']
            var awayTeam = game['away_team']
            if (homeTeam === currentTeamName || awayTeam === currentTeamName) {
                teamGames.push(game)
            }
        }
        if (teamGames.length > 0) {
            var firstGame = teamGames[0]
            this.findTeamTablePosition(firstGame)
        }
        this.setState({
            teamGames: teamGames
        })
    }

    findTeamTablePosition(game) {
        var home_id = this.getPremID(game['home_team'])
        var away_id = this.getPremID(game['away_team'])
        var newState = {}
        var base_url = 'http://simple-predictions-api.herokuapp.com/premierleague/football/compseasons/274/standings/team/'
        fetch(base_url+home_id+'?altIds=true').then(response => response.json()).then(data => {
            var home_pos = data['entries'][data['entries'].length-1]['position'];
            newState['homePosition'] = home_pos
        }).then(() => fetch(base_url+away_id+'?altIds=true')).then(response => response.json()).then(data => {
                var away_pos = data['entries'][data['entries'].length-1]['position'];
                newState['awayPosition'] = away_pos
        }).then(() => {
            this.setState(newState)
        })
    }

    findPreviousMeetings() {
        if (this.state.teamGames[0] == null) {
            return;
        }
        var game = this.state.teamGames[0]
        var previousMeetings = []
        // Find previous meetings between teams over the last 3 years
        var home_id = this.getPremID(game['home_team'])
        var away_id = this.getPremID(game['away_team'])
        var base_url = 'https://simple-predictions-api.herokuapp.com/premierleague/football/fixtures?comps=1&compSeasons=274,210,79&page=0&pageSize=200&sort=desc&statuses=C&altIds=true&teams='
        // Search using home team ID
        fetch(base_url+home_id).then(response => response.json()).then(data => {
            var games_arr = data['content']
            for (var x=0; x < games_arr.length; x++) {
                var game = games_arr[x]
                var teams = game['teams']
                for (var y=0; y<teams.length; y++) {
                    // Check home and away
                    var teamID = teams[y]['team']['id']
                    if (teamID === away_id) {
                        // Match found!
                        previousMeetings.push(game)
                    }
                }
            }
        }).then(
            this.setState({
                previousMeetings: previousMeetings
            })
        )
    }

    render() {
        const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
        return(
            <div>
                <div>
                    <div style={{position: 'absolute'}}>
                        <a href='/' style={{marginLeft:10}}><Button variant='info'>Show homepage</Button></a>
                        <a href='/dashboard' style={{marginLeft:10}}><Button variant='info'>Show dashboard</Button></a>
                    </div>
                    <h1 style={{textAlign: 'center'}}><img alt='team_badge' height={60} src={require(`./badges/${this.fixTeamNameFiles(this.props.routeProps.match.params.teamName)}.png`)} /> {this.props.routeProps.match.params.teamName}</h1>
                </div>
            <div className='row'>
                <div className='col-md-12'>
                <div className='container' style={{maxWidth:'100%'}}>
                    { this.state.teamGames[0] &&
                    <Card>
                        <Card.Header>
                        At {new Date(this.state.teamGames[0].kick_off_time).getHours()}:{("0"+new Date(this.state.teamGames[0].kick_off_time).getMinutes()).slice(-2)} on {new Date(this.state.teamGames[0].kick_off_time).getDate()} {monthNames[new Date(this.state.teamGames[0].kick_off_time).getMonth()]}
                        </Card.Header>
                        <Card.Body>
                            <Table bordered>
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
                                {this.state.teamGames.map((game) => (
                                    <GameRow key={game.id} game={game} showAllColumns={true} showLeaguePosition={true} homeLeaguePosition={this.state.homePosition} awayLeaguePosition={this.state.awayPosition} />
                                ))}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                    }
                </div>
                </div>
            </div>
            <div className='row' style={{marginTop: 30, marginBottom: 30}}>
                <div className='col-md-4'>
                <div className='container' style={{paddingRight: 0}}>
                <Card>
                <Card.Header>Last 5 Games</Card.Header>
                <Card.Body>
                <Table borderless className='lastfive table' style={{width:300, marginBottom: 0}}>
                <tbody>
                    {this.state.lastFiveGames.map((game) => (
                        <tr key={game.id}>
                            <td>{game.current_team_outcome === 'win' ? <Win /> : (game.current_team_outcome === 'draw' ? <Draw /> : <Lose />)}</td>
                            <td><span className='homeTeam'>{game.teams[0].team.club.abbr}</span></td>
                            <td><img src={require(`./badges/${this.fixTeamNameFiles(game.teams[0].team.shortName)}.png`)} height={30} alt='home_team_badge' /></td>
                            <td><span className='score'>{game.teams[0].score} - {game.teams[1].score}</span></td>
                            <td><img src={require(`./badges/${this.fixTeamNameFiles(game.teams[1].team.shortName)}.png`)} height={30} alt='away_team_badge' /></td>
                            <td><span className='awayTeam'>{game.teams[1].team.club.abbr}</span></td>
                        </tr>
                    ))}
                </tbody>
                </Table>
                </Card.Body>
                </Card>
                </div>
                </div>
                <div className='col-md-8'>
                    <div className='container' style={{maxWidth: '100%', paddingLeft:0}}>
                    <Card>
                        <Card.Header>
                            Previous Meetings
                        </Card.Header>
                        <Card.Body>
                            <ul style={{padding:0}}>
                            {this.state.previousMeetings.map((game) => (
                                <li className='previous-meeting' key={game.id}>
                                    <time className='previous-meeting'>{game['kickoff']['label'].split(',')[0]}</time>
                                    <span className='fixture-details'>
                                        <span className='team home-team'>
                                            <span className='teamName'>{game['teams'][0]['team']['shortName']}</span>
                                            <img height={30} alt='home_team_badge' src={require(`./badges/${this.fixTeamNameFiles(game['teams'][0]['team']['shortName'])}.png`)} />
                                        </span>
                                        <span className='score previous-meeting-score'>
                                            {game['teams'][0]['score']} - {game['teams'][1]['score']}
                                        </span>
                                        <span className='team away-team'>
                                            <span className='teamName'>
                                                <img height={30} alt='away_team_badge' src={require(`./badges/${this.fixTeamNameFiles(game['teams'][1]['team']['shortName'])}.png`)} />
                                                {game['teams'][1]['team']['shortName']}
                                            </span>
                                        </span>
                                    </span>
                                </li>
                            ))}
                            </ul>
                        </Card.Body>
                    </Card>
                    </div>
                </div>
            </div>
            </div>
        )
    }
}

export default Team