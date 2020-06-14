import React from 'react';
import { Card, Container, Row, Col, Table } from 'react-bootstrap';
import ReactHtmlParser from 'react-html-parser';
import GameRow from './gamerow.js';
import LiveStats from './livestats.js';

class Game extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            id: this.props.routeProps.match.params.gameId,
            game: {},
            liveCommentary: '<div></div>',
            liveStats: {
                possession: {},
                shots: {},
                fouls: {},
                yellow: {},
                red: {},
                offside: {},
                corner: {},
                save: {}
            }
        }
    }
    componentDidMount(prevProps, prevState) {
        this.findGame()
        this.updateCommentary()
        this.updateMinute()
        setInterval(() => {
            // Gets live commentary
            this.updateCommentary()
        }, 20000)
        setInterval(() => {
            // Updates game minute
            this.updateMinute()
        }, 100000)
    }
    componentDidUpdate(prevProps, prevState) {
        if (this.state.id !== prevState.id || this.props.games !== prevProps.games) {
            this.findGame()
        }
    }

    updateMinute() {
        if (this.state.game.status === "INPLAY") {
            var kick_off_time = new Date(this.state.game.kick_off_time)
            var now = Date.now()
            if (kick_off_time < now) {
                // Game in play
                var diff = now - kick_off_time
                var diffMins = Math.round(((diff % 86400000) % 3600000) / 60000) + '\''
                this.setState({
                    gameMin: diffMins
                })
            }
        } else if (this.state.game.status === "FINISHED") {
            this.setState({
                gameMin: 'Full time'
            })
        } else {
            this.setState({
                gameMin: ''
            })
        }
    }

    findGame(){
        let game = this.props.games.find(game => game.id === this.state.id);
        if (game) {
            this.setState({
                game: game
            })
        }
    }

    updateStats(game_id) {
        return new Promise((resolve, reject) => {
            var url = 'https://secure.espn.com/core/football/matchstats?gameId='+game_id+'&xhr=1&render=true&device=desktop&country=gb&lang=en&region=us&site=espn&edition-host=espn.com&site-type=full'
            fetch(url).then(response => { return response.json()}).then(data => {
                var stats = {
                    possession: {},
                    shots: {},
                    fouls: {},
                    yellow: {},
                    red: {},
                    offside: {},
                    corner: {},
                    save: {}
                }
                var html = data['content']['html']
                // Possession
                var possStartIndex = html.lastIndexOf('<div class="stat-graph compareLineGraph twoTeam"')
                var possEndIndex = html.indexOf('</div>', possStartIndex)
                var possString = html.substring(possStartIndex, possEndIndex) + '</div>'
                var firstPossIndex = possString.indexOf('%')
                var firstPoss = possString.substring(firstPossIndex-2, firstPossIndex);
                var lastPossIndex = possString.lastIndexOf('%')
                var lastPoss = possString.substring(lastPossIndex-2, lastPossIndex)
                stats['possession']['home'] = firstPoss;
                stats['possession']['away'] = lastPoss;
                // Shots
                var shotsStartIndex = html.lastIndexOf('<div class="shots">')
                var shotsEndIndex = html.indexOf('class="shots-on-goal" data-home-away="away"', shotsStartIndex)
                var shotsString = html.substring(shotsStartIndex, shotsEndIndex)
                var allShots = shotsString.match(/Summary">(.*?)\)/g)
                var homeShots = allShots[0].substring(9)
                var awayShots = allShots[1].substring(9)
                stats['shots']['home'] = homeShots
                stats['shots']['away'] = awayShots
                // General stats
                var allStatsStartIndex = html.lastIndexOf('<div class="stat-list">')
                var allStatsEndIndex = html.indexOf('</div>', allStatsStartIndex)
                var allStatsString = html.substring(allStatsStartIndex, allStatsEndIndex)
                // Fouls
                var allFouls = allStatsString.match(/foulsCommitted">(.*?)</g)
                var homeFouls = allFouls[0].substring(16, allFouls[0].length-1)
                var awayFouls = allFouls[1].substring(16, allFouls[1].length-1)
                stats['fouls']['home'] = homeFouls
                stats['fouls']['away'] = awayFouls
                // Yellow cards
                var allYellow = allStatsString.match(/yellowCards">(.*?)</g)
                var homeYellow = allYellow[0].substring(13, allYellow[0].length-1)
                var awayYellow = allYellow[1].substring(13, allYellow[1].length-1)
                stats['yellow']['home'] = homeYellow
                stats['yellow']['away'] = awayYellow
                // Red cards
                var allRed = allStatsString.match(/redCards">(.*?)</g)
                var homeRed = allRed[0].substring(10, allRed[0].length-1)
                var awayRed = allRed[1].substring(10, allRed[1].length-1)
                stats['red']['home'] = homeRed
                stats['red']['away'] = awayRed
                // Offsides
                var allOffside = allStatsString.match(/offsides">(.*?)</g)
                var homeOffside = allOffside[0].substring(10, allOffside[0].length-1)
                var awayOffside = allOffside[1].substring(10, allOffside[1].length-1)
                stats['offside']['home'] = homeOffside
                stats['offside']['away'] = awayOffside
                // Corners
                var allCorner = allStatsString.match(/wonCorners">(.*?)</g)
                var homeCorner = allCorner[0].substring(12, allCorner[0].length-1)
                var awayCorner = allCorner[1].substring(12, allCorner[1].length-1)
                stats['corner']['home'] = homeCorner
                stats['corner']['away'] = awayCorner
                // Saves
                var allSave = allStatsString.match(/saves">(.*?)</g)
                var homeSave = allSave[0].substring(7, allSave[0].length-1)
                var awaySave = allSave[1].substring(7, allSave[1].length-1)
                stats['save']['home'] = homeSave
                stats['save']['away'] = awaySave
                this.setState({
                    liveStats: stats
                })
                resolve(data)
            })
        })
    }

    async updateCommentary() {
        var home_team_name = this.state.game.home_team;
        var away_team_name = this.state.game.away_team;
        var game_id = await this.getGameId(home_team_name, away_team_name);
        this.updateStats(game_id);
        var url = 'https://secure.espn.com/core/football/commentary?gameId='+game_id+'&xhr=1&render=true&device=desktop&country=gb&lang=en&region=gb&site=espn&edition-host=espn.co.uk&site-type=full'
        fetch(url).then(response => {return response.json()}).then(data => {
            var html = data['content']['html'];
            var startIndex = html.lastIndexOf('<div id="match-commentary-1-tab-1')
            var endIndex = html.indexOf('</div>', startIndex)
            var mySubString = html.substring(startIndex, endIndex) + '</div>'
            mySubString = mySubString.replace('<h1>Match Commentary</h1>','')
            this.setState({
                liveCommentary: mySubString
            })
        })
    }

    getTeamId(name) {
        return new Promise((resolve, reject) => {
            fetch('https://site.web.api.espn.com/apis/site/v2/sports/soccer/ENG.1/teams?region=gb&lang=en&contentorigin=espn&limit=400').then(response => {return response.json()}).then(data => {
            var teams_arr = data['sports'][0]['leagues'][0]['teams'];
                for (var i = 0;i < teams_arr.length;i++) {
                    var team = teams_arr[i]['team'];
                    var long_name = team['name'];
                    var short_name = team['shortDisplayName'];
                    if (short_name === name || long_name === name) {
                        var id = team['id']
                        resolve(id)
                    }
                }
            })
        })
    }

    getGameId(home_team_id, away_team_id) {
        var url = 'https://secure.espn.com/core/football/scoreboard/_/league/eng.1?xhr=1&render=true&device=desktop&country=gb&lang=en&region=gb&site=espn&edition-host=espn.co.uk&site-type=full'
        return new Promise((resolve,reject) => {fetch(url).then(response => {return response.json()}).then(data => {
            var games_arr = data['content']['sbData']['events']
            for (var i = 0;i < games_arr.length; i++) {
                var game = games_arr[i]
                var teams = game['competitions'][0]['competitors'];
                var current_home_team_id = teams[0]['id'];
                var current_away_team_id = teams[1]['id'];
                if (current_home_team_id === home_team_id && current_away_team_id === away_team_id) {
                    var game_id = game['id'];
                    resolve(game_id);
                }
            }
            resolve('123456')
        })
        })
    }

    render() {
        var liveCommentary;
        if (this.state.liveCommentary !== '<div></div>') {
            liveCommentary = <Row>
                                <Col>
                                    <Card>
                                        <Card.Header>Live Commentary</Card.Header>
                                        <Card.Body style={{height: '50vh', overflow: 'auto'}}>
                                            {ReactHtmlParser(this.state.liveCommentary)}
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>
        } else {
            liveCommentary = '';
        }

        // Format kick off time
        var formatted_kick_off_time;
        var kick_off_time;
        if (this.state.game.kick_off_time) {
            kick_off_time = new Date(this.state.game.kick_off_time)
            var hours = kick_off_time.getHours()
            var minutes = kick_off_time.getMinutes()
            var day = kick_off_time.getDay()
            var weekday=new Array(7);
            weekday[1]="Monday";
            weekday[2]="Tuesday";
            weekday[3]="Wednesday";
            weekday[4]="Thursday";
            weekday[5]="Friday";
            weekday[6]="Saturday";
            weekday[0]="Sunday";
            var day_name = weekday[day]
            formatted_kick_off_time = hours + ':' + ("00"+minutes).slice(-2) + ' on ' + day_name;
        }
        return(
            <div>
                <h2 style={{textAlign: 'center'}}>{this.state.game.home_team} {this.state.game.live_home_score} vs {this.state.game.live_away_score} {this.state.game.away_team} {this.state.gameMin}</h2>
                <Container>
                    <Row style={{marginBottom: 20}}>
                        <Col sm={6}>
                            <Card border='primary'>
                                <Card.Header className='border-primary'>Live Stats</Card.Header>
                                <Card.Body>
                                    {this.state.liveStats.possession.home ? <LiveStats liveStats={this.state.liveStats} /> : "This game doesn't kick off until "+ (formatted_kick_off_time || 'later')}
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col sm={6}>
                            <Card border='success'>
                                <Card.Header className='border-success'>Current mini-table</Card.Header>
                                <Card.Body>
                                    <Table bordered>
                                    <thead className='table-header'>
                                        <tr>
                                            <th colSpan='6'>Predictions</th>
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
                                        <GameRow showAllColumns={false} game={this.state.game} />
                                    </tbody>
                                    </Table>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                    {liveCommentary}
                </Container>
            </div>
        )
    }
}

export default Game;