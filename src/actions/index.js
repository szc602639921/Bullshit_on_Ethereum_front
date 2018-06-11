import { ActionTypes } from '../constants';

export function moveCard(cards, where, index) {
    return {
        type: ActionTypes.MOVE_CARD,
        payload: { cards, where, index }
     };
}

export function turnCard() {
    return {
        type: ActionTypes.TURN_CARD
    };
}

export function shuffleDeck() {
    return { type: 'SHUFFLE_DECK' }
}

export default {
    moveCard,
    turnCard,
    shuffleDeck
}
