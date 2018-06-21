import React from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import Game from './Game.jsx';
import Info from './Info.jsx';
import { connect } from 'react-redux';
import EthWrapper from './EthWrapper.jsx';
import styles from './Core.css';

//web3 control
var eth;

@connect(() => {
    eth = new EthWrapper();
    return new Object();
})

//Info Class that controls ethwrapper and game components
@DragDropContext(HTML5Backend)
class Core extends React.Component {

    constructor(props){
        super(props);
        //use states so site refreshes on state change
        this.state = {
            //Game Statics
            accounts: [],
            chosenAccount: '',
            gameName: "",
            curPlayer: "to join",
            myTurn : false,
            playerArray : [],
            curGameState : -1,
            curGameStateText: ''
        };
        //bind callbacks
        this.setAccounts = this.setAccounts.bind(this);
        this.setMyAccount = this.setMyAccount.bind(this);
        this.setPlayers = this.setPlayers.bind(this);
        this.setPlayer = this.setPlayer.bind(this);
        this.joinGame = this.joinGame.bind(this);
        this.update = this.update.bind(this);
        this.setGameState = this.setGameState.bind(this);

        //Now pull accounts
        eth.getAccounts(this.setAccounts);

        //start game loop
        this.timer = setInterval(this.update, 1000);
    }

    update(){
        //Poll everything the game needs to know
        eth.getGameState(this.setGameState);
        eth.getPlayers(this.setPlayers);
        eth.getCurrentPlayer(this.setPlayer);

        //Check if it has ended
        if(this.state.curGameState == 5){
            //Announce winner
            console.log("WINNER IS "+curPLayer);
        }

        //Check if i need to do sth, else return

        //It is my turn, check state

    }
    
    /**
     * Set state functions
     */
    joinGame(gName, callback){
        this.setState({
            gameName: gName,
          });
        eth.joinGame(gName);
        console.log('Joining game',this.state.gameName);
        callback();
    }
    setPlayers(players){
        this.setState({
            playerArray: players
          });   
          //console.log(players);   
    }
    setPlayer(player){
        var myNewTurn = (this.state.playerArray[player] == eth.getAccount());
        this.setState({
            curPlayer: player,
            myTurn: myNewTurn
          });
    }
    setGameState(gS){
        var gStext = this.getGameStateText(gS);
        this.setState({
            curGameState: gS,
            curGameStateText: gStext
          });   
          console.log(gS);   
    }
    

    /**
     * Sets account that are used for connecting to blockchain
     * @param {} newAcc 
     */
    setAccounts(newAcc){
        this.setState({
            accounts: newAcc
          });
    }
    setMyAccount(newAcc){
        this.setState({
            chosenAccount: newAcc
          });
          eth.setAccount(newAcc);
    }

    /**
     * Returns gamestate from int
     */
    getGameStateText(gS){
        switch(gS){
            case '0':
                return "JOIN";
            case '4':
                return "REVEAL";
            case '2':
                return "PLAY";
            case '1':
                return "DEAL";
            case '3':
                return "LIE";
            case '5':
                return "END";
        }
    }


    render(){
        return(
            <div>
            <div className={styles.left} id="game">
              <Game
                myTurn = {this.state.myTurn}
                curPlayer = {this.state.curPlayer}
              />
            </div>
            <div className={styles.right} id="info">
              <Info
                curPlayer = {this.state.curPlayer}
                gameName = {this.state.gameName}
                playerArray = {this.state.playerArray}
                curGameState = {this.state.curGameStateText}
                accounts = {this.state.accounts}
                callback = {this.joinGame}
                callbackAcc = {this.setMyAccount}
              />
            </div>
            </div>
        )
    }
}

export {Core as default}