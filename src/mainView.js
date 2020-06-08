import React from 'react';
import {Tabs, Tab} from 'react-bootstrap';
import GamesTable from './games.js';
import MiniLeagueTable from './minileague.js'

class MainView extends React.Component {
    render() {
        return(
            <div>
            <Tabs>
              <Tab eventKey='fixtures' title='Fixtures'>
                <GamesTable games={this.props.games} selectedGame={this.props.selectedGame} />
              </Tab>
              <Tab eventKey='minileague' title='Table'>
                <MiniLeagueTable minileague={this.props.combinedPoints} />
              </Tab>
            </Tabs>
            </div>
        )
    }
}

export default MainView;