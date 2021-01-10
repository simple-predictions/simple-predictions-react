import React from 'react'
import {Alert, Nav, Form, InputGroup} from 'react-bootstrap'
import MiniLeagueTable from './MiniLeagueTable'
import DropdownSelector from './DropdownSelector'
import MiniLeagueRankings from './MiniLeagueRankings'
import './MiniLeagues.css'
import HomepageButton from './HomepageButton'
import base_url from './globals'

class MiniLeagues extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      minileagues: [],
      componentName: 'Predictions',
      league_id: '',
      selectedMiniLeague: {'members':[]},
      selectedMiniLeagueTable: [],
      loaded: false,
      createMiniLeagueEnabled: true,
      joinMiniLeagueEnabled: true
    }
    this.handleSelect = this.handleSelect.bind(this)
    this.handleDropdownSelect = this.handleDropdownSelect.bind(this)
    this.createMiniLeague = this.createMiniLeague.bind(this)
    this.joinMiniLeague = this.joinMiniLeague.bind(this)
  }
  async componentDidMount() {
    var newState = await this.props.getMiniLeagues()
    this.setState({
      loaded: true
    })
    if (newState['minileagues'].length > 0) {
      var league_id = newState['minileagues'][0]._id
      newState['league_id'] = league_id
      newState['selectedMiniLeague'] = newState['minileagues'][0]
      this.getMiniLeagueRankings(league_id)
      this.setState(newState)
    }
  }

  handleSelect(eventKey) {
    this.setState({
      componentName: eventKey
    })
  }

  handleDropdownSelect(event) {
    var idx = event.target.value - 1
    var league_id = this.state.minileagues[idx]._id
    this.setState({
      league_id: league_id,
      selectedMiniLeague: this.state.minileagues[idx],
    })
    this.getMiniLeagueRankings(league_id)
  }

  getMiniLeagueRankings(league_id) {
    fetch(base_url+'/minileaguetable?league_id='+league_id, {credentials: "include"}).then(res => res.json()).then(data => {
      this.setState({
        selectedMiniLeagueTable: data
      })
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

  createMiniLeague(event) {
    event.preventDefault()
    if (this.state.createMiniLeagueEnabled === false) {
      return
    }
    this.setState({
      createMiniLeagueEnabled: false
    })
    const data = new FormData(event.target)
    const minileague_name = data.get('minileague-name')

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({league_name: minileague_name}),
      credentials: 'include'
    }

    fetch(base_url+'/createminileague', requestOptions).then(res => {
      this.setState({
        responseStatus: res.status
      })
      return res.json()
    }).then(data => {
      this.setState({
        responseMessage: data,
        createMiniLeagueEnabled: true
      })
    })
  }

  joinMiniLeague(event) {
    event.preventDefault()
    if (this.state.joinMiniLeagueEnabled === false) {
      return
    }
    this.setState({
      joinMiniLeagueEnabled: false
    })
    const data = new FormData(event.target)
    const minileague_name = data.get('minileague-name')

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({league_name: minileague_name}),
      credentials: 'include'
    }

    fetch(base_url+'/joinminileague', requestOptions).then(res => {
      this.setState({
        responseStatus: res.status
      })
      return res.json()
    }).then(data => {
      this.setState({
        responseMessage: data,
        joinMiniLeagueEnabled: true
      })
    })
  }

  render() {
    return (
      <div className='m-0 row'>
        <div className='col-md-4 left-col-prediction-outer-container'>
          <HomepageButton />
          {this.state.responseMessage && <Alert variant={this.state.responseStatus >= 400 ? 'danger' : 'success'}>{this.state.responseMessage}</Alert>}
          <div className='left-col-prediction-container'>
            <h1 className='left-col-prediction-text'>Mini-leagues</h1>
            <DropdownSelector onValueUpdate={this.handleDropdownSelect} length={this.state.minileagues.length} minileagueArr={this.state.minileagues} />
            
            <h4 className='left-col-minileague-text'>Create mini-league</h4>
            <Form style={{marginBottom: 10}} onSubmit={this.createMiniLeague}>
              <InputGroup>
                <Form.Control disabled={!this.state.createMiniLeagueEnabled} placeholder='Mini-league name' type='text' name='minileague-name' />
              </InputGroup>
            </Form>

            <h4 className='left-col-minileague-text'>Join mini-league</h4>
            <Form style={{marginBottom: 10}} onSubmit={this.joinMiniLeague}>
              <InputGroup>
                <Form.Control disabled={!this.state.joinMiniLeagueEnabled} placeholder='Mini-league name' type='text' name='minileague-name' />
              </InputGroup>
            </Form>
          </div>
        </div>
        <div className='col-md-8 right-col'>
          {this.state.minileagues.length > 0 ?
          <div>
            <Nav className='minileague-pills' fill activeKey={this.state.componentName} variant="pills" onSelect={this.handleSelect}>
              <Nav.Item>
                <Nav.Link eventKey='Predictions'>
                  Table
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey='MiniLeagueTable'>
                  Predictions
                </Nav.Link>
              </Nav.Item>
            </Nav>
            {this.state.componentName === 'MiniLeagueTable' ? <MiniLeagueTable league_id={this.state.league_id} getUserPredictions={this.props.getUserPredictions} getMiniLeagues={this.props.getMiniLeagues} /> : <MiniLeagueRankings selectedMiniLeague={this.state.selectedMiniLeagueTable} />}
          </div>
          : 
          <div className='no-mini-league-statement-container'>
            {this.state.loaded ? <div className='no-mini-league-statement'>
              Please create or join a mini-league on the left to view the table and others' predictions.
            </div> : ''}
          </div>
          }
        </div>
      </div>
    )
  }
}

export default MiniLeagues