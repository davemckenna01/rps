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

    "test should take 1 string arg, a player id unique to this RPS instance": function(test) {

      var that = this;

      test.throws(
        function() {
          var player = new that.rps.Player();
        },
        Error
      );  

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

  "TC 2 - Player.ready()": testCase({

    "test should set player.ready to true": function(test) {

      var player = new this.rps.Player('abc123');

      player.ready();

      test.equal(player.isReady(), true);

      test.done();

    },

  }),

  "TC 3 - Player.updateRecord()": testCase({

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
  
  "TC 4 - Player.again()": testCase({

    "test should reset player.ready back to false": function(test) {

      var player = new this.rps.Player('abc123');

      player.ready();

      player.again();

      test.equal(player.isReady(), false);     

      test.done();

    }        

  })          

});
