var RPS = function (){
	var that = this;

	var games = {};

	this.getGames = function(){
		return games;
	};

	this.Game = function(id){

    var players = {};

    var inProgress = false;

    var playerThrows = {};

    if (arguments.length <= 0 || typeof arguments[0] != 'string' ){
      throw new Error('Game() takes exactly 1 string arg ');
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

    		//re-initializing (clearing) obj to keep track of
    		//player throws
    		playerThrows = {};

    		return true;
    	}
    };

    this.isInProgress = function(){
    	return inProgress;
    };

    this.getThrows = function(){
    	return playerThrows;
    	
    };

    this.registerThrow = function(player, throwRPS){
    	if (!this.isInProgress()){
    		return false;
    	}

	    if (arguments.length != 2 || 
		     ( typeof arguments[0] != 'string' && typeof arguments[1] != 'string' ) ){
	      
	      throw new Error('submitThrow() takes exactly 2 string args');
	    }

	    if (! ( player in this.getPlayers() ) ) {
	    	throw new Error('That player is not playing in this game.');	
	    }

	    if (throwRPS != 'r' && throwRPS != 'p' && throwRPS != 's') {
	    	throw new Error('Must be either an "r", "p", or "s"');	
	    }	    

	    if (!playerThrows[player]){
	    	playerThrows[player] = throwRPS;
			}

  		
			return true;
    };



	};

};

exports.RPS = RPS;