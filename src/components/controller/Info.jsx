import React from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import range from 'lodash/range';
import { connect } from 'react-redux';
import ActionCreators from '../../actions';
import { Colors, Dimensions, Abi } from '../../constants';
import Card from '../display/Card.jsx';
import EthWrapper from './EthWrapper.jsx'

var eth;
var addr = '0xacff25e14242b978756e72dace32f237a05ff977';

function setEthAcc(newaccounts){
    var p = document.createElement('p')
    p.innerHTML = "Accounts: "+newaccounts
    document.body.appendChild(p)
}

function setIsFull(isFull){
    var p = document.createElement('p')
    p.innerHTML = "Is Full: "+isFull
    document.body.appendChild(p)
}

@connect((state) => {
    eth = new EthWrapper(addr);
    eth.getPlayers("test", setEthAcc);
    eth.isGameFull("test", setIsFull);
    return new Object();
})

@DragDropContext(HTML5Backend)
class Info extends React.Component {

    
    render() {
        eth.isGameFull("test", setIsFull);
        return (
            <h2>Info:</h2>
        );
    }
}

export default Info;
