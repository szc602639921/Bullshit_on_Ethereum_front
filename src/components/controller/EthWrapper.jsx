import Abi from '../../../../streebog/build/contracts/Game.json';

class EthWrapper{

    getAccounts(callback){
        EthWrapper.web3.eth.getAccounts().then(callback);
    }

    getCurrentPlayers(callback){
        EthWrapper.gameContract.methods.getPlayers(EthWrapper.GameName).call().then(callback);
    }

    getDealer(callback){
        EthWrapper.gameContract.methods.getDealer(EthWrapper.GameName).call().then(callback);
    }

    playCard(cardHash, callback){
        EthWrapper.gameContract.methods.playCard(EthWrapper.GameName, cardHash).send({from:EthWrapper.account, gas:3000000});
    }

    claimLie(callback){
        EthWrapper.gameContract.methods.claimLie(EthWrapper.GameName).call().then(callback);
    }
    
    dealCards(cards, callback){
        EthWrapper.gameContract.methods.dealCards(EthWrapper.GameName, cards).send({from:EthWrapper.account, gas:3000000}).then(callback);
    }

    getCards(callback){
        EthWrapper.gameContract.methods.getCards(EthWrapper.GameName).call().then(callback);
    }

    retrieveNonces(nonce, callback){
        EthWrapper.gameContract.methods.retrieveNonces(EthWrapper.GameName, nonce).call().then(callback);
    }

    isGameFull(callback){
        EthWrapper.gameContract.methods.isGameFull(EthWrapper.GameName).call().then(callback);
    }

    joinGame(gameName, callback){
        EthWrapper.GameName = gameName;
        console.log("Joining game "+EthWrapper.GameName+' with account '+EthWrapper.account);
        EthWrapper.gameContract.methods.join(EthWrapper.GameName, 2).send({from:EthWrapper.account, gas:3000000}).then(callback);
    }

    takeCardsOnTable(callback){
        EthWrapper.gameContract.methods.takeCardsOnTable(EthWrapper.GameName).send({from:EthWrapper.account, gas:3000000}).then(callback);
    }
}

//static variables
EthWrapper.account = '0x0';
EthWrapper.GameName = 'test';

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