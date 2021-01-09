import React from 'react'
import {Link} from 'react-router-dom';
import './Homepage.css'
import Cookies from 'js-cookie'
import {Container, Table, Card, Jumbotron} from 'react-bootstrap'
import DropdownSelector from './DropdownSelector'
import base_url from './globals'

class Homepage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      user: {},
      user_predictions: [],
      minileagues: [],
      selectedMinileague: []
    }

    this.updateSelectedMinileague = this.updateSelectedMinileague.bind(this)
  }
  componentDidMount() {
    this.props.getUserPredictions().then(res => {
      this.setState(res)
    })
    fetch(base_url+'/userinfo', {credentials: 'include'}).then(response => {
      if (response.status === 401) {
        Cookies.remove('connect.sid')
        this.props.clearApiCookie()
        return []
      }
      return response.json()
    }).then(data => {
      this.setState({
        user: data
      })
    })

    this.props.getMiniLeagues().then(res => {
      this.setState(res)
      this.updateSelectedMinileague({target: {value: 1}})
    })
  }

  updateSelectedMinileague(event) {
    var idx = event.target.value - 1
    var league_id = this.state.minileagues[idx]._id
    fetch(base_url+'/minileaguetable?league_id='+league_id, {credentials: "include"}).then(res => res.json()).then(data => {
      this.setState({
        selectedMinileague: data
      })
    })
  }

  render() {
    return (
      <Container>
      <Jumbotron className='outer-dashboard-container'>
        <h1>Hi, {this.state.user.username}</h1>
        <div className='row header-row'>
          <div className='col-md-6'>
            <h3>Predictions</h3>
          </div>
          <div className='col-md-6'>
            <h3>Minileagues</h3>
          </div>
        </div>
        <div className='row'>
          <div className='col-md-6'>
            
          </div>
          <div className='col-md-6'>
            <DropdownSelector onValueUpdate={this.updateSelectedMinileague} minileagueArr={this.state.minileagues} length={this.state.minileagues.length}/>
          </div>
        </div>
        <div className='row equal-height-card-row'>
          <div className='col-md-6'>
            <Card>
              <Table borderless size='sm' className='mini-table mini-predictions-table'>
                <tbody>
                  {this.state.user_predictions.map((match) => (
                    <tr key={match._id}>
                      <td><img alt={match.home_team+' logo'}height={30} src={require('./badges/'+match.home_team+'.png')} /></td>
                      <td><span className={match.status === 'FINISHED' ? 'match-finished' : match.status === 'IN_PLAY' ? 'match-inplay' : ''}>{match.user_predictions[0].home_pred} - {match.user_predictions[0].away_pred}</span></td>
                      <td><img alt={match.away_team+' logo'} height={30} src={require('./badges/'+match.away_team+'.png')} /></td>
                      <td>{match.user_predictions[0].points || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card>
          </div>
          <div className='col-md-6'>
            <Card>
              <Table borderless className='mini-table' size='sm'>
                <thead>
                  <tr>
                    <th><strong>Position</strong></th>
                    <th><strong>Username</strong></th>
                    <th><strong>Points</strong></th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.selectedMinileague.map((player, idx) => (
                    <tr key={player.username}>
                      <td>{idx+1}</td>
                      <td>{player.username}</td>
                      <td>{player.points}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card>
          </div>
        </div>
      </Jumbotron>
      </Container>
    )
  }
}

export default Homepage