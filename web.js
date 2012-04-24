/**
* Module dependencies.
*/

var express = require('express'),
    uuid = require('node-uuid'),
    routes = require('./routes'),

    app = module.exports = express.createServer(),

    io = require('socket.io').listen(app),

    rps = require('./src/rps');

////////////////////////////////////
//Should run this only on heroku...
io.configure(function () { 
  io.set("transports", ["xhr-polling"]); 
  io.set("polling duration", 10); 
});
////////////////////////////////////

rps = new rps.RPS();
rps.connectionManager.init(io, rps);

// Configuration

app.configure(function(){
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.set('view options', { layout: false });    
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
    app.use(express.errorHandler()); 
});

// Routes

app.get('/', function(req, res){
    res.render('index', {});
});

app.get('/create', function(req, res){
    var gameId = uuid.v4(),
        game = new rps.Game(gameId);

    res.redirect('/game/' + game.getId());    
});

app.get('/game/:id', function(req, res){
    var gameId = req.params.id,
        game = rps.getGames()[gameId];

    res.render('game', {});
});

var port = process.env.PORT || 3000

app.listen(port);

console.log("Express server listening on port %d in %s mode", 
            app.address().port, app.settings.env);
