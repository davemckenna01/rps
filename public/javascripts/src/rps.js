var Player = function (id) {
    this.id = id;
    this.joined = false;
    this.role;
    this.ready = false;
    this.currentThrow;
    //members connection and gameId are added within Game

    this.updateReadyIcon =function (ready) {
        var readyStatus = ready ? 'Ready' : 'Not Ready';
        $('#' + this.role + ' .readyStatus').text(readyStatus);
    };

    this.highlight = function () {
        $('#' + this.role).addClass('you');            
    };

    this.joinGame = function(){
        this.connection.emit('joinGame', {
           gameId: this.gameId 
        });
    };

    this.ready = function(){
    };

    this.doThrow = function(throwType){
        
        if (throwType !== 'r' && throwType !== 'p' && throwType !== 's'){
            throw new Error('Must be an "r", "p", or "s"');
        }

        console.log('I threw a', throwType)

    };

};

var Game = function () {

    var gameId = window.location.href.split('/')[window.location.href.split('/').length - 1],
        connection = io.connect('http://localhost:8000'),
        host,
        guest,
        you,
        them;

    ////////////////INIT STUFF////////////////
    connection.on('playerConnected', function (data) {

        you = new Player(data.playerId);
        you.gameId = gameId;
        you.connection = connection;

        console.log(data.message);
        console.log('I (the browser player) am now connected to node, and my id is',
                    data.playerId);

        you.joinGame();

    });

    connection.on('gameJoinSuccess', function (data) {

        console.log(data.message);
        console.log('I (the browser player) have now joined the game, ('+ gameId +')');

        you.role = data.role;
        you.highlight();

    });

    connection.on('gameJoinFailure', function (data) {
        console.log(data.message);
        console.log('I (the browser player) have failed to join the game, ('+ gameId +')');

    });        
    ///////////////////////////////////////                             
    
    connection.on('whammo', function (data) {
        console.log(data);
    });          
    
    this.updateAll = function(){
        connection.emit('updateAll', {yello: 'hiya!'});
    };      

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
