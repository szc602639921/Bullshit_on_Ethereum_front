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
    return { game: state.game.toJS(), score: state.score} 
})

@DragDropContext(HTML5Backend)
class Game extends React.Component {

    constructor(props) {
        super(props);
        //console.log('Props are ',props);
    }

    moveCards = (cards, where, index) => {
        const { dispatch } = this.props;
        dispatch(ActionCreators.moveCard(cards, where, index));
    }

    render() {
        const { game, score } = this.props;
        const { moveCards, turnCard } = this;
        var stack = [];
        for(var i=1; i<6;i++){
            //game.PILE[i] = [new MyCard(""+(i+2), "HEARTS")];
            //console.log(new MyCard(""+(i+2), "HEARTS"));
        }

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
                        {this.props.myTurn ? (
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
