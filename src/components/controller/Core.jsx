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
            cards: [],
            chosenAccount: '',
            gameName: '',
            curPlayer: 'others to join',
            myTurn: false,
            playerArray : [],
            curGameState : -1,
            curGameStateText: '',
            myPlayerId: -1,
            playerCount: 2
        };
        //bind callbacks
        this.setAccounts = this.setAccounts.bind(this);
        this.setMyAccount = this.setMyAccount.bind(this);
        this.setPlayerArray = this.setPlayerArray.bind(this);
        this.joinGame = this.joinGame.bind(this);
        this.update = this.update.bind(this);
        this.setGameState = this.setGameState.bind(this);
        this.setPlayerId = this.setPlayerId.bind(this);
        this.setCards = this.setCards.bind(this);

        //local variables
        this.dealtCards = false;
        this.retrievedCards = false;

        //Now pull accounts
        eth.getAccounts(this.setAccounts);

        //start game loop
        this.timer = setInterval(this.update, 1000);
    }

    update(){
        if(this.state.gameName === '') return;
        //Poll everything the game needs to know
        eth.getGameState(this.setGameState);
        //Poll player while joining
        if(this.state.curGameState <=2) eth.getPlayers(this.setPlayerArray);

        //Check if it has ended
        if(this.state.curGameState == 5){
            //Announce winner
            alert('WINNER IS '+this.state.curPlayer);
        }

        //Check if and what I have to do
        switch(this.state.curGameState){
            case '0':
                break;
            case '1':
                if(!this.state.myTurn) return;
                if(this.dealtCards) return;
                this.dealtCards = true;
                this.dealCards(this.state.playerCount);
                console.log('DEAL');
                break;
            case '2':
                if(!this.retrievedCards){
                    console.log('Retrieving my Cards!');
                    this.retrievedCards = true;
                    eth.getCards(this.setCards);                  
                }
                break;
            case '3':
                if(!this.state.myTurn) return;
                //submitNonce();
                console.log('LIE');
                break;
            case '4':
                console.log('REVEAL');
                break;
        }
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
    setPlayerId(myID){
        this.setState({
            playerId: myID,
          });
          //console.log('player id is ',myID);
    }
    setPlayerArray(players){
        this.setState({
            playerArray: players
          });   
          //console.log(players);   
    }
    //Pulls every important game information
    setGameState(gS){
        var myNewTurn = (this.state.playerArray[gS[0]] == eth.getAccount());
        if(gS[0]==5) gS[0]='other players';
        var gStext = this.getGameStateText(gS[1]);
        this.setState({
            curGameState: gS[1],
            curGameStateText: gStext,
            curPlayer: gS[0],
            myTurn: myNewTurn
          });   
        //console.log(gS);   
    }
    //sets your initial card deck
    setCards(newCards){
        this.setState({
            cards: newCards
          });   
        console.log('Retrieved cards',newCards);
    }

    /**
     * Gameplay functions
     */
    shuffle(a) {
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }
    dealCards(playerAmount){
        var deck = [];

        for (var i = 0; i < 52; i++) {
           deck.push(i);
        }

        deck = this.shuffle(deck)

        var cards = [[],[],[],[],[]];

        for (i = 0; deck.length > 0 ; (i = (i + 1) % playerAmount)) {
          cards[i].push(deck.pop())
        }

        for(i=0; i<5; i++){
            for (var j = 0; j < 52; j++) {
                console.log(cards[i][j])
                if(!cards[i][j]) cards[i][j]=0;
            }
        }

        console.log(cards);
        eth.dealCards(cards);
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
                return 'JOIN';
            case '1':
                return 'DEAL';
            case '2':
                return 'PLAY';
            case '4':
                return 'REVEAL';
            case '3':
                return 'LIE';
            case '5':
                return 'END';
        }
    }


    render(){
        return(
            <div>
            <div className={styles.left} id='game'>
              <Game
                myTurn = {this.state.myTurn}
                curPlayer = {this.state.curPlayer}
                cards = {this.state.cards}
              />
            </div>
            <div className={styles.right} id='info'>
              <Info
                curPlayer = {this.state.curPlayer}
                gameName = {this.state.gameName}
                playerArray = {this.state.playerArray}
                curGameState = {this.state.curGameStateText}
                accounts = {this.state.accounts}
                callback = {this.joinGame}
                callbackAcc = {this.setMyAccount}
                myAdress = {eth.getAccount()}
              />
            </div>
            </div>
        )
    }
}

export {Core as default}