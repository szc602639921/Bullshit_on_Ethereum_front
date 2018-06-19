class GameLogic{

    update(){
        //First poll state, player and card

        //Check if it has ended
        if(GameLogic.gameState == GameLogic.gameState.END){
            //Announce winner
            console.log("WINNER IS "+GameLogic.curPLayer);
        }

        //Check if i need to do sth, else return
        if(!GameLogic.me.equals(GameLogic.curPLayer)){
            return;
        }

        //It is my turn, check state
        switch(GameLogic.gameState){
            case GameLogic.gameState.JOIN:
                Console.log("Waiting for other players..");
                break;
            case GameLogic.gameState.REVEAL:
                Console.log("Sending my nonces to server");
                sendNonces();
            break;
            case GameLogic.gameState.PLAY:
                Console.log("Notify Player its his turn");
                notifyPlayer();
            break;
            case GameLogic.gameState.DEAL:
                Console.log("Dealing Cards now");
                dealCards();
            break;
        }
    }

    dealCards(){
        eth.dealCards(gameName, cards, console.log);
    }
    

}

GameLogic.gameName = "";
GameLogic.curPLayer = "0x0";
GameLogic.me = "0x0";
GameLogic.gameState = Object.freeze({"JOIN":1, "REVEAL":2, "PLAY":3, "DEAL":4, "END":5});
GameLogic.eth = new EthWrapper();


export default GameLogic;