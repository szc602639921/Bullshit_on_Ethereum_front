import React from 'react';
import T from 'prop-types';
import Pile from '../display/Pile.jsx';
import { List } from 'immutable';
import Card from '../display/Card.jsx';
import { Suits, Ranks, Colors } from '../../constants';
import DraggableCard from './DraggableCard.jsx';
import { DropTarget } from 'react-dnd';
import last from 'lodash/last';

const pileTarget = {
    drop(props, monitor, component) {
        component.moveCards(monitor.getItem());
    },

    canDrop(props, monitor, component) {
        return false;
    }
};

function collect(connect, monitor) {
    return {
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
        suit: monitor.getItem() && monitor.getItem().suit
    };
};


@DropTarget('DraggableCard', pileTarget, collect)
class SmartPile extends React.Component {

    static propTypes = {
        cards: T.arrayOf(T.shape(
            {
                rank: T.oneOf(Ranks),
                suit: T.oneOf(Object.keys(Suits)),
            }
        ))
    }

    moveCards = (card) => {
        this.props.moveCards(
            [card],
            { from: card.where, to: ['PILE', this.props.index] }
        );
    }

    render() {
        const { cards } = this.props;
        const { connectDropTarget, canDrop, isOver, suit } = this.props;
        const renderedCards = cards.map((card, index, array) => {
                return (
                    <DraggableCard {...card}
                        isLast={index === array.length - 1}
                        index={index}
                        upturned
                        key={card.suit + card.rank}
                        where={['PILE', this.props.index]}
                    />
                );
        });
        return connectDropTarget(
            <div>
                <Pile isOver={isOver} canDrop={canDrop} color={Colors[suit]}>
                    {renderedCards}
                </Pile>
            </div>
        );
    }
}

export default SmartPile;
