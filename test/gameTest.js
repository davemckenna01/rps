var testCase  = require('nodeunit').testCase;

module.exports = testCase({

  setUp: function(callback){

    var rps = require('../src/rps');

    this.rps = new rps.RPS();

    //Stubbing Player class

    //this.rps.PlayerStub is not actually used, I'm just
    //naming it that to keep it available (I'll just remove)
    //the 'Stub' part of the method name if I want to use
    //the stub
    this.rps.PlayerStub = function(id){
      this.getId = function(){
        return id;
      };

      var ready = false;

      var record = {
        'wins': 0,
        'losses': 0,
        'ties': 0
      }

      this.ready = function(){
        ready = true;
      };

      this.isReady = function(){
        return ready;
      };

      this.getRecord = function(){
        return record;
      };
      
      this.updateRecord = function(type){
        record[type]++;
      };

      this.again = function(){
        ready = false;
      };

    };    

    callback();
  },

  tearDown: function(callback){
    
    callback();
  },    

  "TC 1 - Game() - constructor": testCase({

    "test constructor must take 1 arg, a game id unique to this RPS instance": function(test) {

      var that = this;

      test.throws(
        function() {
          var game = new that.rps.Game();
        },
        Error
      );  

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
      
      var player = new this.rps.Player('');

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

    },

    "test player should be assigned role of host if 1st one added, and guest if 2nd": function(test) {

      var game = new this.rps.Game('abc123');

      var player1 = new this.rps.Player('p1');
      var player2 = new this.rps.Player('p2');

      game.addPlayer(player1);
      game.addPlayer(player2);

      test.equal(player1.getRole(), 'host');
      test.equal(player2.getRole(), 'guest');

      test.strictEqual(game.getHost(), player1);
      test.strictEqual(game.getGuest(), player2);

      test.done();

    }        
  
  }),

  "TC 3 - Game.isReady()": testCase({

    "test Game has an isReady method that returns a boolean": function(test) {
        
      var game = new this.rps.Game('abc123');

      test.equal(typeof game.isReady(), 'boolean');

      test.done();

    },

    "test should return false if there are 0 or 1 players": function(test) {
        
      var game = new this.rps.Game('abc123');
    
      test.equal(game.isReady(), false);

      var player1 = new this.rps.Player('p1');

      game.addPlayer(player1);

      test.equal(game.isReady(), false);

      test.done();

    },

    "test should return false if only 1 player ready": function(test) {
        
      var game = new this.rps.Game('abc123');

      var player1 = new this.rps.Player('p1');
      var player2 = new this.rps.Player('p2');

      game.addPlayer(player1);
      game.addPlayer(player2);

      player1.ready();

      test.equal(game.isReady(), false);

      test.done();

    },
    
    "test should return true if both players ready": function(test) {
        
      var game = new this.rps.Game('abc123');

      var player1 = new this.rps.Player('p1');
      var player2 = new this.rps.Player('p2');

      game.addPlayer(player1);
      game.addPlayer(player2);

      player1.ready();
      player2.ready();

      test.ok(game.isReady());

      test.done();

    }        

  }),

  "TC 4 - Game.start()": testCase({

    "test should return false if NOT game.isReady() and true if it isReady()": function(test) {
        
      var game = new this.rps.Game('abc123');

      test.equal(game.isReady(), false);

      test.equal(game.start(), false);

      var player1 = new this.rps.Player('p1');
      var player2 = new this.rps.Player('p2');

      game.addPlayer(player1);
      game.addPlayer(player2);

      player1.ready();
      player2.ready();

      test.ok(game.isReady());

      test.ok(game.start());

      test.done();

    },

    "test should set game.hasBegun to true if game.isReady()": function(test) {
        
      var game = new this.rps.Game('abc123');

      var player1 = new this.rps.Player('p1');
      var player2 = new this.rps.Player('p2');

      game.addPlayer(player1);
      game.addPlayer(player2);

      player1.ready();
      player2.ready();

      test.ok(game.isReady());   

      game.start();

      test.ok(game.hasBegun());

      test.done();

    },
    
    "test should initialize a throws property to store player throws": function(test) {
        
      var game = new this.rps.Game('abc123');

      var player1 = new this.rps.Player('p1');
      var player2 = new this.rps.Player('p2');

      game.addPlayer(player1);
      game.addPlayer(player2);

      player1.ready();
      player2.ready();

      game.start();

      test.equal(typeof game.getPlayerThrows(), 'object')
      test.equal(Object.keys(game.getPlayerThrows()).length, 0)

      test.done();

    }        

  }),
  
  "TC 5 - Game.registerThrow()": testCase({

    "test should only execute (i.e. return true) if game.hasBegun": function(test) {

      var game = new this.rps.Game('abc123');

      test.equal(game.registerThrow(), false);

      var player1 = new this.rps.Player('p1');
      var player2 = new this.rps.Player('p2');

      game.addPlayer(player1);
      game.addPlayer(player2);

      player1.ready();
      player2.ready();

      game.start();

      test.ok(game.registerThrow('p1', 'r'));

      test.done();

    },

    "test should accept 2 args, an existing player ID and an 'r', 'p', or 's', both strings": function(test) {

      var game = new this.rps.Game('abc123');

      var player1 = new this.rps.Player('p1');
      var player2 = new this.rps.Player('p2');

      game.addPlayer(player1);
      game.addPlayer(player2);

      player1.ready();
      player2.ready();

      game.start();

      test.throws(
        function(){
          game.registerThrow();
        },
        Error
      );

      test.throws(
        function(){
          game.registerThrow('');
        },
        Error
      );        

      test.throws(
        function(){
          game.registerThrow('', '');
        },
        Error
      );              

      test.throws(
        function(){
          game.registerThrow('', 'r');
        },
        Error
      );                    

      test.throws(
        function(){
          game.registerThrow('p99', 'r');
        },
        Error
      );                         
      
      test.throws(
        function(){
          game.registerThrow('p1', 'z');
        },
        Error
      );                                

      test.doesNotThrow(
          function(){
          game.registerThrow('p1', 'r');
        },
        Error
      );                

      test.doesNotThrow(
          function(){
          game.registerThrow('p1', 'p');
        },
        Error
      );                      

      test.doesNotThrow(
          function(){
          game.registerThrow('p1', 's');
        },
        Error
      );                            

      test.done();

    },
    
    "test should update game.playerThrows": function(test) {    
        
      var game = new this.rps.Game('abc123');

      var player1 = new this.rps.Player('p1');
      var player2 = new this.rps.Player('p2');

      game.addPlayer(player1);
      game.addPlayer(player2);

      player1.ready();
      player2.ready();

      game.start();
      
      game.registerThrow(player1.getId(), 'r');

      test.ok(game.getPlayerThrows().hasOwnProperty(player1.getId()));

      test.done();

    },
    
    "test only first throw should be registered, subsequent attempts per player have no effect": function(test) {    
        
      var game = new this.rps.Game('abc123');

      var player1 = new this.rps.Player('p1');
      var player2 = new this.rps.Player('p2');

      game.addPlayer(player1);
      game.addPlayer(player2);

      player1.ready();
      player2.ready();

      game.start();
      
      game.registerThrow(player1.getId(), 'r');
      game.registerThrow(player1.getId(), 'p');

      test.equal(game.getPlayerThrows()[player1.getId()], 'r');

      test.done();

    }  

  }),
  
  "TC 6 - Game.determineWinner()": testCase({

    "test should accept an object with 2 player props and their throws": function(test) {

      var game = new this.rps.Game('abc123');

      test.throws(
        function(){
          game.determineWinner();
        },
        Error
      )

      test.throws(
        function(){
          game.determineWinner({
            foo: 'bar'
          });
        },
        Error
      )
      
      test.doesNotThrow(
        function(){
          game.determineWinner({
            pid123: 'r',
            pid456: 'p'
          });
        },
        Error
      )            

      test.done();

    },

    "test r should beat s, s should beat p, and p should beat r, and winning player returned": function(test) {

      var game = new this.rps.Game('abc123');

      var results = game.determineWinner({
        pid123: 'r',
        pid456: 'p'
      });

      test.equal(results['winner'], 'pid456');

      results = game.determineWinner({
        pid123: 's',
        pid456: 'p'
      });

      test.equal(results['winner'], 'pid123');

      results = game.determineWinner({
        pid123: 's',
        pid456: 'r'
      });

      test.equal(results['winner'], 'pid456');

      results = game.determineWinner({
        pid123: 'r',
        pid456: 'r'
      });

      test.equal(results, 'tie');      

      results = game.determineWinner({
        pid123: 'p',
        pid456: 'p'
      });

      test.equal(results, 'tie');      
      
      results = game.determineWinner({
        pid123: 's',
        pid456: 's'
      });

      test.equal(results, 'tie');                  

      test.done();

    }    
    
  }),

  "TC 7 - Game.endRound(), called when 2nd throw has been registered.": testCase({

    "test should reset game.hasBegun back to false": function(test) {    
        
      var game = new this.rps.Game('abc123');

      var player1 = new this.rps.Player('p1');
      var player2 = new this.rps.Player('p2');

      game.addPlayer(player1);
      game.addPlayer(player2);

      player1.ready();
      player2.ready();

      game.start();
      
      game.registerThrow(player1.getId(), 'r');
      game.registerThrow(player2.getId(), 'p');

      test.equal(game.hasBegun(), false);

      test.done();

    },

    "test should calculate the winner and set game.results": function(test) {    
        
      var game = new this.rps.Game('abc123');

      var player1 = new this.rps.Player('p1');
      var player2 = new this.rps.Player('p2');

      game.addPlayer(player1);
      game.addPlayer(player2);

      player1.ready();
      player2.ready();

      game.start();
      
      game.registerThrow(player1.getId(), 'r');
      game.registerThrow(player2.getId(), 'p');

      test.equal(game.getResults()['winner'], player2.getId());

      test.done();

    }, 
    
    "test should increment game.rounds": function(test) {    
        
      var game = new this.rps.Game('abc123');

      var player1 = new this.rps.Player('p1');
      var player2 = new this.rps.Player('p2');

      game.addPlayer(player1);
      game.addPlayer(player2);

      player1.ready();
      player2.ready();

      game.start();
      
      game.registerThrow(player1.getId(), 'r');
      game.registerThrow(player2.getId(), 'p');

      test.equal(game.getRounds(), 1);  

      test.done();

    },        

    "test should update player record with wins and losses": function(test) {    
        
      var game = new this.rps.Game('abc123');

      var player1 = new this.rps.Player('p1');
      var player2 = new this.rps.Player('p2');

      game.addPlayer(player1);
      game.addPlayer(player2);

      player1.ready();
      player2.ready();

      game.start();
      
      game.registerThrow(player1.getId(), 'r');
      game.registerThrow(player2.getId(), 'p');

      test.equal(player1.getRecord()['losses'], 1);  
      test.equal(player2.getRecord()['wins'], 1);  
      
      test.done();

    },        

    "test should update player record with ties": function(test) {    
        
      var game = new this.rps.Game('abc123');

      var player1 = new this.rps.Player('p1');
      var player2 = new this.rps.Player('p2');

      game.addPlayer(player1);
      game.addPlayer(player2);

      player1.ready();
      player2.ready();

      game.start();
      
      game.registerThrow(player1.getId(), 'r');
      game.registerThrow(player2.getId(), 'r');

      test.equal(player1.getRecord()['ties'], 1);  
      test.equal(player2.getRecord()['ties'], 1);  

      test.done();

    }

  }),

  "TC 8 - Game.again()": testCase({

    "test should reset game state to play again": function(test) {    
        
      var game = new this.rps.Game('abc123');

      var player1 = new this.rps.Player('p1');
      var player2 = new this.rps.Player('p2');

      game.addPlayer(player1);
      game.addPlayer(player2);

      player1.ready();
      player2.ready();

      game.start();
      
      game.registerThrow(player1.getId(), 'r');
      game.registerThrow(player2.getId(), 'p');

      game.again();

      test.equal(game.hasBegun(), false);
      test.equal(Object.keys(game.getPlayerThrows()).length, 0);
      test.equal(Object.keys(game.getResults()).length, 0);

      test.done();

    },

    "test should put players in a ready state for a new game": function(test) {    
        
      var game = new this.rps.Game('abc123');

      var player1 = new this.rps.Player('p1');
      var player2 = new this.rps.Player('p2');

      game.addPlayer(player1);
      game.addPlayer(player2);

      player1.ready();
      player2.ready();

      game.start();
      
      game.registerThrow(player1.getId(), 'r');
      game.registerThrow(player2.getId(), 'p');

      game.again();

      test.equal(player1.isReady(), false);
      test.equal(player2.isReady(), false);

      test.done();

    },
    
    "test should be able to play more than 1 round": function(test) {    
        
      var game = new this.rps.Game('abc123');

      var player1 = new this.rps.Player('p1');
      var player2 = new this.rps.Player('p2');

      game.addPlayer(player1);
      game.addPlayer(player2);

      player1.ready();
      player2.ready();

      game.start();
      
      game.registerThrow(player1.getId(), 's');
      game.registerThrow(player2.getId(), 'p');

      test.equal(player1.getRecord()['wins'], 1);  
      test.equal(player1.getRecord()['losses'], 0);  
      test.equal(player1.getRecord()['ties'], 0);  
      test.equal(player2.getRecord()['wins'], 0);  
      test.equal(player2.getRecord()['losses'], 1);  
      test.equal(player2.getRecord()['ties'], 0);  
      
      game.again();    

      player1.ready();
      player2.ready();

      game.start();
      
      game.registerThrow(player1.getId(), 's');
      game.registerThrow(player2.getId(), 'p');

      test.equal(player1.getRecord()['wins'], 2);  
      test.equal(player1.getRecord()['losses'], 0);  
      test.equal(player1.getRecord()['ties'], 0);  
      test.equal(player2.getRecord()['wins'], 0);  
      test.equal(player2.getRecord()['losses'], 2);  
      test.equal(player2.getRecord()['ties'], 0); 
      
      game.again();    

      player1.ready();
      player2.ready();

      game.start();
      
      game.registerThrow(player1.getId(), 's');
      game.registerThrow(player2.getId(), 'r');

      test.equal(player1.getRecord()['wins'], 2);  
      test.equal(player1.getRecord()['losses'], 1);  
      test.equal(player1.getRecord()['ties'], 0);  
      test.equal(player2.getRecord()['wins'], 1);  
      test.equal(player2.getRecord()['losses'], 2);  
      test.equal(player2.getRecord()['ties'], 0);           

      game.again();    

      player1.ready();
      player2.ready();

      game.start();
      
      game.registerThrow(player1.getId(), 'p');
      game.registerThrow(player2.getId(), 'p');

      test.equal(player1.getRecord()['wins'], 2);  
      test.equal(player1.getRecord()['losses'], 1);  
      test.equal(player1.getRecord()['ties'], 1);  
      test.equal(player2.getRecord()['wins'], 1);  
      test.equal(player2.getRecord()['losses'], 2);  
      test.equal(player2.getRecord()['ties'], 1);                 

      test.done();

    }        
    
  })  

});
