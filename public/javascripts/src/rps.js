var socket = io.connect('http://localhost:8000');
console.log('what is this "socket" object anyway?', socket);

var gameId = window.location.href.split('/')[window.location.href.split('/').length - 1];

var clientId = '';

var gameJoined = false;

socket.on('clientConnected', function (data) {
	clientId = data.clientId;

	console.log(data.message);
	console.log('I (the browser client) am now connected to node, and my id is', clientId);

	socket.emit('joinGame', { gameId: gameId});

});

socket.on('gameJoinSuccess', function (data) {
	gameJoined = true;
	console.log(data.message);
	console.log('I (the browser client) have now joined the game, ('+ gameId +')');

});

socket.on('gameJoinFailure', function (data) {
	gameJoined = false;
	console.log(data.message);
	console.log('I (the browser client) have failed to join the game, ('+ gameId +')');

});







$('#rock').click(function(){
	socket.emit('throwEvent', 
		{playerThrow: 'r'
		}
	);
});

$('#paper').click(function(){
	socket.emit('throwEvent', 
		{playerThrow: 'p'
		}
	);
});

$('#scissors').click(function(){
	socket.emit('throwEvent', 
		{playerThrow: 's'
		}
	);
});

