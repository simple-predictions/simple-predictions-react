import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Alert, Nav, Form, InputGroup,
} from 'react-bootstrap';
import MiniLeagueTable from './MiniLeagueTable';
import DropdownSelector from '../DropdownSelector';
import MiniLeagueRankings from './MiniLeagueRankings';
import './MiniLeagues.css';
import HomepageButton from '../HomepageButton';
import { selectAllMinileagues, updateSelectedIdx, selectMinileaguesStatus } from './minileaguesSlice';
import baseUrl from '../globals';

const MiniLeagues = () => {
  window.scrollTo(0, 35);

  const dispatch = useDispatch();
  const minileagues = useSelector(selectAllMinileagues);
  const [componentName, setComponentName] = useState('MiniLeagueTable');
  const loaded = useSelector(selectMinileaguesStatus);
  const [createMiniLeagueEnabled, setCreateMiniLeagueEnabled] = useState(true);
  const [joinMiniLeagueEnabled, setJoinMiniLeagueEnabled] = useState(true);
  const [responseMessage, setResponseMessage] = useState('');
  const [responseStatus, setResponseStatus] = useState();

  const createMiniLeague = (e) => {
    e.preventDefault();
    if (createMiniLeagueEnabled === false) {
      return;
    }
    setCreateMiniLeagueEnabled(false);
    const formData = new FormData(e.target);
    const minileagueName = formData.get('minileague-name');

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ league_name: minileagueName }),
      credentials: 'include',
    };

    fetch(`${baseUrl}/createminileague`, requestOptions).then((res) => {
      setResponseStatus(res.status);
      return res.json();
    }).then((data) => {
      setResponseMessage(data);
      setCreateMiniLeagueEnabled(true);
    });
  };

  const joinMiniLeague = (e) => {
    e.preventDefault();
    if (joinMiniLeagueEnabled === false) {
      return;
    }
    setJoinMiniLeagueEnabled(false);
    const formData = new FormData(e.target);
    const minileagueName = formData.get('minileague-name');

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ league_name: minileagueName }),
      credentials: 'include',
    };

    fetch(`${baseUrl}/joinminileague`, requestOptions).then((res) => {
      setResponseStatus(res.status);
      return res.json();
    }).then((data) => {
      setResponseMessage(data);
      setJoinMiniLeagueEnabled(true);
    });
  };

  return (
    <div className="m-0 row">
      <div className="col-lg-4 left-col-prediction-outer-container">
        <HomepageButton />
        {responseMessage && <Alert variant={responseStatus >= 400 ? 'danger' : 'success'}>{responseMessage}</Alert>}
        <div className="left-col-prediction-container">
          <h1 className="left-col-prediction-text">Mini-leagues</h1>
          <DropdownSelector
            onValueUpdate={(e) => dispatch(updateSelectedIdx(e.target.value - 1))}
            length={minileagues.length}
            minileagueArr={minileagues}
          />
          <h4 className="left-col-minileague-text">Create mini-league</h4>
          <Form style={{ marginBottom: 10 }} onSubmit={createMiniLeague}>
            <InputGroup>
              <Form.Control disabled={!createMiniLeagueEnabled} placeholder="Mini-league name" type="text" name="minileague-name" />
            </InputGroup>
          </Form>

          <h4 className="left-col-minileague-text">Join mini-league</h4>
          <Form style={{ marginBottom: 10 }} onSubmit={joinMiniLeague}>
            <InputGroup>
              <Form.Control disabled={!joinMiniLeagueEnabled} placeholder="Mini-league name" type="text" name="minileague-name" />
            </InputGroup>
          </Form>
        </div>
      </div>
      <div className="col-lg-8 right-col">
        {minileagues.length > 0 ? (
          <div>
            <Nav className="minileague-pills" fill activeKey={componentName} variant="pills" onSelect={(e) => setComponentName(e)}>
              <Nav.Item>
                <Nav.Link eventKey="Predictions">
                  Table
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="MiniLeagueTable">
                  Predictions
                </Nav.Link>
              </Nav.Item>
            </Nav>
            {componentName === 'MiniLeagueTable' ? <MiniLeagueTable /> : <MiniLeagueRankings />}
          </div>
        ) : (
          <div className="no-mini-league-statement-container">
            {loaded === 'success' && (
            <div className="no-mini-league-statement">
              Please create or join a mini-league on the left
              to view the table and others&#39; predictions.
            </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MiniLeagues;