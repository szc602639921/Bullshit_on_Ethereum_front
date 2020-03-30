import Abi from '../../../../streebog/build/contracts/Game.json';


//Encryption stuff
var openpgp = require('openpgp'); // use as CommonJS, AMD, ES6 module or via window.openpgp
//openpgp.initWorker({ path:'openpgp.worker.js' })

var privkey, pubkey

var options = {
    userIds: [{ name:'Jon Smith', email:'jon@example.com' }], // multiple user IDs
    curve: 'curve25519',                                         // ECC curve name
    passphrase: ''
};

openpgp.generateKey(options).then(function(key) {
    privkey = key.privateKeyArmored; // '-----BEGIN PGP PRIVATE KEY BLOCK ... '
    pubkey = key.publicKeyArmored;   // '-----BEGIN PGP PUBLIC KEY BLOCK ... '

    alert(privkey, pubkey)
});

async function encrypt(pkey, data){
    console.log('key', pkey)
    var options = {
        data: JSON.stringify(data),                             // input as String (or Uint8Array)
        publicKeys: openpgp.key.readArmored(pkey).keys  // for encryption
    }
    return await openpgp.encrypt(options).then(ciphertext => {
        var encrypted = ciphertext.data // '-----BEGIN PGP MESSAGE ... END PGP MESSAGE-----'
        console.log('ENC',encrypted)
        return encrypted
    })
}

async function decrypt(enc){
    console.log(enc)
    var options = {
        message: openpgp.message.readArmored(enc),     // parse armored message
        privateKeys: openpgp.key.readArmored(privkey).keys    // for verification (optional)
    }
    return await openpgp.decrypt(options).then(plaintext => {
        console.log('DEC', plaintext.data)
        return plaintext.data
    })
}


class EthWrapper{

    async getAccounts(callback){
       // EthWrapper.web3.eth.getAccounts().then(callback);
       EthWrapper.web3.eth.getAccounts().then(callback);
    }

    getPlayers(callback){
        EthWrapper.gameContract.methods.getPlayers(EthWrapper.GameName).call().then(callback);
    }

    getCurrentPlayer(callback){
        EthWrapper.gameContract.methods.getCurrentPlayer(EthWrapper.GameName).call().then(callback);
    }

    getDealer(callback){
        EthWrapper.gameContract.methods.getDealer(EthWrapper.GameName).call().then(callback);
    }

    playCard(cardHash){
        EthWrapper.gameContract.methods.playCard(EthWrapper.GameName, cardHash).send({from:EthWrapper.account, gas:3000000});
    }

    claimLie(callback){
        EthWrapper.gameContract.methods.claimLie(EthWrapper.GameName).send({from:EthWrapper.account, gas:3000000});
    }

    async dealCards(cards){
        var pubkeyArray = []

        console.log('getting pubkeys')
        for(var j=0; j<5; j++){
            var key = await EthWrapper.gameContract.methods.getPubkeys(EthWrapper.GameName, j).call()
            if(key!=='0') pubkeyArray.push(key)
        }

        console.log('Array',pubkeyArray)

        for(var i = 0; i<pubkeyArray.length; i++){
            console.log('Submitting',pubkeyArray[i])
            var cardUpload = await encrypt(pubkeyArray[i], cards[i])
            EthWrapper.gameContract.methods.dealCards(EthWrapper.GameName, cardUpload, i).send({from:EthWrapper.account, gas:3000000});
        }
    }

    retrieveNonces(nonce, callback){
        EthWrapper.gameContract.methods.retrieveNonces(EthWrapper.GameName, nonce).call().then(callback);
    }

    isGameFull(callback){
        EthWrapper.gameContract.methods.isGameFull(EthWrapper.GameName).call().then(callback);
    }

    async joinGame(gameName, playerCount, callback){
        EthWrapper.GameName = gameName;
        console.log('Joining game '+EthWrapper.GameName+' with account '+EthWrapper.account);

        EthWrapper.gameContract.methods.join(EthWrapper.GameName, playerCount, pubkey).send({from:EthWrapper.account, gas:3000000}).then(callback);
        window.addEventListener('load', async () => {
            try {
                     await ethereum.enable();
                   } catch (error) {
                       console.log(error.message);
                   }
            });
    }

    takeCardsOnTable(callback){
        EthWrapper.gameContract.once('CardsAvailable',callback);
        EthWrapper.gameContract.methods.takeCardsOnTable(EthWrapper.GameName).send({from:EthWrapper.account, gas:3000000});
    }

    getGameState(callback){
        EthWrapper.gameContract.methods.getState(EthWrapper.GameName).call().then(callback);
    }

    setAccount(b){
        EthWrapper.account = b;
        console.log('Using adress',b);
    }

    getAccount(){
        return EthWrapper.account;
    }

    getPlayerId(callback){
        EthWrapper.gameContract.methods.getPlayerId(EthWrapper.GameName, EthWrapper.account).call().then(callback);
    }

    getCards(callback){
        EthWrapper.gameContract.methods.getCards(EthWrapper.GameName).call({from:EthWrapper.account}).then(decrypt).then(callback);
    }
}

var web3Provider;
var Web3 = require('web3');
async function initWeb3() {
	// Modern dapp browsers...
	if (window.ethereum) {
	web3Provider = window.ethereum;
	  try {
	    // Request account access
		await window.ethereum.enable();
		
	  } catch (error) {
	    // User denied account access...
	    console.error("User denied account access")
	  }
	  
	}
	// Legacy dapp browsers...
	else if (window.web3) {
	web3Provider = window.web3.currentProvider;
	}
	// If no injected web3 instance is detected, fall back to Ganache
	else {
	web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
	  
	}
  }
//static variables
EthWrapper.account = '0x0';
EthWrapper.GameName = '';

//Initialize WEB3

// Is there an injected web3 instance?
/*
if (typeof web3 !== 'undefined') {
    EthWrapper.web3 = new Web3(web3.currentProvider);
} else {
    // If no injected web3 instance is detected, fall back to Ganache
    EthWrapper.web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));
}
Too complicated for debugging*/
initWeb3()
EthWrapper.web3 = new Web3(web3Provider);

//this is the contract adress
var addr = '0x868Bb9834C83c0FEeD1475b5Ca773a33e8BB704B';
EthWrapper.gameContract = new EthWrapper.web3.eth.Contract(Abi.abi, addr);

//assign standard account
var e = new EthWrapper();
e.getAccounts(function(accounts){
    EthWrapper.account = accounts[0]//.toString().toUpperCase();
    console.log(EthWrapper.account);
});

export default EthWrapper;
