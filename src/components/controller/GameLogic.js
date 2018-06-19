class GameLogic{

    constructor(eth){
        GameLogic.eth = eth;
        this.timer = setInterval(this.update, 1000);
    }

    update(){
        //console.log("GameTick");
        //First poll state, player and card
        GameLogic.eth.getGameState(function (newGamestate){
            if(newGamestate===GameLogic.curState) return;
            GameLogic.curState = newGamestate;
        });
        GameLogic.eth.getCurrentPlayer(function (newPlayer){
            if(newPlayer===GameLogic.curPlayer) return;
            GameLogic.curPlayer = newPlayer;
        });

        //Check if it has ended
        if(GameLogic.curState == 5){
            //Announce winner
            console.log("WINNER IS "+GameLogic.curPLayer);
        }

        //Check if i need to do sth, else return

        //It is my turn, check state

    }

    dealCards(){
        GameLogic.eth.dealCards(gameName, cards, console.log);
    }
    
    setCurrentPlayers(players){
        GameLogic.playerArray = players;
    }

    setPlayer(player){
        console.log(player);
        GameLogic.curPlayer = player;
    }

    getPlayer(){
        return GameLogic.curPlayer;
    }

    getGameState(){
        switch(GameLogic.curState){
            case '0':
                return "JOIN";
            case '4':
                return "REVEAL";
            case '2':
                return "PLAY";
            case '1':
                return "DEAL";
            case '3':
                return "LIE";
            case '5':
                return "END";
        }
    }
}

GameLogic.gameName = "";
GameLogic.curPlayer = "-1";
GameLogic.playerArray = [];
GameLogic.curState = 0;
GameLogic.eth = ''

export {GameLogic as default}