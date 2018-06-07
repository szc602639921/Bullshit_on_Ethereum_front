import Abi from '../../../../streebog/build/contracts/Game.json';

class EthWrapper{

    constructor(){
        var Web3 = require('web3');
        console.log("what is web3 right now: " + window.web3);
        // Is there an injected web3 instance?
        if (typeof web3 !== 'undefined') {
            this.web3 = new Web3(web3.currentProvider);
        } else {
            // If no injected web3 instance is detected, fall back to Ganache
            this.web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));
        }        

        //this is the contract adress
        var addr = '0x64364303fa61579a77bc1e74c63cf0c63a2c7674';
        this.game = new this.web3.eth.Contract(Abi.abi, addr);
        this.getAccounts(function(accounts){
            EthWrapper.account = accounts[0];
            console.log(EthWrapper.account);
        });
    }

    getAccounts(callback){
        this.web3.eth.getAccounts().then(callback);
    }

    getPlayers(gameName, callback){
        this.game.methods.getPlayers(gameName).call().then(callback);
    }

    isGameFull(gameName, callback){
        this.game.methods.isGameFull(gameName).call().then(callback);
    }

    joinGame(gameName, callback){
        console.log("Joining game "+gameName+' with account '+EthWrapper.account);
        this.game.methods.join(gameName, 3).send({from:EthWrapper.account, gas:3000000}).then(callback);
    }
}

EthWrapper.account = '0x0';

export default EthWrapper;