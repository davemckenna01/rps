/**
* Module dependencies.
*/

var express = require('express'),
    uuid = require('node-uuid'),
    routes = require('./routes'),

    app = module.exports = express.createServer(),

    io = require('socket.io').listen(app),

    rps = require('./src/rps');

rps = new rps.RPS();

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
    res.render('index', { title: 'Create Game' });    
});

app.get('/create', function(req, res){
    var gameId = uuid.v4(),
        game = new rps.Game(gameId);

    res.redirect('/game/' + game.getId());    
});

app.get('/game/:id', function(req, res){
    var gameId = req.params.id,
        game = rps.getGames()[gameId];

    console.log(game.getId(), game);

    res.render('game', { title: 'Game time y\'all', gameId: game.getId() });
});

app.listen(8000);

console.log("Express server listening on port %d in %s mode", 
            app.address().port, app.settings.env);

//IO

io.sockets.on('connection', function (socket) {

    var player = new rps.Player(socket.id);

    socket.emit('clientConnected', {
        message: 'hi from node, you\'re client #' + socket.id + ' and you\'re connected to me now!',
        clientId: socket.id
    });

    socket.on('joinGame', function (data) {
        console.log('client', socket.id, 'is trying to join game', data.gameId);

        var game = rps.getGames().hasOwnProperty(data.gameId) ? rps.getGames()[data.gameId] : null;

        if (game){

            try {
                game.addPlayer(player);

                socket.emit('gameJoinSuccess', {
                    //code: '',
                    message: 'hi from node, you\'re client #' + socket.id + ' and you\'ve just joined game' + game.getId() + '!'
                });                

                console.log('gameJoinSuccess');
                
            } catch (e) {

                socket.emit('gameJoinFailure', {
                    //code: '',
                    message: 'hi from node, you\'re client #' + socket.id + ' and you\'ve FAILED to join game' + game.getId() + ':('
                });            

                console.log('gameJoinFailure');

                console.log('error:', e.message);
                
            }

        } else {

            socket.emit('gameJoinFailure', {
                //code: '',
                message: 'hi from node, you\'re client #' + socket.id + ' and you\'ve FAILED to join game' + game.getId() + ':('
            });            

            console.log('gameJoinFailure');      
            console.log('there\'s no game with that id');
        }

        console.log(game);
        console.log(game.getPlayers());

    });

});