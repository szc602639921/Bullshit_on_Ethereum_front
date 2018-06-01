import ReactDOM from 'react-dom';
import React from 'react';
import Game from './components/controller/Game.jsx';
import Card from './components/display/Card.jsx';
import { Suits, Ranks } from './constants';
import Deck from './components/display/Deck.jsx';
import Pile from './components/display/Pile.jsx';
import Foundation from './components/display/Foundation.jsx';
import { Provider } from 'react-redux';
import { compose, createStore } from 'redux';
import reducers from './reducers';
import { createDevTools, persistState } from 'redux-devtools';
import DockMonitor from 'redux-devtools-dock-monitor';
import SliderMonitor from 'redux-slider-monitor';

let cards = [];
Object.keys(Suits).forEach(suit => {
    Ranks.forEach(rank => {
        cards.push({ rank, suit })
    })
});

const finalCreateStore = compose(
    persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/))
)(createStore);
const store = finalCreateStore(reducers);

ReactDOM.render(
    <div>
        <Provider store={store}>
            <Game />
        </Provider>
    </div>,
    document.getElementById('game')
);

