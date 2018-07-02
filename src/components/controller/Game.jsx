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


function MyCard(rank, suit) {
    this.rank = rank;
    this.suit = suit;
    this.upturned = true;
}

@connect((state) => {
    return {
        game: state.game.toJS(),
        score: state.score
    }
})

@DragDropContext(HTML5Backend)
class Game extends React.Component {

        constructor(props) {
            super(props);
            //console.log('Props are ',props);
            this.piles = [
                [],
                [],
                [],
                []
            ];
            this.gamePile = []
            this.cardIteration = 0

            //bind callback
            this.handleClick = this.handleClick.bind(this);
        }

        checkCards(game) {
            //console.log(game.PILE);
            if (this.cardIteration === this.props.cardIteration) {
                //console.log('No new Cards')
                return;
            }
            this.cardIteration = this.props.cardIteration
            console.log('Received new card iteration')

            this.gamePile = this.props.cards;
            console.log(this.gamePile);

            // Safety check
            if (this.gamePile == []) return;

            // Remove '0' from cards
            for (var i = this.gamePile.length - 1; i >= 0; i--) {
                if (this.gamePile[i] === '0') {
                    this.gamePile.splice(i, 1);
                }
            }
            console.log('Sorted array', this.gamePile);

            // Now split between piles
            for (i = 0; i < this.gamePile.length; i++) {
                console.log(this.gamePile[i]);
                var c = mapCard(this.gamePile[i]);
                console.log('cur card', c);
                switch (c.suit) {
                    case 'SPADES':
                        this.moveCardToPile(c, 0);
                        break;
                    case 'HEARTS':
                        this.moveCardToPile(c, 1);
                        break;
                    case 'CLUBS':
                        this.moveCardToPile(c, 2);
                        break;
                    case 'DIAMONDS':
                        this.moveCardToPile(c, 3);
                        break;
                }
            }
            console.log(game.PILE);
            return true;
        }

        moveCardToPile = (card, where) => {
            const {
                dispatch
            } = this.props;
            dispatch(
                ActionCreators.moveCard(
                    [card],
                    { from: ['PILE', 5], to: ['PILE', where] }
                )
            );
        }

        moveCards = (cards, where) => {
            const { dispatch } = this.props;
            dispatch(ActionCreators.moveCard(cards, where));
        }

    handleClick() {
        console.log('The link was clicked.')
        this.props.lieCallback()
    }

    render() {
        const { game, score } = this.props;
        const { moveCards, turnCard } = this;
        this.checkCards(game);

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
                        {this.props.curOpenCard != undefined ? (
                            <div>                      
                            <h2>Current Card</h2>
                            <Card
                            rank={this.props.curOpenCard.rank}
                            suit={this.props.curOpenCard.suit}
                            upturned={true}
                            />
                            </div>
                            )
                            :
                            (
                                <h2>Currently no open card</h2>
                            )
                        }
                    </div>

                    <div>
                        {this.props.myTurn && this.props.curGameState == 2 ? (
                            <div>                      
                            <h2>It's your turn!</h2>
                            <SmartFoundation
                                suit="HEARTS"
                                cards={game.FOUNDATION.HEARTS}
                                moveCards={moveCards}
                            />
                            <div>
                                <br/>
                                <button onClick={this.handleClick}> -----   It's a LIE!   ----- </button> 
                            </div>
                            </div>
                            )
                            :
                            (
                                <h2>Waiting for {this.props.curPlayer}</h2>
                            )
                        }
                </div>
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
