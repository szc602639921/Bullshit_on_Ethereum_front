import React from 'react';
import SmartPile from  './SmartPile.jsx';
import SmartFoundation from './SmartFoundation.jsx';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import range from 'lodash/range';
import { connect } from 'react-redux';
import ActionCreators from '../../actions';
import { Colors, Dimensions } from '../../constants';
import Card from '../display/Card.jsx';

function MyCard (rank, suit) {
    this.rank = rank;
    this.suit = suit;
    this.upturned = true;
}

@connect((state) => { 
    var Web3 = require('web3');

    var web3 = new Web3('ws://localhost:7545');
    console.log(web3)
    console.log("WEB3 loaded");
    web3.eth.getAccounts().then(console.log);

    return { game: state.game.toJS(), score: state.score } 
})

@DragDropContext(HTML5Backend)
class Game extends React.Component {

    turnCard = () => {
        const { dispatch } = this.props;
        dispatch(ActionCreators.turnCard());
    }

    moveCards = (cards, where) => {
        const { dispatch } = this.props;
        dispatch(ActionCreators.moveCard(cards, where));
    }

    render() {
        const { game, score } = this.props;
        const { moveCards, turnCard } = this;
        var stack = [];
        for(var i=1; i<6;i++){
            game.PILE[i] = [new MyCard(""+(i+2), "HEARTS")];
        }

        return (
            <div style={{
                width: Dimensions.Game.width,
                height: Dimensions.Game.height,
                backgroundColor: Colors.Game.backgroundColor,
                padding: 10
            }}>
                <div style={{display: 'flex', justifyContent: 'space-between'}}>

                        <Card
                            rank={"A"}
                            suit={"SPADES"}
                            upturned={true}
                        />

                        <SmartFoundation
                            suit="HEARTS"
                            cards={game.FOUNDATION.HEARTS}
                            moveCards={moveCards}
                        />
                        
                </div>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    width: '100%',
                    marginTop: 40
                }}>
                {
                    range(1, 6).map(index =>
                        <SmartPile
                            cards={game.PILE[index]}
                            index={index}
                            key={index}
                            moveCards={moveCards}
                        />
                    )
                }
                </div>
                
            </div>
        );
    }
}

export default Game;
