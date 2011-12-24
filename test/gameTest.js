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

    "test games should not be allowed to have the same id": 
      function(test) {

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


  })

});
