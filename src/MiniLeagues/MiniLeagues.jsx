import React, { useState, useEffect } from 'react';
import {
  Alert, Nav, Form, InputGroup,
} from 'react-bootstrap';
import { gql, useMutation, useQuery } from '@apollo/client';
import PropTypes from 'prop-types';
import MiniLeagueTable from './MiniLeagueTable';
import DropdownSelector from '../DropdownSelector';
import MiniLeagueRankings from './MiniLeagueRankings';
import './MiniLeagues.css';
import HomepageButton from '../HomepageButton';

const SingleMiniLeague = ({
  componentName,
  setComponentName,
  selectedMiniLeagueID,
  setLoaded,
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
    returnPartialData: true,
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

  const { data: queryData, loading: queryLoading } = useQuery(QUERY, {
    returnPartialData: true,
  });
  const [rankings, setRankings] = useState();
  const [table, setTable] = useState([]);

  useEffect(() => {
    setLoaded(!queryLoading);
  }, [queryLoading, setLoaded]);

  useEffect(() => {
    if (queryData.minileagueOne
      && queryData.matchMany
      && queryData.minileagueOne.members[0].predictions) {
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
          const pred = member.predictions?.find((innerPred) => innerPred.match._id === match._id);
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
      {(() => {
        if (queryData.minileagueOne && rankings) {
          return componentName === 'MiniLeagueTable' ? <MiniLeagueTable selectedMiniLeagueName={rankings.name} table={table} setGameweek={setGameweek} gameweek={gameweek} loaded={!!queryData} /> : <MiniLeagueRankings loaded={queryData} rankings={rankings} />;
        }
        return (
          <div className="no-mini-league-statement-container query-data-single">
            <div className="no-mini-league-statement">
              Loading...
            </div>
          </div>
        );
      })()}
    </div>
  );
};

SingleMiniLeague.propTypes = {
  componentName: PropTypes.string.isRequired,
  setComponentName: PropTypes.func.isRequired,
  selectedMiniLeagueID: PropTypes.string,
  setLoaded: PropTypes.func.isRequired,
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
    }
  }`;

  const [selectedMiniLeagueID, setSelectedMiniLeagueID] = useState('');

  const { error: queryError, data: queryData, loading: queryLoading } = useQuery(
    QUERY,
    {
      returnPartialData: true,
    },
  );
  if (queryError) {
    throw new Error(queryError);
  }

  useEffect(() => {
    if (queryData.minileagueMany && selectedMiniLeagueID === '') {
      // eslint-disable-next-line no-underscore-dangle
      setSelectedMiniLeagueID(queryData.minileagueMany[0]?._id);
    }
  }, [queryData, selectedMiniLeagueID]);

  const [componentName, setComponentName] = useState('MiniLeagueTable');
  const [responseMessage, setResponseMessage] = useState('');
  const [responseStatus, setResponseStatus] = useState();
  const [loaded, setLoaded] = useState(false);

  const joinMinileagueMutation = gql`
    mutation($leagueName: String!) {
      joinMinileague(leagueName: $leagueName) {
        name
      }
    }
  `;
  const [joinMinileague, { loading: joinMutationLoading }] = useMutation(joinMinileagueMutation, {
    onError: (error) => {
      setResponseMessage(error.message);
      setResponseStatus(400);
    },
    onCompleted: () => {
      setResponseMessage('Success');
      setResponseStatus(200);
    },
  });

  const createMinileagueMutation = gql`
    mutation($leagueName: String!) {
      createMinileague(leagueName: $leagueName) {
        name
      }
    }
  `;
  const [createMinileague,
    { loading: createMutationLoading }] = useMutation(createMinileagueMutation, {
    onError: (error) => {
      setResponseMessage(error.message);
      setResponseStatus(400);
    },
    onCompleted: () => {
      setResponseMessage('Success');
      setResponseStatus(200);
    },
  });

  return (
    <div className="m-0 row">
      <div className="col-lg-4 left-col-prediction-outer-container">
        <HomepageButton />
        {responseMessage && <Alert variant={responseStatus >= 400 ? 'danger' : 'success'}>{responseMessage}</Alert>}
        <div className="left-col-prediction-container">
          <h1 className="left-col-prediction-text">Mini-leagues</h1>
          <DropdownSelector
            onValueUpdate={(e) => setSelectedMiniLeagueID(e.target.value)}
            length={queryData?.minileagueMany?.length || 0}
            minileagueArr={queryData?.minileagueMany}
            enabled={!loaded}
          />
          <h4 className="left-col-minileague-text">Create mini-league</h4>
          <Form
            style={{ marginBottom: 10 }}
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              const minileagueName = formData.get('minileague-name');
              createMinileague({ variables: { leagueName: minileagueName } });
            }}
          >
            <InputGroup>
              <Form.Control disabled={createMutationLoading} placeholder="Mini-league name" type="text" name="minileague-name" />
            </InputGroup>
          </Form>

          <h4 className="left-col-minileague-text">Join mini-league</h4>
          <Form
            style={{ marginBottom: 10 }}
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              const minileagueName = formData.get('minileague-name');
              joinMinileague({ variables: { leagueName: minileagueName } });
            }}
          >
            <InputGroup>
              <Form.Control disabled={joinMutationLoading} placeholder="Mini-league name" type="text" name="minileague-name" />
            </InputGroup>
          </Form>
        </div>
      </div>
      <div className="col-lg-8 right-col">
        {(() => {
          if (!queryLoading) {
            if (queryData.minileagueMany.length > 0 && selectedMiniLeagueID) {
              return (
                <SingleMiniLeague
                  setLoaded={setLoaded}
                  loaded={loaded}
                  componentName={componentName}
                  setComponentName={setComponentName}
                  selectedMiniLeagueID={selectedMiniLeagueID}
                />
              );
            }
            return (
              <div className="no-mini-league-statement-container length-zero">
                {!queryLoading && (
                <div className="no-mini-league-statement">
                  Please create or join a mini-league on the left
                  to view the table and others&#39; predictions.
                </div>
                )}
              </div>
            );
          }
          return (
            <div className="no-mini-league-statement-container query-data">
              <div className="no-mini-league-statement">
                Loading...
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
};

export default MiniLeagues;
