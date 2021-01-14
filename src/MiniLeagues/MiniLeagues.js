import React, {useState} from 'react'
import {Alert, Nav, Form, InputGroup} from 'react-bootstrap'
import MiniLeagueTable from './MiniLeagueTable'
import DropdownSelector from '../DropdownSelector'
import MiniLeagueRankings from './MiniLeagueRankings'
import './MiniLeagues.css'
import HomepageButton from '../HomepageButton'
import {useSelector, useDispatch} from 'react-redux'
import {selectAllMinileagues, updateSelectedIdx, selectSelectedMinileague} from './minileaguesSlice'
import base_url from '../globals'

const MiniLeagues = () => {
  /*constructor(props) {
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

  */
  //const [minileagues, setMinileagues] = useState([])
  const dispatch = useDispatch()
  const minileagues = useSelector(selectAllMinileagues)
  const [componentName, setComponentName] = useState('MiniLeagueTable')
  const [leagueID, setLeagueID] = useState('')
  const selectedMiniLeague = useSelector(selectSelectedMinileague)
  const [selectedMiniLeagueTable, setSelectedMiniLeagueTable] = useState([])
  const [loaded, setLoaded] = useState(false)
  const [createMiniLeagueEnabled, setCreateMiniLeagueEnabled] = useState(true)
  const [joinMiniLeagueEnabled, setJoinMiniLeagueEnabled] = useState(true)
  const [responseMessage, setResponseMessage] = useState('')
  const [responseStatus, setResponseStatus] = useState()

  const createMiniLeague = (e) => {
    e.preventDefault()
    if (createMiniLeagueEnabled === false) {
      return
    }
    setCreateMiniLeagueEnabled(false)
    const data = new FormData(e.target)
    const minileague_name = data.get('minileague-name')

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({league_name: minileague_name}),
      credentials: 'include'
    }

    fetch(base_url+'/createminileague', requestOptions).then(res => {
      setResponseStatus(res.status)
      return res.json()
    }).then(data => {
      setResponseMessage(data)
      setCreateMiniLeagueEnabled(true)
    })
  }

  const joinMiniLeague = (e) => {
    e.preventDefault()
    if (joinMiniLeagueEnabled === false) {
      return
    }
    setJoinMiniLeagueEnabled(false)
    const data = new FormData(e.target)
    const minileague_name = data.get('minileague-name')

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({league_name: minileague_name}),
      credentials: 'include'
    }

    fetch(base_url+'/joinminileague', requestOptions).then(res => {
      setResponseStatus(res.status)
      return res.json()
    }).then(data => {
      setResponseMessage(data)
      setJoinMiniLeagueEnabled(true)
    })
  }

  return (
    <div className='m-0 row'>
      <div className='col-lg-4 left-col-prediction-outer-container'>
        <HomepageButton />
        {responseMessage && <Alert variant={responseStatus >= 400 ? 'danger' : 'success'}>{responseMessage}</Alert>}
        <div className='left-col-prediction-container'>
          <h1 className='left-col-prediction-text'>Mini-leagues</h1>
          <DropdownSelector onValueUpdate={(e) => dispatch(updateSelectedIdx(e.target.value - 1))} length={minileagues.length} minileagueArr={minileagues} />
          
          <h4 className='left-col-minileague-text'>Create mini-league</h4>
          <Form style={{marginBottom: 10}} onSubmit={createMiniLeague}>
            <InputGroup>
              <Form.Control disabled={!createMiniLeagueEnabled} placeholder='Mini-league name' type='text' name='minileague-name' />
            </InputGroup>
          </Form>

          <h4 className='left-col-minileague-text'>Join mini-league</h4>
          <Form style={{marginBottom: 10}} onSubmit={joinMiniLeague}>
            <InputGroup>
              <Form.Control disabled={!joinMiniLeagueEnabled} placeholder='Mini-league name' type='text' name='minileague-name' />
            </InputGroup>
          </Form>
        </div>
      </div>
      <div className='col-lg-8 right-col'>
        {minileagues.length > 0 ?
        <div>
          <Nav className='minileague-pills' fill activeKey={componentName} variant="pills" onSelect={(e) => setComponentName(e)}>
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
          {componentName === 'MiniLeagueTable' ? <MiniLeagueTable league_id={leagueID} /> : <MiniLeagueRankings />}
        </div>
        : 
        <div className='no-mini-league-statement-container'>
          {loaded ? <div className='no-mini-league-statement'>
            Please create or join a mini-league on the left to view the table and others' predictions.
          </div> : ''}
        </div>
        }
      </div>
    </div>
  )
}

export default MiniLeagues