import 'babel-polyfill';
import ReactDOM from 'react-dom';
import React from 'react';
import Core from './components/controller/Core.jsx';
import { Suits, Ranks } from './constants';
import { Provider } from 'react-redux';
import { compose, createStore } from 'redux';
import reducers from './reducers';
import { createDevTools, persistState } from 'redux-devtools';

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
            <Core />
        </Provider>
    </div>,
    document.getElementById('root')
);
