import React from 'react';
import T from 'prop-types';
import Foundation from '../display/Foundation.jsx';
import ActionCreators, { Directions } from '../../actions';
import DraggableCard from './DraggableCard.jsx';
import first from 'lodash/first';
import { Suits } from '../../constants';
import { DropTarget } from 'react-dnd';
import EthWrapper from './EthWrapper.jsx';

const foundationTarget = {
    drop(props, monitor, component) {
        component.moveCards(monitor.getItem());
    },

    canDrop(props, monitor, component) {
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

    //works on the move event to the foundation
    moveCards = (card) => {
        this.props.moveCards(
            [card],
            { from: card.where, to: ['FOUNDATION', this.props.suit] },
            card.index
        );
        console.log("Dropped card "+card.rank);
        //card was dropped, now send it to the blockchain
        var ethWrapper = new EthWrapper();
        ethWrapper.playCard(33, console.log);
        //ethWrapper.takeCardsOnTable(console.log);
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
