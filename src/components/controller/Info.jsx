import React from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import range from 'lodash/range';
import { connect } from 'react-redux';
import ActionCreators from '../../actions';
import { Colors, Dimensions, Abi } from '../../constants';
import Card from '../display/Card.jsx';
import EthWrapper from './EthWrapper.jsx';

//web3 control
var eth;

@connect((state) => {
    eth = new EthWrapper();
    if(!eth) console.log("Could not establish web3 connection!");
    return new Object();
})

//Info Class that controls ethwrapper and game components
@DragDropContext(HTML5Backend)
class Info extends React.Component {

    constructor(props) {
        super(props);
        //use states so site refreshes on state change
        this.state = {
            //game control instances
            joinedGame: false,
            players: '',
            isFull: false,
            gameName: ''
        };
        //bind to pass this
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.isSubmit = this.isSubmit.bind(this);
        this.isFull = this.isFull.bind(this);
        this.setPlayers = this.setPlayers.bind(this);
        this.poll = this.poll.bind(this);
        //start timer
        this.timer = setInterval(this.poll, 500);
    }

    setPlayers(newaccounts){
        this.setState({
            players: newaccounts
          });
    }

    isFull(stateFull){
        if(stateFull == this.state.isFull) return;
        this.setState({
            isFull: stateFull
          });
    }

    isSubmit(){
        this.setState({
            joinedGame: true
          });
        console.log("Joined Game succesfully");
    }

    poll(){
        if(this.state.joinedGame){
            console.log("I am polling!");
            eth.isGameFull(this.state.gameName, this.setIsFull);
            eth.getCurrentPlayers(this.state.gameName, this.setPlayers);
        }      
    }

    handleChange(event) {
        //this triggers a state change with rendering afterwards
        this.setState({
            gameName: event.target.value
          });
    }

    handleSubmit(event) {
        //join game
        eth.joinGame(this.state.gameName, this.isSubmit); 
        //prevent refresh
        event.preventDefault();
    }

    
    render() {
        //already joined a game
        if(!this.state.joinedGame){
            return (
                <div>
                <h2>Controls:</h2>
                Join a Game!
                    <br/>
                    <br/>
                <form onSubmit={this.handleSubmit}>
                    <label>
                        <input type="text" name={this.state.gameName} onChange={this.handleChange}/>
                    </label>
                    <input type="submit" value="Join"/>
                </form>
                <h2>Info:</h2>
                </div>
            );
        }
        else{
            return (
                <div>
                <h2>Info:</h2>
                Gamestate: Waiting for other Players
                <br/>
                <label>
                Game Name: {this.state.gameName}
                <br/>
                Game Full: {this.state.isFull}
                <br/>
                Players: 
                <br/>
                {this.state.players[0]}
                <br/>
                {this.state.players[1]}
                <br/>
                {this.state.players[2]}
                <br/>
                {this.state.players[3]}
                <br/>
                {this.state.players[4]}
                </label>
                </div>
            );
        }

    }
}

export default Info;
