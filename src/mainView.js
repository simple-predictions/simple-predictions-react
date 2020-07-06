import React from 'react';
import {Tabs, Tab, Button} from 'react-bootstrap';
import GamesTable from './games.js';
import MiniLeagueTable from './minileague.js'

class MainView extends React.Component {
    render() {
        return(
            <div>
              <a href='/dashboard' style={{display: 'table', margin:'auto', marginBottom:5}}><Button variant='info'>Show Dashboard</Button></a>
              <div>
              <Tabs>
                <Tab eventKey='fixtures' title='Fixtures'>
                  <GamesTable games={this.props.games} selectedGame={this.props.selectedGame} playerPoints={this.props.combinedPoints} />
                </Tab>
                <Tab eventKey='minileague' title='Table'>
                  <MiniLeagueTable minileague={this.props.combinedPoints} />
                </Tab>
              </Tabs>
              </div>
            </div>
        )
    }
}

export default MainView;