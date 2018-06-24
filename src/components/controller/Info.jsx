import React from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import range from 'lodash/range';
import { connect } from 'react-redux';
import EthWrapper from './EthWrapper.jsx';
import Dropdown from './Dropdown.jsx';
import Game from './Game.jsx';

//web3 control
var eth, gameLogic;


@connect((state) => {
    eth = new EthWrapper();
    return new Object();
})

//Info Class that controls ethwrapper and game components
@DragDropContext(HTML5Backend)
class Info extends React.Component {

    constructor(props) {
        super(props);
        console.log(props);
        //use states so site refreshes on state change
        this.state = {
            joinedGame: false,
        };
        //bind to pass this
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.isSubmit = this.isSubmit.bind(this);        
    }

    isSubmit(){
        this.setState({
            joinedGame: true
          });
        console.log('Joined Game succesfully');
    }

    handleChange(event) {
        //this triggers a state change with rendering afterwards
        this.setState({
            gameName: event.target.value
          });

    }

    handleSubmit(event) {
        //prevent refresh
        event.preventDefault();
        //join game
        this.props.callback(this.state.gameName, this.isSubmit); 
    }

    
    render() {
        //already joined a game
        if(!this.state.joinedGame){
            return (
                <div>
                    <h2>Join a game!</h2>
                    <Dropdown
                        name={this.props.accounts[0]}
                        list={this.props.accounts}
                        callback={this.props.callbackAcc}
                    />
                    <form onSubmit={this.handleSubmit}>
                        <label>
                            <input type="text" name={this.state.gameName} onChange={this.handleChange} />
                        </label>
                        <input type="submit" value="Join" />
                    </form>
                </div>
            );
        }
        else{
            return (
                <div>
                <h2>Info:</h2>
                <label>
                Game Name: {this.props.gameName}
                <br/>
                Your Address: {this.props.myAdress}
                <br/>
                Gamestate:{this.props.curGameState}
                <br/>
                Current Player: {this.props.curPlayer}
                <br/>
                <br/>
                Players: 
                <label/>

                <br/>
                {this.props.playerArray[0]!=0 ? (<div>0. {this.props.playerArray[0]}</div>):(<div></div>)}
                {this.props.playerArray[1]!=0 ? (<div>1. {this.props.playerArray[1]}</div>):(<div></div>)}
                {this.props.playerArray[2]!=0 ? (<div>2. {this.props.playerArray[2]}</div>):(<div></div>)}
                {this.props.playerArray[3]!=0 ? (<div>3. {this.props.playerArray[3]}</div>):(<div></div>)}
                {this.props.playerArray[4]!=0 ? (<div>4. {this.props.playerArray[4]}</div>):(<div></div>)}
                </label>
                </div>
            );
        }

    }
}

export default Info;
