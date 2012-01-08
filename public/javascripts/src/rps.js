var RPS = function() {

	var gameCreated = false;

	this.Game = function(id){

		if (gameCreated){
			throw new Error('Only 1 Game may be instantiated.');
		}

		if (arguments.length <= 0 || typeof arguments[0] != 'string' ){
		  throw new Error('Game() takes exactly 1 string arg ');
		}

		if (!gameCreated){
			gameCreated = true;
		}


	};

};
