/* eslint-disable no-nested-ternary */
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
import { selectAllMinileagues } from './minileaguesSlice';

const SingleMiniLeague = ({
  componentName,
  setComponentName,
  selectedMiniLeagueID,
  setLoaded,
  loaded,
}) => {
  const PREQUERY = gql`
  query {
    findGameweek {
      number
    }
  }`;

  const [gameweek, setGameweek] = useState(0);

  useQuery(PREQUERY, {
    onCompleted: (data) => {
      setGameweek(data.findGameweek.number);
    },
  });

  const QUERY = gql`
  query {
    minileagueOne(filter: {_id: "${selectedMiniLeagueID}"}){
      name
      _id
      members {
        _id
        totalPoints
        username
        predictions(gameweek: ${gameweek}) {
          home_pred
          away_pred
          points
          match {
            _id
          }
        }
      }
    }
    matchMany(filter: { gameweek: ${gameweek} }) {
      _id
      home_team
      away_team
      live_home_score
      live_away_score
      gameweek
      kick_off_time
    }
  }`;

  const { data: queryData, loading: queryLoading } = useQuery(QUERY);
  const [rankings, setRankings] = useState();
  const [table, setTable] = useState([]);

  useEffect(() => {
    setLoaded(!queryLoading);
  }, [queryLoading, setLoaded]);

  useEffect(() => {
    if (queryData) {
      const rankingsPrep = { ...queryData.minileagueOne };
      rankingsPrep.members = rankingsPrep.members.map((member) => {
        const { predictions, ...obj } = member;
        return obj;
      });
      setRankings(rankingsPrep);

      let tablePrep = [...queryData.matchMany];
      tablePrep = tablePrep.map((match) => {
        const members = queryData.minileagueOne.members.map((member) => {
          // eslint-disable-next-line no-underscore-dangle
          const pred = member.predictions.find((innerPred) => innerPred.match._id === match._id);
          return { username: member.username, prediction: pred };
        });

        const retMatch = { ...match };
        retMatch.members = members;

        return retMatch;
      });
      setTable(tablePrep);
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
      {loaded ? (
        componentName === 'MiniLeagueTable' ? <MiniLeagueTable selectedMiniLeagueName={rankings?.name} table={table} setGameweek={setGameweek} gameweek={gameweek} loaded={loaded} /> : <MiniLeagueRankings loaded={loaded} rankings={rankings} />
      ) : (
        <div className="no-mini-league-statement-container">
          <div className="no-mini-league-statement">
            Loading...
          </div>
        </div>
      )}
    </div>
  );
};

SingleMiniLeague.propTypes = {
  componentName: PropTypes.string.isRequired,
  setComponentName: PropTypes.func.isRequired,
  selectedMiniLeagueID: PropTypes.string,
  setLoaded: PropTypes.func.isRequired,
  loaded: PropTypes.bool.isRequired,
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

  const [selectedMiniLeagueID, setSelectedMiniLeagueID] = useState('');

  const { error: queryError, data: queryData, loading: queryLoading } = useQuery(
    QUERY,
    // eslint-disable-next-line no-underscore-dangle
    { onCompleted: () => setSelectedMiniLeagueID(queryData.minileagueMany[0]?._id) },
  );
  if (queryError) {
    throw new Error(queryError);
  }

  const minileagues = useSelector(selectAllMinileagues);
  const [componentName, setComponentName] = useState('MiniLeagueTable');
  const [createMiniLeagueEnabled, setCreateMiniLeagueEnabled] = useState(true);
  const [joinMiniLeagueEnabled, setJoinMiniLeagueEnabled] = useState(true);
  const [responseMessage, setResponseMessage] = useState('');
  const [responseStatus, setResponseStatus] = useState();
  const [loaded, setLoaded] = useState(false);

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
            enabled={!loaded}
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
        {!queryLoading && selectedMiniLeagueID ? (
          minileagues.length > 0 ? (
            <SingleMiniLeague
              setLoaded={setLoaded}
              loaded={loaded}
              componentName={componentName}
              setComponentName={setComponentName}
              selectedMiniLeagueID={selectedMiniLeagueID}
            />
          ) : (
            <div className="no-mini-league-statement-container">
              {!queryLoading && (
              <div className="no-mini-league-statement">
                Please create or join a mini-league on the left
                to view the table and others&#39; predictions.
              </div>
              )}
            </div>
          )
        ) : (
          <div className="no-mini-league-statement-container">
            <div className="no-mini-league-statement">
              Loading...
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MiniLeagues;
