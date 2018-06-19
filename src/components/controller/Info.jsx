import React from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import range from 'lodash/range';
import { connect } from 'react-redux';
import ActionCreators from '../../actions';
import { Colors, Dimensions, Abi } from '../../constants';
import Card from '../display/Card.jsx';
import EthWrapper from './EthWrapper.jsx';
import Dropdown from './Dropdown.jsx';
import GameLogic from './GameLogic';

//web3 control
var eth, gameLogic;


@connect((state) => {
    eth = new EthWrapper();
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
            gameName: '',
            accounts: [],
            chosenAccount: '',
            gameState: '',
            curPlayer: '-1',
        };
        //bind to pass this
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.isSubmit = this.isSubmit.bind(this);
        this.isFull = this.isFull.bind(this);
        this.setPlayers = this.setPlayers.bind(this);
        this.setAccounts = this.setAccounts.bind(this);
        this.poll = this.poll.bind(this);
        //start timer
        this.timer = setInterval(this.poll, 1000);

        eth.getAccounts(this.setAccounts);
    }

    setAccounts(newaccounts){
        this.setState({
            accounts: newaccounts,
            chosenAccount: newaccounts[0]
        });
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
        gameLogic = new GameLogic(eth);
        console.log("Joined Game succesfully");
    }

    poll(){
        if(this.state.joinedGame){
            //console.log("I am polling!");
            eth.isGameFull(this.setIsFull);
            eth.getPlayers(this.setPlayers);

            var g = gameLogic.getGameState();
            var p = gameLogic.getPlayer();
            console.log('Gamestate is',g); 
            console.log('Curplayer is',p);  
            this.setState({
                gameState: g,
                curPlayer: p
              });
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
                    <h2>Join a game!</h2>
                    <Dropdown
                        name={this.state.chosenAccount}
                        list={this.state.accounts}
                        callback={eth.setAccount}
                    />
                    <form onSubmit={this.handleSubmit}>
                        <label>
                            <input type="text" name={this.state.gameName} onChange={this.handleChange} />
                        </label>
                        <input type="submit" value="Join" />
                    </form>
                </div>
            );
        }
        else{
            return (
                <div>
                <h2>Info:</h2>
                <label>
                Game Name: {this.state.gameName}
                <br/>
                Gamestate:{this.state.gameState}
                <br/>
                Current Player: {this.state.curPlayer}
                <br/>
                Players: 
                <label/>
                
                <br/>

                <br/>
                0. {this.state.players[0]}
                <br/>
                1. {this.state.players[1]}
                <br/>
                2. {this.state.players[2]}
                <br/>
                3. {this.state.players[3]}
                <br/>
                4. {this.state.players[4]}
                </label>
                </div>
            );
        }

    }
}

export default Info;
