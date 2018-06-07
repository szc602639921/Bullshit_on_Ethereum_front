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

function setEthAcc(newaccounts){
    var p = document.createElement('p')
    p.innerHTML = "Players "+newaccounts
    document.body.appendChild(p)
}

function setIsFull(isFull){
    var p = document.createElement('p')
    p.innerHTML = "Is Full: "+isFull
    document.body.appendChild(p)
}

@connect((state) => {
    eth = new EthWrapper();
    if(!eth) console.log("Could not establish web3 connection!");
    eth.getPlayers("test", setEthAcc);
    return new Object();
})

//WEB STUFF

@DragDropContext(HTML5Backend)
class Info extends React.Component {

    constructor(props) {
        super(props);
        this.state = {value: '', submit: false};

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({value: event.target.value});
      }

    handleSubmit(event) {
        event.preventDefault();
        eth.joinGame(this.state.value, console.log);
        this.setState({submit: true});
      }
    
    render() {
        //already joined a game
        if(!this.state.submit){
            return (
                <div>
                <h2>Controls:</h2>
                Join a Game!
                    <br/>
                    <br/>
                <form onSubmit={this.handleSubmit}>
                    <label>
                        GameName:
                        <input type="text" name={this.state.value} onChange={this.handleChange}/>
                    </label>
                    <input type="submit" value="Join"/>
                </form>
                <h2>Info:</h2>
                </div>
            );
        }
        
        else{
            return (
                <div>
                <h2>Controls:</h2>
                Gamestate: Waiting for other Players
                <br/>
                <br/>
                <label>
                GameName: {this.state.value}
                <br/>
                Players: 
                </label>

                <h2>Info:</h2>
                </div>
            );
        }

    }
}

export default Info;
