import React from 'react';

class Game extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            id: this.props.routeProps.match.params.gameId,
            game: {}
        }
    }
    componentDidMount(prevProps, prevState) {
        this.findGame()
    }
    componentDidUpdate(prevProps, prevState) {
        if (this.state.id !== prevState.id || this.props.games !== prevProps.games) {
            this.findGame()
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
    render() {
        return(
            <div>
                <h2>{this.state.game.home_team}</h2>
            </div>
        )
    }
}

export default Game;