import React, { Component } from 'react';
import './Scores.css';
import Player from './Player';

class Scores extends Component {
    constructor(props) {
        super(props);
        /*
        newPlayer: used for the new player input textbox
        actionPlayer: player to be acted on by API call
        playerList: used to populate scoreboard
        */
    this.state = {
        newPlayer: '',
        actionPlayer: '',
        playerList: []
    };
    this.routeToHome = this.routeToHome.bind(this);
    this.handlePlayer = this.handlePlayer.bind(this);
    }

    async componentDidMount() {
        this.updateScoreboard();
    }

    /* Update the scoreboard after database is updated. */
    async updateScoreboard() {
        const res = await fetch('/api/scores');
        const resJson = res.json();
        resJson.then(result => {
            let i;
            let scores = [];
            for (i = 0; i < result.length; i++) {
                scores[i] = [result[i].name, result[i].score];
            }
            this.setState({ playerList: scores });
        });
    }

    /* Bind API function to row element of scoreboard and update scoreboard. */
    async handleClickIndex(index, event) {
        this[event.target.name].bind(this)(index, event).then(() => this.updateScoreboard());
    }

    /* Helper function to set the actionPlayer for post requests. */
    setActionPlayer(index) {
        this.setState((prevState) => {
            const actionPlayer = prevState.playerList[index];
            return {
                actionPlayer: actionPlayer
            }
        });
    }

    /* Build the payload for post requests. */
    buildPostRequest(param) {
        return {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                player: [param]
            })
        };
    }

    /* Increment player score. */
    async addPlayerScore(index) {
        await this.setActionPlayer(index);
        const payload = this.buildPostRequest(this.state.actionPlayer[0]);
        const res = await fetch('/api/add-player-score', payload);
        const resJson = res.json();
        return resJson;
    }

    /* Decrement player score. */
    async subtractPlayerScore(index) {
        await this.setActionPlayer(index);
        const payload = this.buildPostRequest(this.state.actionPlayer[0]);
        const res = await fetch('/api/subtract-player-score', payload);
        const resJson = res.json();
        return resJson;
    }

    /* Delete player. */
    async removePlayer(index) {
        await this.setActionPlayer(index);
        const payload = this.buildPostRequest(this.state.actionPlayer[0]);
        const res = await fetch('/api/delete-player', payload);
        const resJson = res.json();
        return resJson;
    }

    /* Add new player. */
    async postPlayer() {
        this.setState({ newPlayer: '' });
        if (this.state.newPlayer !== '') {
            const payload = this.buildPostRequest(this.state.newPlayer);
            const res = await fetch('/api/new-player', payload);
            const resJson = res.json();
            return resJson;
        } else {
            alert('error: please enter a name!');
        }
    }

    /* Update new player input. */
    handlePlayer(event) {
        this.setState({
            newPlayer: event.target.value
        });
    }

    /* Nav to homepage. */
    routeToHome() {
        const path = "/";
        this.props.history.push(path);
    }

    render() {
        const playerList = (this.state.playerList||[]).map((name, index) =>
            <ul className="player-item" key={name}>
                <Player
                    name={name[0]}
                    score={this.state.playerList[index][1]}
                />

                <div>
                    <div className="adjust-score-char">
                        <button name="addPlayerScore" type="submit" className="math-button adjust-score-char" onClick={(event) => this.handleClickIndex(index, event)}>
                            &#9650;
                        </button>
                    </div>
                    <div className="adjust-score-char">
                        <button name="subtractPlayerScore" type="submit" className="math-button adjust-score-char" onClick={(event) => this.handleClickIndex(index, event)}>
                            &#9660;
                        </button>
                    </div>
                </div>

                <div className="delete-char">
                    <button name="removePlater" type="submit" className="math-button delete-char" onClick={(event) => {this.handleClickIndex(index, event)}}>
                        ×
                    </button>
                </div>
            </ul> 
        );

        return (
            <div>
                <h1 className="title"> scores </h1>
                <div className="scoreboard">
                    <div className="scoreboard-header name-header"> name </div>
                    <div className="scoreboard-header score-header"> score </div>
                    <div>
                        {playerList}
                    </div>
                </div>

                <div className="add-player">
                    <input
                        classname="player-name-input"
                        placeholder="new player name"
                        value={this.state.newPlayer}
                        onChange={this.handlePlayer}
                    />
                    <button className="math-button add-char" type="button" onClick={() => {this.postPlayer().then(() => this.updateScoreboard());}}>
                        +
                    </button>
                </div>

                <button className="h-button" onClick={ this.routeToHome }> home </button>
            </div>
        );
    }
 }

 export default Scores;