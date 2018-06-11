import React from 'react';
import T from 'prop-types';
import Foundation from '../display/Foundation.jsx';
import ActionCreators, { Directions } from '../../actions';
import DraggableCard from './DraggableCard.jsx';
import first from 'lodash/first';
import { Suits } from '../../constants';
import { DropTarget } from 'react-dnd';

const foundationTarget = {
    drop(props, monitor, component) {
        component.moveCards(monitor.getItem());
    },

    canDrop(props, monitor, component) {
        //const { suit, rank } = monitor.getItem();
        //const firstCard = first(props.cards);
        //return suit === props.suit && firstCard === undefined && rank === 'A';
        return true;
    }
};

function collect(connect, monitor) {
    return {
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop()
    };
};


@DropTarget('DraggableCard', foundationTarget, collect)
export default class SmartFoundation extends React.Component {
    static propTypes = {
        cards: T.array,
        suit: T.oneOf(Object.keys(Suits))
    }

    moveCards = (card) => {
        this.props.moveCards(
            [card],
            { from: card.where, to: ['FOUNDATION', this.props.suit] },
            card.index
        );
    }

    render() {
        const { connectDropTarget, isOver, suit, cards, canDrop } = this.props;
        const card = cards.length ?
            <DraggableCard {...cards[cards.length - 1]}
                upturned where={['FOUNDATION', suit]}
            /> :
            null;
        return connectDropTarget(
            <div>
                <Foundation
                    {...this.props}
                    isOver={isOver}
                    canDrop={canDrop}
                >
                    {card}
                </Foundation>
            </div>
        );
    }
}
