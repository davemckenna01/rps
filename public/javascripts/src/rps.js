var Player = function (id) {
    this.id = id;
    this.joined = false;
    this.role;
    this.ready = false;
    this.currentThrow;
    //members connection and gameId are added within Game

    this.updateReadyIcon =function () {
        var readyStatus = this.ready ? 'Ready' : 'Not Ready';
        $('#' + this.role + ' .readyStatus').text(readyStatus);
    };

    this.highlight = function () {
        $('#' + this.role).addClass('you');            
    };

    this.indicateInRoom = function () {
        $('#' + this.role + ' h2 .inRoomIndicator').text(' # ' + this.id);
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
        connection = io.connect('http://localhost:8000'),
        that = this;
    
    this.con = connection;
    
    this.you;

    this.them;

    this.players = {};

    this.hasBegun;

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

    connection.on('updatePlayerStates', function (stateData) {
        var youState,
            themState;

        if (stateData.inResponseTo === 'joinGame') {
            console.log('Player', stateData.initiatorId, 'just joined the game.');

            if (stateData.initiatorId === connection.socket.sessionid) {
                console.log('that\'s you');

                youState = stateData.playerData[stateData.initiatorId];

                that.you = new Player(stateData.initiatorId);

                that.players[that.you.id] = that.you;

                that.you.gameId = gameId;
                that.you.connection = connection;         

                that.you.role = youState.role;
                that.you.indicateInRoom();
                that.you.highlight();

                that.initButtons();

            } else {
                console.log('that\'s them');

                themState = stateData.playerData[stateData.initiatorId];

                that.them = new Player(stateData.initiatorId);

                that.players[that.them.id] = that.them;

                that.them.gameId = gameId;
                that.them.connection = connection;

                that.them.role = themState.role;
                that.them.indicateInRoom();       
                
                if (themState.ready){
                    that.them.ready = themState.ready;
                    that.them.updateReadyIcon();
                }
            }

            console.log(stateData);

        }

        if (stateData.inResponseTo === 'playerReady') {
            console.log('Player', stateData.initiatorId, 'is now ready.');
            
            if (stateData.initiatorId === connection.socket.sessionid) {
                console.log('that\'s you');
            
                youState = stateData.playerData[stateData.initiatorId];

                that.you.ready = youState.ready;
                that.you.updateReadyIcon();

            } else {
                console.log('that\'s them');
            
                themState = stateData.playerData[stateData.initiatorId];

                that.them.ready = themState.ready;
                that.them.updateReadyIcon();                
            }

            console.log(stateData);

        }        

    });            

    connection.on('updateGameState', function (stateData) {

        if (stateData.inResponseTo === 'playerReady') {
            console.log('Both players must now be ready so the game will start now');
            
            console.log(stateData);
        }          

    });

}

var game = new Game();
game.init();

