export const Suits = {
    SPADES: '♠',
    HEARTS: '♥',
    DIAMONDS: '♦',
    CLUBS: '♣'
};

export const Ranks =
    ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

export const RanksValues = {
    A: 1,
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
    7: 7,
    8: 8,
    9: 9,
    10: 10,
    J: 11,
    Q: 12,
    K: 13
};
export const ValuesRanks = {
    1: 'A',
    2: '2',
    3: '3',
    4: '4',
    5: '5',
    6: '6',
    7: '7',
    8: '8',
    9: '9',
    10: '10',
    11: 'J',
    12: 'Q',
    13: 'K'
};

export const Places = {
    FOUNDATION: 'FOUNDATION',
    PILE: 'PILE',
    DECK: 'DECK'
};

export const ActionTypes = {
    TURN_CARD: 'TURN_CARD',
    MOVE_CARD: 'MOVE_CARD'
};

export const mapCard = (card)=>{
    if (typeof card === 'object') {

      if (card.suit == 'SPADES') {
        return RanksValues[card.rank] + 0;
      }
      if (card.suit == 'HEARTS') {
        return RanksValues[card.rank] + 13;
      }
      if (card.suit == 'DIAMONDS') {
        return RanksValues[card.rank] + 26;
      }
      if (card.suit == 'CLUBS') {
        return RanksValues[card.rank] + 39;
      }

    } else {

      if (card <= 13) {
        return {rank: ValuesRanks[card] , suit: 'SPADES' };
      } else if (card <= 26) {
        return {rank: ValuesRanks[card - 13] , suit: 'HEARTS' };
      } else if (card <= 39) {
        return {rank: ValuesRanks[card - 26] , suit: 'DIAMONDS' };
      } else {
        return {rank: ValuesRanks[card - 39] , suit: 'CLUBS' };
      }

    }
  }
