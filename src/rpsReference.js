var RPS = function (){
  var type = 'RPS',
      games = [];

  this.getType = function(){
    return type;
  }

  this.getGames = function(){
    return games;
  }

  //There should be something like the following
  /*
  this.getGame = function(gameId) {
    return games[gameId];
  }
  */  

  this.Game = function(id) {
    var type = 'Game';

    if (arguments.length <= 0 || typeof arguments[0] != 'string' ){
      throw new Error('Game() takes exactly 1 string arg ');
    }

    if (/^\d+$/.test(arguments[0])){
      throw new Error(
        'Game() Argument can not be a number, must be string or number/string combo'
      );
    }    

    games[id] = this;

    // if (games.hasOwnProperty(this.id)){
    //   throw new Error('Game IDs must be unique');
    // } else {
    //   games[id] = this;
    // }

    this.getType = function(){
      return type;
    }

    this.getId = function(){
      return id;
    }

  }

};

exports.RPS = RPS;