var RPS = function (){

	var games = []

	this.getGames = function(){
		return games;
	};

	this.Game = function(id){

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
    }

	};

};

exports.RPS = RPS;