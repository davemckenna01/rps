var testCase  = require('nodeunit').testCase;

module.exports = testCase({

	setUp: function(callback){

		this.RPS = require('../src/rps').RPS;

		callback();

	},

	tearDown: function(callback){

		callback();

	},    

	"TC 1 RPSInstance()": testCase({

		"should return a unique object": function(test) {

			var rps = new this.RPS.RPSInstance();

			test.equal(typeof rps, 'object')

			var rps2 = new this.RPS.RPSInstance();

			test.notStrictEqual(rps, rps2)

			test.done();

		}

	}),

	"TC 2 RPSInstance.addGame()": testCase({

		"should add an object to the instance's games property": function(test) {

			var rps = new this.RPS.RPSInstance();

			var id = 'abc123';

			rps.addGame(id, {'foo': 'bar'});

			test.equal(rps.getGames()[id].foo, 'bar');

			rps.addGame('abc456', {'foo': 'bar'});

			test.equal(Object.keys(rps.getGames()).length, 2);			

			test.done();

		},

		"should not be allowed to add a game with an existing id": function(test) {

			var rps = new this.RPS.RPSInstance();
			var id = 'abc123';
			rps.addGame(id, {'foo': 'bar'});

			test.throws(
			  function(){
			    rps.addGame(id, {'foo': 'bar'});  
			  },
			  Error
			)

			test.done();

		}    

	}),  

	"TC 3 RPSInstance.getGames()": testCase({

		"should return all games belonging to an instance": function(test) {

			var rps = new this.RPS.RPSInstance();

			var id = 'abc123';

			rps.addGame(id, {'foo': 'bar'});

			test.equal(rps.getGames()[id].foo, 'bar');

			rps.addGame('abc456', {'foo': 'bar'});

			test.equal(Object.keys(rps.getGames()).length, 2);			

			test.done();

		}
	}),	

	"TC 4 RPSInstance. ??": testCase({

		"...": function(test) {

			test.done();

		}

	})  	

});
