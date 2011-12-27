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

  })

});
