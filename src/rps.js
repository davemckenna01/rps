var RPS = function (){
	var that = this;

	var games = []

	this.getGames = function(){
		return games;
	};

	this.Game = function(id){

    var players = [];

    var inProgress = false;

    if (arguments.length <= 0 || typeof arguments[0] != 'string' ){
      throw new Error('Game() takes exactly 1 string arg ');
    }

    if (/^\d+$/.test(arguments[0])){
      throw new Error(
        'Game() Argument can not be a number, must be string or number/string combo'
      );
    }
    
    if (games.hasOwnProperty(id)){
      throw new Error('Game IDs must be unique');
    } else {
      games[id] = this;
    }

    this.getId = function(){
    	return id;
    };

    this.addPlayer = function(player){

	    if (arguments.length <= 0 || !(arguments[0] instanceof that.Player) ){
	      throw new Error('addPlayer() takes exactly 1 arg of type Player');
	    }

	    if (Object.keys(players).length >= 2){
	    	throw new Error('Games may take a max of 2 Players');
	    } else {
	    	players[player.getId()] = player;
			}

    };

    this.getPlayers = function(){
    	return players;
    };

    this.isReady = function(){

    	var ready = null;

    	var keys = Object.keys(players);

    	if (keys.length < 2) {
    		ready = false;
    	} else if (
	    	!( players[keys[0]].isReady() && players[keys[1]].isReady() )
	    ){
    		ready = false;
    	} else if (
    		players[keys[0]].isReady() && players[keys[1]].isReady()
    	) {
    		ready = true;
    	}

    	return ready;

    };

    this.start = function(){
    	if(!this.isReady()){
    		return false;
    	} else {

    		inProgress = true;

    		return true;
    	}
    };

    this.isInProgress = function(){
    	return inProgress;
    };

	};

};

exports.RPS = RPS;