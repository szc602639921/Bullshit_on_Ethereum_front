import Abi from '../../../../streebog/build/contracts/Game.json';

class EthWrapper{

    constructor(address){
        var Web3 = require('web3');
        this.web3 = new Web3('ws://localhost:7545');
        console.log(Abi.abi);
        this.game = new this.web3.eth.Contract(Abi.abi, address);
        console.log("WEB3 loaded");
    }

    getAccounts(callback){
        this.web3.eth.getAccounts().then(callback);
    }

    getPlayers(roundName, callback){
        this.game.methods.getPlayers('test').call().then(callback);
    }

    isGameFull(roundName, callback){
        this.game.methods.isGameFull('test').call().then(callback);
    }
}


export default EthWrapper;