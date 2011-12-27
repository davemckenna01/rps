var testCase  = require('nodeunit').testCase;

module.exports = testCase({

  setUp: function(callback){

    var rps = require('../src/rps');

    this.rps = new rps.RPS(); 

    callback();
  },

  tearDown: function(callback){
    
    callback();

  },    

  "TC 1 - Player() - constructor": testCase({

    "test rps has a Player constructor": function(test) {

      test.equal(typeof this.rps.Player, 'function');

      test.done();

    },

    "test should take 1 string arg": function(test) {

      var that = this;

      test.throws(
        function() {
          var player = new that.rps.Player();
        },
        Error
      );  

      test.done();

    },

    "test players should not be allowed to have the same id": function(test) {

      var that = this;

      test.throws(
        function(){
          var player1 = new that.rps.Player('abc123');
          var player2 = new that.rps.Player('abc123');
        },
        Error
      )
      test.done();

    }    

  }),

  "TC 2 - RPS.getPlayers()": testCase({

    "test rps should have a getPlayers() method that returns all players belonging to this rps instance": function(test) {

      test.equal(typeof this.rps.getPlayers(), 'object')

      var player1 = new this.rps.Player('abc123');

      test.equal(typeof this.rps.getPlayers()['abc123'], 'object')
      test.equal(this.rps.getPlayers()['abc123'].getId(), 'abc123')

      var player1 = new this.rps.Player('abc456');

      test.equal(typeof this.rps.getPlayers()['abc456'], 'object')
      test.equal(this.rps.getPlayers()['abc456'].getId(), 'abc456')    
      
      test.equal(Object.keys(this.rps.getPlayers()).length, 2 );


      test.done();

    }

  }),

  "TC 3 - Player.isReady()": testCase({

    "test should return a boolean for the player's ready state": function(test) {

      var player = new this.rps.Player('abc123');

      test.equal(typeof player.isReady, 'function');

      test.equal(typeof player.isReady(), 'boolean');

      test.done();

    }

  }),

  "TC 4 - Player.ready()": testCase({

    "test should set player.ready to true": function(test) {

      var player = new this.rps.Player('abc123');

      player.ready();

      test.equal(player.isReady(), true);

      test.done();

    },

  }),

  "TC 5 - Player.getRecord()": testCase({

    "test should return a record object with props 'wins', 'losses', and 'ties'": function(test) {

      var player = new this.rps.Player('abc123');

      test.equal(player.getRecord()['wins'], 0);
      test.equal(player.getRecord()['losses'], 0);
      test.equal(player.getRecord()['ties'], 0);

      test.done();

    }        

  }),

  "TC 6 - Player.updateRecord()": testCase({

    "test should accept a record type arg and increment it by 1": function(test) {

      var player = new this.rps.Player('abc123');

      player.updateRecord('wins');

      test.equal(player.getRecord()['wins'], 1);
      test.equal(player.getRecord()['losses'], 0);
      test.equal(player.getRecord()['ties'], 0);

      player.updateRecord('wins');
      player.updateRecord('losses');
      player.updateRecord('ties');

      test.equal(player.getRecord()['wins'], 2);
      test.equal(player.getRecord()['losses'], 1);
      test.equal(player.getRecord()['ties'], 1);      

      test.done();

    }        

  }),
  
  "TC 7 - Player.again()": testCase({

    "test should reset player.ready back to false": function(test) {

      var player = new this.rps.Player('abc123');

      player.ready();

      player.again();

      test.equal(player.isReady(), false);     

      test.done();

    }        

  })          

});
