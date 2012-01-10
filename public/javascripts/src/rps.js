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
        this.connection.emit('playerReady');        
    };

    this.doThrow = function(throwType){
        
        if (throwType !== 'r' && throwType !== 'p' && throwType !== 's'){
            throw new Error('Must be an "r", "p", or "s"');
        }

        console.log('I, (', this.id, ') threw a', throwType);

        this.connection.emit('playerThrow', {
            playerThrow: throwType
        });

        $('#' + throwType).addClass('thrown');

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

    //Again ... this is SO bad
    this.hasBegun;

    this.joinPlayer = function (playerId) {

        connection.emit('joinGame', {
           gameId: gameId 
        });
        
    };

    this.start = function () {

        this.executeAfterCountdown(1, 1, function(){
            $('#ready').hide();
            $('#throws').show();            
        });
                 
    };

    this.executeAfterCountdown = function (from, to, callback) {
        function loop(){  
            console.log(from);
            
            from += 1;
            
            t = setTimeout(loop, 1000);

            if (from === to + 1) {
                clearTimeout(t);
                console.log('over');
                callback();
            }
        };
        loop();
    };

    this.stop = function () {
        $('#ready').show();
        $('#throws').hide();
        this.hasBegun = false;
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
        $('#r').click(function(){
            game.you.doThrow('r');
        });

        $('#p').click(function(){
            game.you.doThrow('p');
        });

        $('#s').click(function(){
            game.you.doThrow('s');
        });        
    }; 

    connection.on('updatePlayerStates', function (stateData) {
        //There's a bunch of duplication happening here - need to 
        //clean it up... filter so that we're only updating player
        //objects that actually should be need to be updated.
        //Devil's advocate: but maybe that's a good design decision ... it
        //ensures state is always most current.
        //Maybe just need better console log messages???

        var youState,
            themState;

        if (stateData.inResponseTo === 'joinGame') {
            console.log('Player', stateData.initiatorId, 'just joined the game.');

            if (stateData.initiatorId === connection.socket.sessionid) {
                console.log('that\'s you');

                youState = stateData.playerData[stateData.initiatorId];

                if (!that.you) {
                    that.you = new Player(stateData.initiatorId);
                    that.players[that.you.id] = that.you;
                    console.log('new YOU created');
                    that.initButtons();
                }

                that.you.gameId = gameId;
                that.you.connection = connection;         

                that.you.role = youState.role;
                that.you.indicateInRoom();
                that.you.highlight();

            } else {
                console.log('that\'s them');

                themState = stateData.playerData[stateData.initiatorId];

                if (!that.them) {
                    that.them = new Player(stateData.initiatorId);
                    that.players[that.them.id] = that.them;
                    console.log('new THEM created');
                }

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
            
            that.hasBegun = stateData.gameData.hasBegun;
            that.start();
            console.log(stateData);
        }          

    });

}

var game = new Game();
game.init();

