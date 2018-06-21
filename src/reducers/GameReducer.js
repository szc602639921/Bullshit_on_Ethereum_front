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

//this handles moving from pile to foundation
//and removing from pile
//so i reworked it to remove the right card
function moveCards(state, action) {
    let { cards, where, index } = action.payload;
    let source = state.getIn(where.from)

    const target = state.getIn(where.to).concat(cards);
    console.log('Index is:'+index);
    source = source.remove(index);

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
