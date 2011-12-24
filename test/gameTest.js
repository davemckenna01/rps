var testCase  = require('nodeunit').testCase;

module.exports = testCase({

  setUp: function(callback){

    var rps = require('../src/rps');

    this.rps = new rps.RPS();

    //Stubbing Player class
    this.rps.Player = function(id){
      this.getId = function(){
        return id;
      }
      
    };    

    callback();
  },

  tearDown: function(callback){
    
    callback();
  },    

  "TC 1 - Game() - constructor": testCase({

    "test rps has a Game constructor": function(test) {

        test.equal(typeof this.rps.Game, 'function');

        test.done();

    },

    "test constructor must take 1 arg, a game id of string or  string+int combo": 
      function(test) {

        var that = this;

        test.throws(
          function() {
            var game = new that.rps.Game();
          },
          Error
        );

        test.throws(
          function() {
            var game = new that.rps.Game('1');
          },
          Error
        );        

        test.done();

    },

    "test rps should have a getGames() method that returns all games belonging to this rps instance": 
      function(test) {

        test.equal(typeof this.rps.getGames(), 'object')

        var game1 = new this.rps.Game('abc123');

        test.equal(typeof this.rps.getGames()['abc123'], 'object')
        test.equal(this.rps.getGames()['abc123'].getId(), 'abc123')

        var game2 = new this.rps.Game('abc456');

        test.equal(typeof this.rps.getGames()['abc456'], 'object')
        test.equal(this.rps.getGames()['abc456'].getId(), 'abc456')       
        
        test.equal(Object.keys(this.rps.getGames()).length, 2 );


        test.done();

    },

    "test games should not be allowed to have the same id": function(test) {

        var that = this;

        test.throws(
          function(){
            var game1 = new that.rps.Game('abc123');
            var game2 = new that.rps.Game('abc123');
          },
          Error
        )
        test.done();

    }


  }),

  "TC 2 - Game.addPlayer()": testCase({

    "test Game has an addPlayer method that accepts 1 Player obj arg": function(test) {

        var game = new this.rps.Game('abc123');

        test.equal(typeof game.addPlayer, 'function');

        var that = this;

        test.throws(
          function() {
            game.addPlayer();
          },
          Error
        );     
        
        test.throws(
          function() {
            game.addPlayer('abc123');
          },
          Error
        );  
        
        var player = new this.rps.Player();

        test.doesNotThrow(
          function() {
            game.addPlayer(player);
          },
          Error
        );                        

        test.done();

    },

    "test Game instances should have a getPlayers() method that returns all Players belonging to the game": function(test){
        
        var game = new this.rps.Game('abc123');

        test.equal(typeof game.getPlayers(), 'object')

        var player1 = new this.rps.Player('p1');
        game.addPlayer(player1);

        test.equal(typeof game.getPlayers()['p1'], 'object')
        test.equal(game.getPlayers()['p1'].getId(), 'p1')

        var player2 = new this.rps.Player('p2');
        game.addPlayer(player2);

        test.equal(typeof game.getPlayers()['p2'], 'object')
        test.equal(game.getPlayers()['p2'].getId(), 'p2')
        
        test.equal(Object.keys(game.getPlayers()).length, 2 );      

        test.done();        

    },

    "test Game instances store Player objects": function(test) {

        var game = new this.rps.Game('abc123');
        var player1 = new this.rps.Player('p1');
        var player2 = new this.rps.Player('p2');

        game.addPlayer(player1);
        game.addPlayer(player2);

        test.equal(game.getPlayers()['p1'].getId(), 'p1');
        test.equal(game.getPlayers()['p2'].getId(), 'p2');


        test.done();

    },

    "test a single Game instance accepts a max of 2 Players": function(test) {

        var game = new this.rps.Game('abc123');

        var player1 = new this.rps.Player('p1');
        var player2 = new this.rps.Player('p2');
        var player3 = new this.rps.Player('p3');

        test.throws(
          function(){
            game.addPlayer(player1);
            game.addPlayer(player2);
            game.addPlayer(player3);
          },
          Error
        )

        test.done();

    }    
  
  })  

});
