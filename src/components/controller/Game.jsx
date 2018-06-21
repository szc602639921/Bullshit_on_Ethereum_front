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
import {mapCard} from '../../constants/Game'

function MyCard (rank, suit) {
    this.rank = rank;
    this.suit = suit;
    this.upturned = true;
}

@connect((state) => { 
    return { game: state.game.toJS(), score: state.score} 
})

@DragDropContext(HTML5Backend)
class Game extends React.Component {

    constructor(props) {
        super(props);
        //console.log('Props are ',props);
        this.piles = [[],[],[],[]];

    }

    splitCards(){
        var cards = this.props.cards;
        console.log(cards);
        if(cards==[]) return;

        //Remove '0' from cards
        for(var i = cards.length - 1; i >= 0; i--) {
            if(cards[i] === '0') {
                cards.splice(i, 1);
            }
        }
        console.log('Sorted array',cards);

        //now split between piles
        for(i=0;i<cards.length; i++){
            console.log(cards[i]);
            var c = mapCard(cards[i]);
            console.log('cur card',c);
            switch(c.suit){
                case 'SPADES':
                    this.piles[0].push(c);
                    break;
                case 'HEARTS':
                    this.piles[1].push(c);
                    break;
                case 'CLUBS':
                    this.piles[2].push(c);
                    break;
                case 'DIAMONDS':
                    this.piles[3].push(c);
                    break;
            }
        }
        console.log(this.piles[0]);
    }

    moveCards = (cards, where, index) => {
        const { dispatch } = this.props;
        dispatch(ActionCreators.moveCard(cards, where, index));
    }

    render() {
        const { game, score } = this.props;
        const { moveCards, turnCard } = this;
        this.splitCards();
        game.PILE[0] = this.piles[0];
        game.PILE[1] = this.piles[1];
        game.PILE[2] = this.piles[2];
        game.PILE[3] = this.piles[3];

        return (
            <div style={{
                width: Dimensions.Game.width,
                height: Dimensions.Game.height,
                padding: 10
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    width: '70%',
                    marginTop: 40
                }}> 
                    <div>    
                        <h2>Current Card</h2>
                        <Card
                            rank={"A"}
                            suit={"SPADES"}
                            upturned={true}
                        />
                     </div>
                        {this.props.myTurn && this.props.gameState == 2 ? (
                            <div>                      
                            <h2>It's your turn!</h2>
                            <SmartFoundation
                                suit="HEARTS"
                                cards={game.FOUNDATION.HEARTS}
                                moveCards={moveCards}
                            />
                            </div>
                            )
                            :
                            (
                                <h2>Waiting for {this.props.curPlayer}</h2>
                            )
                        }
                </div>
                <h2>Your Deck</h2>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    width: '70%',
                    marginTop: 40
                }}>
                {
                    range(0, 4).map(index =>
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
