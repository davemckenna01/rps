var Player = function (id) {
    this.id = id;
    this.joined = false;
    this.role;
    this.ready = false;
    this.currentThrow;
    this.record;
    this.game;

    //members connection and gameId are added within Game
    this.connection;
    this.gameId;

    this.updateRecord = function (recordData) {
        var $recordUI = $('#' + this.role + ' .record');
        this.record = recordData;

        $recordUI.find('.wins.data').html(this.record.wins);
        $recordUI.find('.losses.data').html(this.record.losses);
        $recordUI.find('.ties.data').html(this.record.ties);

    }

    this.updateReadyIcon =function () {
        var readyStatus = this.ready ? 'Ready' : 'Not Ready';
        
        var addClass = this.ready ? 'ready' : 'notReady';
        var removeClass = !this.ready ? 'ready' : 'notReady';
        
        var $readyStatus = $('#' + this.role + ' .readyStatus');
        
        $readyStatus.removeClass(removeClass);
        $readyStatus.html(readyStatus).addClass(addClass);

    };

    this.highlight = function () {
        $('#' + this.role).addClass('you');
    };

    this.arrive = function () {
        var $inRoomIndicator = $('#' + this.role + ' .inRoomIndicator');
        $inRoomIndicator.html('In Room').removeClass('notInRoom').addClass('inRoom');
    };

    this.leave = function () {
        var $inRoomIndicator = $('#' + this.role + ' .inRoomIndicator');
        $inRoomIndicator.html('Not Here').removeClass('inRoom').addClass('notInRoom');
        $('#')
    };    

    this.imReady = function(){
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

        $('#throws').off('click', 'span', this.game.handleThrowClicks);

    };

    this.updateHand = function(throwType){
        $('#' + this.role + ' .hand').html(throwType);
    }

    this.resetHand = function(){
        $('#' + this.role + ' .hand').html('--');
    }    

};

var Game = function () {

    var gameId = window.location.href.split('/')[window.location.href.split('/').length - 1],
        connection = io.connect('http://' + document.location.host),
        that = this;
    
    this.you;

    this.them;

    this.players = {};

    this.rounds;

    //Again ... this is SO bad
    this.hasBegun;

    this.updateQuitter = function () {
        this.them.leave();
        $('#countdown').html('<span id="quitter">Your opponent left. To play again, <a href="/create">create a new game</a>.</span>')
    };

    this.highlightReadyBtn = function () {
        $('#ready').addClass('on');
    };

    this.showHelp = function (player) { 
        if (player.role === 'host') {
            $('#help').show();    
        }
    };

    this.clearCountdown = function () {
        $('#countdown').html('');
    };

    this.clearHands = function () {
        $('.hand').html('');
    };

    this.joinPlayer = function (playerId) {

        connection.emit('joinGame', {
           gameId: gameId 
        });
        
    };

    this.start = function () {

        this.initThrowClicks();

        this.executeAfterCountdown(1, 4, function(){
            $('#ready').hide();
            $('#throws').show();            
        });
                 
    };

    this.executeAfterCountdown = function (from, to, callback) {
        var countText;
        function loop(){  

            countText = from === to ? 'GO!' : from;

            $('#countdown').append('<span>' + countText + '</span>');
            
            from += 1;
            
            t = setTimeout(loop, 500);

            if (from === to + 1) {
                clearTimeout(t);
                callback();
            }
        };
        loop();
    };

    this.stop = function () {
        $('#throws span').removeClass('thrown');
        $('#ready').removeClass('on').show();
        $('#throws').hide();
        this.hasBegun = false;
    };    

    this.init = function(){
        connection.on('connectionMade', function (data) {
            that.joinPlayer(data.playerId);
            $('#connecting').css('display', 'none');
        });

        connection.on('gameJoinFailure', function (data) {
            alert('Sorry, something went wrong. You probably need to start a new game. I probably need to write better error messages.');

        });

        connection.on('opponentQuit', function () {
            that.updateQuitter();
        });        
            
    };

    this.initReadyClick = function (){
        $('#ready').bind('click', function(){
            game.you.imReady();
        });
    };

    this.initThrowClicks = function () {
        //these should only be clickable when game
        //status is in progress/playing or w/e i'm calling it
        $('#throws').on('click', 'span', this.handleThrowClicks);
    };

    this.handleThrowClicks = function (){
        game.you.doThrow($(this).attr('id'));
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
                //i.e. if it's in response to an action by the browser's user (i.e. YOU)

                console.log('that\'s you');

                youState = stateData.playerData[stateData.initiatorId];

                if (!that.you) {
                    that.you = new Player(stateData.initiatorId);
                    that.players[that.you.id] = that.you;
                    console.log('new YOU created');
                    that.initReadyClick();
                    that.initThrowClicks();
                }

                that.you.gameId = gameId;
                that.you.game = that;
                that.you.connection = connection;       

                that.you.role = youState.role;
                that.you.arrive();
                that.you.highlight();
                that.showHelp(that.you);

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
                that.them.arrive();       
                
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
                //i.e. if it's in response to an action by the browser's user (i.e. YOU)

                console.log('that\'s you');
            
                youState = stateData.playerData[stateData.initiatorId];

                that.you.ready = youState.ready;
                that.you.updateReadyIcon();
                that.highlightReadyBtn();
                that.clearHands();

            } else {
                console.log('that\'s them');
            
                themState = stateData.playerData[stateData.initiatorId];

                that.them.ready = themState.ready;
                that.them.updateReadyIcon();                
            }

            console.log(stateData);

        }
        
        if (stateData.inResponseTo === 'playerThrow') {
            //this will only ever happen if the round ended
            //(i.e. both players have registered their throw on the server)

            for (var p in stateData.playerData) {
            
                if (stateData.playerData.hasOwnProperty(p)) {

                    var playerData = stateData.playerData[p];

                    if (p === that.you.id) {
                        
                        that.you.ready = playerData.ready;
                        that.you.updateReadyIcon();
                        that.you.updateRecord(playerData.record);
                        that.you.updateHand(playerData.currentThrow);

                    } else {

                        that.them.ready = playerData.ready;
                        that.them.updateReadyIcon();
                        that.them.updateRecord(playerData.record);
                        that.them.updateHand(playerData.currentThrow);

                    }
                }

            }
            
            that.clearCountdown();
        }                  
 

    });            

    connection.on('updateGameState', function (stateData) {

        if (stateData.inResponseTo === 'playerReady') {
            //this will only ever happen if the game started on the server... kinda weak?
            console.log('Both players must now be ready so the game will start now');
            
            that.hasBegun = stateData.gameData.hasBegun;
            that.start();
            console.log(stateData);
        }          

        if (stateData.inResponseTo === 'playerThrow') {
            //this will only ever happen if the round ended
            //(i.e. both players have registered their throw on the server)

            //So here we must:

            //clear the throw selection
            //hide throw options and show ready btn
            that.stop();
            that.rounds = stateData.gameData.rounds;
        
            console.log(stateData);
        }                  

    });

}

var game = new Game();
game.init();

