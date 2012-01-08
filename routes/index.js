var rps = require('../src/rps');
rps = new rps.RPS();

exports.index = function(req, res){
  res.render('index', { title: 'Create Game' })
};

exports.create = function(req, res, uuid){
	var gameId = uuid.v4();

	var game = new rps.Game(gameId);

  	res.redirect('/game/' + game.getId());

};

exports.game = function(req, res){
	var gameId = req.params.id;

	var game = rps.getGames()[gameId];

	console.log(game);

	res.render('game', { title: 'Game time y\'all', gameId: gameId });
};

