
class CryptoManager{

    //Function to hash an integer hard with a salt
    getHash(card, salt){

    }

    //Validate hash
    validateHash(card, salt, hash){
        //returns true if the hash is valid
    }

    //Encode Cards
    encodeCards(cards, pubkeys){
        //returns encrytped cards with different pubkeys
    }

    bruteForceHash(hash, salt){
        //brute forces which card belongs to this hash and returns it
    }
}

export default CryptoManager;