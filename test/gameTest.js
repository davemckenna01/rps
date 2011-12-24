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

    "test constructor must take 1 arg, a game id of string+int combo": function(test) {

        test.done();

    }


  })

});
