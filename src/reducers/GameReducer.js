import { Directions } from '../actions';
import Immutable, { Map, List } from 'immutable';
import { Suits, Ranks, Places, ActionTypes } from '../constants';
import range from 'lodash/range';
import shuffle from 'lodash/shuffle';
import first from 'lodash/first';
import flatten from 'lodash/flatten';

export const OrderedDeck = flatten(
    Object.keys(Suits).map(suit => Ranks.map(rank => ({ rank, suit })))
);

function getInitialState() {


    return Map({
        [Places.FOUNDATION]: Map({
            HEARTS: List(),
            SPADES: List(),
            DIAMONDS: List(),
            CLUBS: List()
        }),
        [Places.PILE]: getPiles(),
        [Places.DECK]: Map({
            upturned: List(),
            downturned: List()
        })
    });
}

function getPiles() {
    return List(range(0, 6).map(index => {
        return List()
    }));
}

function upturnFirstCard(cards) {
    return cards.map((card, index, pile) => {
        if (index === pile.size - 1) { return { ...card, upturned: true }; }
        else { return card; }
    });
}


function moveCards(state, action) {
    let { cards, where } = action.payload;
    let source = state.getIn(where.from)

    console.log('BEFORE',source, cards[0])
    const target = state.getIn(where.to).concat(cards);
    source = source.splice(source.indexOf(cards[0]), 1);
    console.log('AFTER', source)

    return state
        .updateIn(where.to, value => target)
        .updateIn(where.from, value => source);
}


export default function game(
    
    state = getInitialState(),
    action
) {
    switch (action.type) {
    case ActionTypes.MOVE_CARD:
        return moveCards(state, action);
    default:
        return state;
    }
}
