import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Alert, Nav, Form, InputGroup,
} from 'react-bootstrap';
import { gql, useQuery } from '@apollo/client';
import PropTypes from 'prop-types';
import { createMiniLeague, joinMiniLeague } from '../Logic/MiniLeagueLogic';
import MiniLeagueTable from './MiniLeagueTable';
import DropdownSelector from '../DropdownSelector';
import MiniLeagueRankings from './MiniLeagueRankings';
import './MiniLeagues.css';
import HomepageButton from '../HomepageButton';
import { selectAllMinileagues, selectMinileaguesStatus } from './minileaguesSlice';

const SingleMiniLeague = ({ componentName, setComponentName, selectedMiniLeagueID }) => {
  const [gameweek, setGameweek] = useState(0);
  const QUERY = gql`
  query {
    minileagueOne(filter: { _id: "${selectedMiniLeagueID}" }) {
      name
      members {
        username
        totalPoints
        predictions(gameweek: ${gameweek || 0}) {
          home_pred
          away_pred
          points
          match {
            home_team
            away_team
            gameweek
          }
        }
      }
    }
  }`;

  const { data: queryData } = useQuery(QUERY);
  console.log(queryData);

  useEffect(() => {
    if (queryData?.miniLeagueOne.members[0].predictions[0].match.gameweek !== gameweek && queryData) {
      setGameweek(queryData.miniLeagueOne.members[0].predictions[0].match.gameweek);
    }
  }, [queryData, gameweek]);

  return (
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
  );
};

SingleMiniLeague.propTypes = {
  componentName: PropTypes.string.isRequired,
  setComponentName: PropTypes.func.isRequired,
  selectedMiniLeagueID: PropTypes.string,
};

SingleMiniLeague.defaultProps = {
  selectedMiniLeagueID: '',
};

const MiniLeagues = () => {
  window.scrollTo(0, 35);

  const QUERY = gql`
  query {
    minileagueMany {
      _id
      name
      members {
        username
        totalPoints
        predictions(gameweek: 0) {
          home_pred
          away_pred
          points
          match {
            home_team
            away_team
          }
        }
      }
    }
  }`;
  const { loading: queryLoading, error: queryError, data: queryData } = useQuery(QUERY);
  if (queryError) {
    throw new Error(queryError);
  }

  const [selectedMiniLeagueID, setSelectedMiniLeagueID] = useState('');
  const minileagues = useSelector(selectAllMinileagues);
  const [componentName, setComponentName] = useState('MiniLeagueTable');
  const loaded = useSelector(selectMinileaguesStatus);
  const [createMiniLeagueEnabled, setCreateMiniLeagueEnabled] = useState(true);
  const [joinMiniLeagueEnabled, setJoinMiniLeagueEnabled] = useState(true);
  const [responseMessage, setResponseMessage] = useState('');
  const [responseStatus, setResponseStatus] = useState();

  return (
    <div className="m-0 row">
      <div className="col-lg-4 left-col-prediction-outer-container">
        <HomepageButton />
        {responseMessage && <Alert variant={responseStatus >= 400 ? 'danger' : 'success'}>{responseMessage}</Alert>}
        <div className="left-col-prediction-container">
          <h1 className="left-col-prediction-text">Mini-leagues</h1>
          <DropdownSelector
            onValueUpdate={(e) => setSelectedMiniLeagueID(e.target.value)}
            length={queryData?.minileagueMany.length || 0}
            minileagueArr={queryData?.minileagueMany}
          />
          <h4 className="left-col-minileague-text">Create mini-league</h4>
          <Form
            style={{ marginBottom: 10 }}
            onSubmit={(e) => createMiniLeague(
              e,
              createMiniLeagueEnabled,
              setCreateMiniLeagueEnabled,
              setResponseStatus,
              setResponseMessage,
            )}
          >
            <InputGroup>
              <Form.Control disabled={!createMiniLeagueEnabled} placeholder="Mini-league name" type="text" name="minileague-name" />
            </InputGroup>
          </Form>

          <h4 className="left-col-minileague-text">Join mini-league</h4>
          <Form
            style={{ marginBottom: 10 }}
            onSubmit={(e) => joinMiniLeague(e,
              joinMiniLeagueEnabled,
              setJoinMiniLeagueEnabled,
              setResponseStatus,
              setResponseMessage)}
          >
            <InputGroup>
              <Form.Control disabled={!joinMiniLeagueEnabled} placeholder="Mini-league name" type="text" name="minileague-name" />
            </InputGroup>
          </Form>
        </div>
      </div>
      <div className="col-lg-8 right-col">
        {minileagues.length > 0 ? (
          <SingleMiniLeague componentName={componentName} setComponentName={setComponentName} selectedMiniLeagueID={selectedMiniLeagueID} />
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
