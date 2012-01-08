
/**
 * Module dependencies.
 */

var express = require('express'),
    uuid = require('node-uuid'),
    routes = require('./routes');

var app = module.exports = express.createServer();

var io = require('socket.io').listen(app);



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

app.get('/', routes.index);

app.get('/create', function(req, res){
  routes.create(req, res, uuid);
});

app.get('/game/:id', routes.game);

app.listen(3000);
console.log("Express server listening on port %d in %s mode", 
              app.address().port, app.settings.env);
