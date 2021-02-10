import React, { Component } from 'react';
import './Scores.css';

class Player extends Component {
    render() {
        return (
            <div className="player">
                <div className="player-list-name">{this.props.name}</div>
                <div className="player-list-score">{this.props.score}</div>
            </div>
        );
    }
}

export default Player;