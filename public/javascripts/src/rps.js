var Game = function () {

    var gameObject = this,
        gameId = window.location.href.split('/')[window.location.href.split('/').length - 1],
        connection = io.connect('http://localhost:8000');


    connection.on('playerConnected', function (data) {


        gameObject.hostPlayer.id = data.playerId;

        console.log(data.message);
        console.log('I (the browser player) am now connected to node, and my id is', 
                    gameObject.hostPlayer.id);

        gameObject.hostPlayer.actions.joinGame();

    });

    connection.on('gameJoinSuccess', function (data) {
        gameObject.hostPlayer.gameJoined = true;
        console.log(data.message);
        console.log('I (the browser player) have now joined the game, ('+ gameId +')');

    });

    connection.on('gameJoinFailure', function (data) {
        gameObject.hostPlayer.gameJoined = false;
        console.log(data.message);
        console.log('I (the browser player) have failed to join the game, ('+ gameId +')');

    });         

    this.guestPlayer = {
        id: null,
        gameJoined: false,

        actions: {

        }
    },

    this.hostPlayer = {
        id: null,
        gameJoined: false,

        actions: {
            joinGame: function(){
                console.log('got here');
                connection.emit('joinGame', { gameId: gameId}); 
            },
            ready: function(){
                
            },
            doThrow: function(throwType){
                
                if (throwType !== 'r' && throwType !== 'p' && throwType !== 's'){
                    throw new Error('Must be an "r", "p", or "s"');
                }

                connection.emit('throwEvent', {
                    playerThrow: throwType
                });                

                console.log('I threw a', throwType)

            }
        }
    }

}

var game = new Game();

$('#rock').click(function(){
    game.hostPlayer.actions.doThrow('r');
});

$('#paper').click(function(){
    game.hostPlayer.actions.doThrow('p');
});

$('#scissors').click(function(){
    game.hostPlayer.actions.doThrow('s');
});

