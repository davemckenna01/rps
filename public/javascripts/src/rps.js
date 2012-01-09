var Game = function () {

    var gameObject = this,
        gameId = window.location.href.split('/')[window.location.href.split('/').length - 1],
        connection = io.connect('http://localhost:8000'),

        state;
        //off (nobody's ready)
        //started (both are ready)
        //throws are happening


    connection.on('playerConnected', function (data) {

        gameObject.you.id = data.playerId;

        console.log(data.message);
        console.log('I (the browser player) am now connected to node, and my id is', 
                    gameObject.you.id);

        gameObject.you.actions.joinGame();

    });

    connection.on('gameJoinSuccess', function (data) {
        var you = gameObject.you,
            them = gameObject.them;

        you.gameJoined = true;

        if (data.youreRole === 'host') {
            you.role = 'host';
            them.role = 'guest'
        } else if (data.youreRole === 'guest') {
            you.role = 'guest';
            them.role = 'host'
        }

        you.highlight();

        console.log(data.message);
        console.log('I (the browser player) have now joined the game, ('+ gameId +')');

    });

    connection.on('gameJoinFailure', function (data) {
        gameObject.you.gameJoined = false;
        console.log(data.message);
        console.log('I (the browser player) have failed to join the game, ('+ gameId +')');

    });            

    connection.on('initiateCountdown', function (data) {
        console.log('initiate countdown');
    });      

    connection.on('updateYouStatus', function (data) {
        var you = gameObject.you;
        /*
            data = {
                ready: true
            }
        */

        you.ready = data.ready;
        you.updateReadyIcon(data.ready);
        

    });              

    connection.on('updateThemStatus', function (data) {
        var them = gameObject.them;

        them.ready = data.ready;
        them.updateReadyIcon(data.ready);        

    });          

    this.them = {
        id: null,
        gameJoined: false,
        role: null,
        ready: false,
        currentThrow: null,

        updateReadyIcon: function (ready) {
            var readyStatus = ready ? 'Ready' : 'Not Ready';
            $('#' + this.role + ' .readyStatus').text(readyStatus);
        }
                
    },

    this.you = {
        id: null,
        gameJoined: false,
        role: null,
        ready: false,
        currentThrow: null,

        updateReadyIcon: function (ready) {
            var readyStatus = ready ? 'Ready' : 'Not Ready';
            $('#' + this.role + ' .readyStatus').text(readyStatus);
        },        

        highlight: function () {
            $('#' + this.role).addClass('you');            
        },

        actions: {
            joinGame: function(){
                connection.emit('joinGame', { gameId: gameId}); 
            },
            ready: function(){
                connection.emit('playerReady', { 
                    gameId: gameId
                }); 
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

$('#ready').click(function(){
    game.you.actions.ready();
});

//these should only be clickable when game
//status is in progress/playing or w/e i'm calling it
$('#rock').click(function(){
    game.you.actions.doThrow('r');
});

$('#paper').click(function(){
    game.you.actions.doThrow('p');
});

$('#scissors').click(function(){
    game.you.actions.doThrow('s');
});
//////////////////////////////////////////////////
