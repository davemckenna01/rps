var socket = io.connect('http://localhost:3000');

socket.on('serverEvent', function (data) {
	console.log('receiving data:', data);
});


$('#rock').click(function(){
	socket.emit('clientEvent', { fromClient: 'hi from the Browser' });	
});

console.log('what is this "socket" object anyway?', socket);