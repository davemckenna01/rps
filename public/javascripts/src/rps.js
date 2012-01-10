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

    this.indicateInRoom = function () {
        $('#' + this.role + ' h2').append(' # ' + this.id);
    };

    this.ready = function(){
        console.log('ready');
        this.connection.emit('playerReady');        
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
        connection = io.connect('http://localhost:8000');

    var that = this;
    this.con = connection;
    
    this.you;

    this.them;

    this.players = {};

    this.joinPlayer = function (playerId) {

        connection.emit('joinGame', {
           gameId: gameId 
        });
        
    };

    this.updateAll = function(){
        connection.emit('updateAll', {yello: 'hiya!'});
    };    

    this.init = function(){
        connection.on('connectionMade', function (data) {

            that.joinPlayer(data.playerId);

        });

        connection.on('gameJoinFailure', function (data) {
            console.log(data.message);
            console.log('I (the browser player) have failed to join the game, ('+ gameId +')');

        });
            
    };

    this.initButtons = function (){
        $('#ready').click(function(){
            game.you.ready();
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
    }; 

    connection.on('updatePlayerStates', function (data) {

        if (data.inResponseTo === 'joinGame') {
            console.log('Player', data.initiatorId, 'just joined the game.');

            if (data.initiatorId === game.con.socket.sessionid) {
                console.log('that\'s you');

                that.you = new Player(data.initiatorId);

                that.players[that.you.id] = that.you;

                that.you.gameId = gameId;
                that.you.connection = connection;         

                that.you.role = data.playerData[data.initiatorId].role;
                that.you.indicateInRoom();
                that.you.highlight();
            } else {
                console.log('that\'s them');

                that.them = new Player(data.initiatorId);

                that.players[that.them.id] = that.them;

                that.them.gameId = gameId;
                that.them.connection = connection;         

                that.them.role = data.playerData[data.initiatorId].role;
                that.them.indicateInRoom();
                that.them.highlight();                
            }

            that.initButtons();
            console.log(data);

        }

    });            

}

var game = new Game();
game.init();

