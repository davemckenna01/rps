var RPS = function (){
	var that = this;

	var games = {};

	var players = {}

	this.getGames = function(){
		return games;
	};

	this.Game = function(id){

    var gamePlayers = {};

    var rounds = 0;

    var inProgress, playerThrows, results;

    function initGameProps(){
	    inProgress = false;
	    playerThrows = {};
			results = {};
    }

		initGameProps();

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

	    if (Object.keys(gamePlayers).length >= 2){
	    	throw new Error('Games may take a max of 2 Players');
	    } else {
	    	gamePlayers[player.getId()] = player;
			}

    };

    this.getPlayers = function(){
    	return gamePlayers;
    };

    this.isReady = function(){

    	var ready = null;

    	var keys = Object.keys(gamePlayers);

    	if (keys.length < 2) {
    		ready = false;
    	} else if (
	    	!( gamePlayers[keys[0]].isReady() && gamePlayers[keys[1]].isReady() )
	    ){
    		ready = false;
    	} else if (
    		gamePlayers[keys[0]].isReady() && gamePlayers[keys[1]].isReady()
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

			//detecting when to 'end' the game. If the second throw
			//has come in, then we can end it, i.e. the round is over.
			if (Object.keys(playerThrows).length == 2){
				this.roundOver();
			}
			  		
			return true;
    };

    //should be private!!!!!!!!
    this.roundOver = function(){
			inProgress = false;
			results = this.determineWinner(playerThrows);
	
			if (results == 'tie'){
				gamePlayers[Object.keys(gamePlayers)[0]].updateRecord('ties');
				gamePlayers[Object.keys(gamePlayers)[1]].updateRecord('ties');
				//return results;
			} else {
				gamePlayers[results['winner']].updateRecord('wins');
				gamePlayers[results['loser']].updateRecord('losses');
				//return results['winner'];
			}

			rounds++;    	
    };

    this.getWinner = function(){
    	return winner;
    }

    this.determineWinner = function(pThrows){
    	if (arguments.length <= 0){
    		throw new Error('determineWinner takes exactly 1 arg.');
    	}

    	if (Object.keys(pThrows).length != 2){
    		throw new Error('There are not enough throws in this object.');
    	}
    	
    	var p1 = Object.keys(pThrows)[0];
    	var p1Throw = pThrows[Object.keys(pThrows)[0]];
    	var p2 = Object.keys(pThrows)[1];
    	var p2Throw = pThrows[Object.keys(pThrows)[1]];    	

    	switch(p1Throw) {
    		case 'r':
    			if (p2Throw == 'r') return 'tie';
    			if (p2Throw == 'p') return {winner: p2, loser: p1};
    			if (p2Throw == 's')	return {winner: p1, loser: p2};

    		case 'p':
    			if (p2Throw == 'r') return {winner: p1, loser: p2};
    			if (p2Throw == 'p') return 'tie';
    			if (p2Throw == 's')	return {winner: p2, loser: p1};    		

    		case 's':
    			if (p2Throw == 'r') return {winner: p2, loser: p1};
    			if (p2Throw == 'p') return {winner: p1, loser: p2};
    			if (p2Throw == 's')	return 'tie';    		

    	}
    	
    };

    this.getRounds = function(){
    	return rounds;
    }

    this.getResults = function(){
    	return results;
    };

    this.again = function(){
    	initGameProps();
    	gamePlayers[Object.keys(gamePlayers)[0]].again();
			gamePlayers[Object.keys(gamePlayers)[1]].again();
    };

	};




	this.Player = function(id){

    if (arguments.length <= 0 || typeof arguments[0] != 'string' ){
      throw new Error('Player() takes exactly 1 string arg ');
    }
    
    if (players.hasOwnProperty(id)){
      throw new Error('Game IDs must be unique');
    } else {
      players[id] = this;
    }		
		
	};





};

exports.RPS = RPS;