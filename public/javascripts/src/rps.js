var game = {

	id: window.location.href.split('/')[window.location.href.split('/').length - 1],

	connection: io.connect('http://localhost:8000'),

	initEventHandlers: function(){
		console.log(this);

		var that = this;

		this.connection.on('clientConnected', function (data) {
			that.player.clientId = data.clientId;

			console.log(data.message);
			console.log('I (the browser client) am now connected to node, and my id is', 
						that.player.clientId);

			that.connection.emit('joinGame', { gameId: that.id});

		});

		this.connection.on('gameJoinSuccess', function (data) {
			that.player.gameJoined = true;
			console.log(data.message);
			console.log('I (the browser client) have now joined the game, ('+ that.id +')');

		});

		this.connection.on('gameJoinFailure', function (data) {
			that.player.gameJoined = false;
			console.log(data.message);
			console.log('I (the browser client) have failed to join the game, ('+ that.id +')');

		});			
		
	},

	player: {
		clientId: null,
		gameJoined: false
	}
}

game.initEventHandlers();









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

