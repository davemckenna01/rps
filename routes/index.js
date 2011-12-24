exports.index = function(req, res){
  res.render('index', { title: 'Create Game' })
};

exports.create = function(req, res, uuid){
	var gameId = uuid.v4();
  res.send({"id": gameId});
};

exports.game = function(req, res){
	var gameId = req.params.id
	res.render('game', { title: 'Game time y\'all', gameId: gameId });
};

