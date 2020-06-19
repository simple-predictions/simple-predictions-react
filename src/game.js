import React from 'react';
import { Card, Container, Row, Col, Table } from 'react-bootstrap';
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
        if (this.state.game !== prevState.game) {
            this.updateCommentary()
            this.updateMinute()
        }
    }

    updateMinute() {
        if (this.state.game.status === "IN_PLAY") {
            var kick_off_time = new Date(this.state.game.kick_off_time)
            var now = Date.now()
            if (kick_off_time < now) {
                // Game in play
                var diff = now - kick_off_time
                var diffMins = Math.round(((diff % 86400000) % 3600000) / 60000)
                // Allow for 1 hour time diff
                diffMins = diffMins + 60
                // Check if past half time
                if (diffMins>45 && diffMins<60) {
                    diffMins='Half Time'
                } else if (diffMins>=60) {
                    diffMins -= 15
                }
                // Add ' to indicate seconds to user
                diffMins = diffMins + '\''
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

    updateStats(ids) {
        return new Promise((resolve, reject) => {
            var game_id = ids[0]
            var home_id = ids[1]
            var away_id = ids[2]
            var url = 'https://simple-predictions-api.herokuapp.com/premierleague/football/stats/match/'+game_id
            fetch(url).then(response => { return response.json()}).then(data => {
                var stats = {
                    possession: {},
                    ontargetshots: {},
                    allshots: {},
                    fouls: {},
                    yellow: {},
                    red: {},
                    offside: {},
                    corner: {},
                    save: {}
                }
                var homeData = data['data'][home_id]['M']
                var awayData = data['data'][away_id]['M']
                for (var i = 0; i < homeData.length; i++) {
                    var currentData = homeData[i]
                    var arr = this.checkAttribute(currentData)
                    if (arr) {
                        stats[arr[0]]['home'] = arr[1]
                    }
                }
                for (i = 0; i < awayData.length; i++) {
                    currentData = awayData[i]
                    arr = this.checkAttribute(currentData)
                    if (arr) {
                        stats[arr[0]]['away'] = arr[1]
                    }
                }
                this.setState({
                    liveStats: stats
                })
                resolve(data)
            })
        })
    }

    checkAttribute(row) {
        var attribute = row['name']
        if (attribute === 'possession_percentage') {
            // Possession
            return ['possession',row['value']]
        }
        if (attribute === 'total_scoring_att') {
            // Total shots
            return ['allshots',row['value']]
        }
        if (attribute === 'ontarget_scoring_att') {
            // On target shots
            return ['ontargetshots',row['value']]
        }
        if (attribute === 'fk_foul_lost') {
            // Fouls conceded
            return ['fouls',row['value']]
        }
        if (attribute === 'total_yel_card') {
            // Yellow cards
            return ['yellow',row['value']]
        }
        if (attribute === 'total_offside') {
            // Offsides
            return ['offside',row['value']]
        }
        if (attribute === 'lost_corners') {
            // Lost corners
            return ['corner',row['value']]
        }
        if (attribute === 'saves') {
            // Saves
            return ['save',row['value']]
        }
        return
    }

    async updateCommentary() {
        var home_team_name = this.state.game.home_team;
        var away_team_name = this.state.game.away_team;
        var ids = await this.getIDs(home_team_name, away_team_name);
        if (!ids) {
            return
        }
        this.updateStats(ids);
        var game_id = ids[0]
        var url = 'https://simple-predictions-api.herokuapp.com/premierleague/football/fixtures/'+game_id+'/textstream/EN?pageSize=100&sort=desc'
        fetch(url).then(response => {return response.json()}).then(data => {
            var commentary = data['events']['content'];
            this.setState({
                liveCommentary: commentary
            })
        })
    }

    getIDs(home_team_name, away_team_name) {
        return new Promise((resolve,reject) => {fetch("https://simple-predictions-api.herokuapp.com/premierleague/football/fixtures?comps=1&compSeasons=274&teams=1,2,127,131,43,4,6,7,26,10,11,12,23,14,18,20,21,33,25,38&page=0&pageSize=40&sort=desc&statuses=L,C&altIds=true").then(response => {return response.json()}).then(data => {
            var games_arr = data['content']
            for (var i = 0;i < games_arr.length; i++) {
                var game = games_arr[i]
                var teams = game['teams'];
                var current_home_team_shortName = teams[0]['team']['shortName'];
                var current_home_team_name = teams[0]['team']['name']
                var current_away_team_shortName = teams[1]['team']['shortName']
                var current_away_team_name = teams[1]['team']['name']
                home_team_name = this.fixTeamNamePrem(home_team_name)
                away_team_name = this.fixTeamNamePrem(away_team_name)
                if ((current_home_team_name === home_team_name || current_home_team_shortName === home_team_name) && (current_away_team_name === away_team_name || current_away_team_shortName === away_team_name)) {
                    var game_id = game['id'];
                    var home_team_id = game['teams'][0]['team']['id'];
                    var away_team_id = game['teams'][1]['team']['id'];
                    resolve([game_id, home_team_id, away_team_id]);
                }
            }
            resolve()
        })
        })
    }

    fixTeamNamePrem(name) {
        if (name==='Tottenham') {name='Spurs'}
        return name
    }

    render() {
        var liveCommentary;
        if (this.state.liveCommentary !== '<div></div>') {
            liveCommentary = <Row>
                                <Col>
                                    <Card>
                                        <Card.Header>Live Commentary</Card.Header>
                                        <Card.Body style={{height: '50vh', overflow: 'auto'}}>
                                            {this.state.liveCommentary.map((event) => (
                                                <div key={event.id}><p><strong>{event.time ? event.time.label : null}</strong> {event.text}</p></div>
                                            ))}
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
                {this.state.game.home_team && <h2 style={{textAlign: 'center'}}><img src={require(`./badges/${this.state.game.home_team}.png`)} height={'80'} alt='team badge'/> {this.state.game.home_team} {this.state.game.live_home_score} vs {this.state.game.live_away_score} {this.state.game.away_team} <img src={require(`./badges/${this.state.game.away_team}.png`)} height={'80'} alt='team badge'/> {this.state.gameMin}</h2> }
                <Container>
                    <Row style={{marginBottom: 20}}>
                        <Col sm={6}>
                            <Card border='primary'>
                                <Card.Header className='border-primary'>Live Stats</Card.Header>
                                <Card.Body>
                                    {typeof this.state.liveStats.possession.home != 'undefined' ? <LiveStats liveStats={this.state.liveStats} /> : "This game doesn't kick off until "+ (formatted_kick_off_time || 'later')}
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