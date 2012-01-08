var rps = require('../src/rps');
rps = new rps.RPS();

exports.index = function (req, res) {
	'use strict';

	res.render('index', { title: 'Create Game' });
};

exports.create = function (req, res, uuid) {
	'use strict';

	var gameId = uuid.v4(),
		game = new rps.Game(gameId);

	res.redirect('/game/' + game.getId());
};

exports.game = function (req, res, io) {
	'use strict';

	var gameId = req.params.id,
		game = rps.getGames()[gameId];

	console.log(game.getId(), game);

	io.sockets.on('connection', function (socket) {

		socket.emit('serverEvent', { fromServer: 'hi from node, you\'re client #' + socket.id});

		socket.on('clientEvent', function (data) {
			console.log('client ', socket.id, ' sent something...')
			console.log(data);
		});

	});

	res.render('game', { title: 'Game time y\'all', gameId: gameId });
};