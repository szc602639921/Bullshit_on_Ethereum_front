import Abi from '../../../../streebog/build/contracts/Game.json';

class EthWrapper{

    getAccounts(callback){
        EthWrapper.web3.eth.getAccounts().then(callback);
    }

    getCurrentPlayers(gameName, callback){
        EthWrapper.gameContract.methods.getPlayers(gameName).call().then(callback);
    }

    getDealer(gameName, callback){
        EthWrapper.gameContract.methods.getDealer(gameName).call().then(callback);
    }

    playCard(gameName, cardHash, callback){
        EthWrapper.gameContract.methods.playCard(gameName, cardHash).call().then(callback);
    }

    claimLie(gameName, callback){
        EthWrapper.gameContract.methods.claimLie(gameName).call().then(callback);
    }
    
    dealCards(gameName, cards, callback){
        EthWrapper.gameContract.methods.dealCards(gameName, cards).call().then(callback);
    }

    getCards(gameName, callback){
        EthWrapper.gameContract.methods.getCards(gameName).call().then(callback);
    }

    retrieveNonces(gameName, nonce, callback){
        EthWrapper.gameContract.methods.retrieveNonces(gameName, nonce).call().then(callback);
    }

    isGameFull(gameName, callback){
        EthWrapper.gameContract.methods.isGameFull(gameName).call().then(callback);
    }

    joinGame(gameName, callback){
        console.log("Joining game "+gameName+' with account '+EthWrapper.account);
        EthWrapper.gameContract.methods.join(gameName, 3).send({from:EthWrapper.account, gas:3000000}).then(callback);
    }
}

//static variables
EthWrapper.account = '0x0';

//Initialize WEB3
var Web3 = require('web3');
// Is there an injected web3 instance?
if (typeof web3 !== 'undefined') {
    EthWrapper.web3 = new Web3(web3.currentProvider);
} else {
    // If no injected web3 instance is detected, fall back to Ganache
    EthWrapper.web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));
}        

//this is the contract adress
var addr = '0x64364303fa61579a77bc1e74c63cf0c63a2c7674';
EthWrapper.gameContract = new EthWrapper.web3.eth.Contract(Abi.abi, addr);

var e = new EthWrapper();
e.getAccounts(function(accounts){
    EthWrapper.account = accounts[0];
    console.log(EthWrapper.account);
});

export default EthWrapper;