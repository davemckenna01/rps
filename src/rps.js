var RPS = function () {
    'use strict';

    var that = this,
        games = {},
        players = {};

    this.getGames = function () {
        return games;
    };

    this.getPlayers = function () {
       return players; 
    };

    //////////////////////
    //No unit test for this
    this.deletePlayer = function (id) {
        delete players[id];
    }

    //////////////////////
    //No unit test for this
    this.deleteGame = function (id) {
        var game = games[id];
        if (game) {
            for (var p in game.getPlayers()) {
                if (game.getPlayers().hasOwnProperty(p)) {
                    this.deletePlayer(p);
                }
            }
            delete games[id];
        }
    }    

    this.Game = function (id) {
        var gamePlayers = {},
            rounds = 0,
            //This wording is terrible, change to status or something less awkward
            hasBegun,
            playerThrows,
            results,
            host,
            guest;

        function initGameProps() {
            hasBegun = false;
            playerThrows = {};
            results = {};
        }

        initGameProps();

        if (arguments.length <= 0 || typeof id !== 'string') {
            throw new Error('Game() takes exactly 1 string arg');
        }

        if (games.hasOwnProperty(id)) {
            throw new Error('Game IDs must be unique');
        } else {
            games[id] = this;
        }

        this.getId = function () {
            return id;
        };

        this.addPlayer = function (player) {
            if (arguments.length <= 0 || !(player instanceof that.Player)) {
                throw new Error('addPlayer() takes exactly 1 arg of type Player');
            }

            //NO TEST YET!
            if (gamePlayers.hasOwnProperty(player.getId())) {
                throw new Error('This player is in the game already.');
            }

            if (Object.keys(gamePlayers).length >= 2) {
                throw new Error('Games may take a max of 2 Players');
            } else {
                if (Object.keys(gamePlayers).length === 0) {
                    player.setRole('host');
                    host = player;
                } else {
                    player.setRole('guest');
                    guest = player;
                }
                
                gamePlayers[player.getId()] = player;
            }

        };

        this.getPlayers = function () {
            return gamePlayers;
        };

        this.isReady = function () {
            var ready,
                keys = Object.keys(gamePlayers);

            if (keys.length < 2) {
                ready = false;
            } else if (!(gamePlayers[keys[0]].isReady() && gamePlayers[keys[1]].isReady())) {
                ready = false;
            } else if (gamePlayers[keys[0]].isReady() && gamePlayers[keys[1]].isReady()) {
                ready = true;
            }

            return ready;
        };

        this.start = function () {
            if (!this.isReady()) {
                return false;
            } else {
                hasBegun = true;

                //re-initializing (clearing) obj to keep track of
                //player throws
                playerThrows = {};

                return true;
            }
        };

        this.hasBegun = function () {
            return hasBegun;
        };

        this.getPlayerThrows = function () {
            return playerThrows;
        };

        this.registerThrow = function (player, throwRPS) {
            if (!this.hasBegun()) {
                return false;
            }

            if (arguments.length !== 2 || (typeof player !== 'string' && typeof throwRPS !== 'string')) {
                throw new Error('submitThrow() takes exactly 2 string args');
            }

            if (!(this.getPlayers().hasOwnProperty(player))) {
                throw new Error('That player is not playing in this game.');
            }

            if (throwRPS !== 'r' && throwRPS !== 'p' && throwRPS !== 's') {
                throw new Error('Must be either an "r", "p", or "s"');
            }

            if (!playerThrows[player]) {
                playerThrows[player] = throwRPS;
            }

            //detecting when to 'end' the game. If the second throw
            //has come in, then we can end it, i.e. the round is over.
            if (Object.keys(playerThrows).length === 2) {
                //This smells funny
                this.endRound();
            }

            return true;
        };

        //This smells funny
        this.endRound = function () {
            hasBegun = false;
            results = this.determineWinner(playerThrows);

            if (results === 'tie') {
                gamePlayers[Object.keys(gamePlayers)[0]].updateRecord('ties');
                gamePlayers[Object.keys(gamePlayers)[1]].updateRecord('ties');
                //return results;
            } else {
                gamePlayers[results.winner].updateRecord('wins');
                gamePlayers[results.loser].updateRecord('losses');
            }

            rounds += 1;
        };

        this.determineWinner = function (pThrows) {
            var p1 = Object.keys(pThrows)[0],
                p1Throw = pThrows[Object.keys(pThrows)[0]],
                p2 = Object.keys(pThrows)[1],
                p2Throw = pThrows[Object.keys(pThrows)[1]];

            if (arguments.length <= 0) {
                throw new Error('determineWinner takes exactly 1 arg.');
            }

            if (Object.keys(pThrows).length !== 2) {
                throw new Error('There are not enough throws in this object.');
            }

            switch (p1Throw) {
            case 'r':
                if (p2Throw === 'r') {return 'tie'; }
                if (p2Throw === 'p') {return {winner: p2, loser: p1}; }
                if (p2Throw === 's') {return {winner: p1, loser: p2}; }
                break;

            case 'p':
                if (p2Throw === 'r') {return {winner: p1, loser: p2}; }
                if (p2Throw === 'p') {return 'tie'; }
                if (p2Throw === 's') {return {winner: p2, loser: p1}; }
                break;

            case 's':
                if (p2Throw === 'r') {return {winner: p2, loser: p1}; }
                if (p2Throw === 'p') {return {winner: p1, loser: p2}; }
                if (p2Throw === 's') {return 'tie'; }
                break;

            }
        };

        this.getRounds = function () {
            return rounds;
        };

        this.getResults = function () {
            return results;
        };

        this.again = function () {
            initGameProps();
            gamePlayers[Object.keys(gamePlayers)[0]].again();
            gamePlayers[Object.keys(gamePlayers)[1]].again();
        };

        this.getHost = function () {
            return host;
        };

        this.getGuest = function () {
            return guest;
        };

        ////////////////////////////////
        //Not tested
        this.updatePlayerStates = function(initiatorId, inResponseTo) {

            var allPlayerData = {};

            for (var key in this.getPlayers()){
                if (this.getPlayers().hasOwnProperty(key)) {
                    
                    var player = this.getPlayers()[key];

                    allPlayerData[player.getId()] = {};
                    allPlayerData[player.getId()].ready = player.isReady();   
                    allPlayerData[player.getId()].role = player.getRole();
                    allPlayerData[player.getId()].record = player.getRecord();
                    allPlayerData[player.getId()].currentThrow = player.getCurrentThrow();
                }                
            }            

            for (var key in this.getPlayers()){
                if (this.getPlayers().hasOwnProperty(key)) {
                    
                    var player = this.getPlayers()[key];

                    player.getSocket().emit('updatePlayerStates', {
                        inResponseTo: inResponseTo,
                        initiatorId: initiatorId,
                        playerData: allPlayerData
                    });

                }
            }  
                      
        }

        ////////////////////////////////
        //Not tested
        this.updateGameState = function(initiatorId, inResponseTo) {

            var gameData = {
                ready: this.isReady(),
                hasBegun: this.hasBegun(),
                rounds: this.getRounds()
            }

            for (var key in this.getPlayers()){
                if (this.getPlayers().hasOwnProperty(key)) {
                    
                    var player = this.getPlayers()[key];

                    player.getSocket().emit('updateGameState', {
                        inResponseTo: inResponseTo,
                        initiatorId: initiatorId,
                        gameData: gameData
                    });

                }
            }  
                      
        }
                
    };

    this.Player = function (id) {
        var ready = false,
            record = {
                'wins': 0,
                'losses': 0,
                'ties': 0
            },
            role,
            socket,
            currentThrow;

        if (arguments.length <= 0 || typeof id !== 'string') {
            throw new Error('Player() takes exactly 1 string arg');
        }

        if (players.hasOwnProperty(id)) {
            throw new Error('Player IDs must be unique');
        } else {
            players[id] = this;
        }

        this.getId = function () {
            return id;
        };

        this.isReady = function () {
            return ready;
        };

        this.ready = function () {
            ready = true;
        };

        this.getRecord = function () {
            return record;
        };

        this.updateRecord = function (type) {
            record[type] += 1;
        };

        this.again = function () {
            ready = false;
        };

        this.setRole = function(r){
            if (r !== 'host' && r !== 'guest'){
                throw new Error ('Role can only be "host" or "guest"')
            }
            role = r;
        }

        this.getRole = function(){
            return role;
        }

        this.setSocket = function(s){
            socket = s;
        }

        this.getSocket = function(){
            return socket;
        }

        this.setCurrentThrow = function(t){
            currentThrow = t;
        }

        this.getCurrentThrow = function(){
            return currentThrow;
        }        

    };
    
    ///////////////
    //Not Tested
    this.connectionManager = {
        init: function (io) {
            io.sockets.on('connection', function (socket) {
                var player = new that.Player(socket.id);
                player.setSocket(socket);

                socket.emit('connectionMade', {
                    playerId: player.getId()
                });

                socket.on('joinGame', function (data) {

                    var game = that.getGames().hasOwnProperty(data.gameId) ? that.getGames()[data.gameId] : null;

                    if (game) {

                        try {
                            game.addPlayer(player);

                            game.updatePlayerStates(player.getId(), 'joinGame');

                            if (Object.keys(game.getPlayers()).length === 2){
                                //faking the host joining the game, just to update UI
                                //kinda wack i know...
                                game.updatePlayerStates(game.getHost().getId(), 'joinGame');
                            }

                        } catch (e) {
                            socket.emit('gameJoinFailure');
                            //delete the player object we created, since it'll never join a game
                            that.deletePlayer(player.getId());
                        }

                    } else {
                        socket.emit('gameJoinFailure');
                        //delete the player object we created, since it'll never join a game
                        that.deletePlayer(player.getId());

                    }

                    socket.on('playerReady', function(){
                        try {
                            player.ready();

                            game.updatePlayerStates(player.getId(), 'playerReady');

                            if (game.isReady()){
                                game.start();
                                game.updateGameState(player.getId(), 'playerReady');
                            }
                        } catch (e) {
                            console.log(e.message);
                        }     
                    });     
                    
                    socket.on('playerThrow', function(data){
                        try {
                            player.setCurrentThrow(data.playerThrow);
                            game.registerThrow(player.getId(), player.getCurrentThrow());

                            if (!game.hasBegun()){
                                game.again();//can probably call this from within the game...
                                //since they games will always loop back to again
                                //i.e. the players won't have to say "let's go again!" or anything...

                                game.updatePlayerStates(player.getId(), 'playerThrow');
                                game.updateGameState(player.getId(), 'playerThrow');
                            }
                        } catch (e) {
                            console.log(e.message);
                        }                        
                    });                                        

                    socket.on('disconnect', function (data) {
                        var players,
                            p,
                            remainingPlayer;
                        if (game) {
                            players = game.getPlayers();
                            if (Object.keys(players).length === 2) {
                                //If game only had 1 player, then there was no opponent, that's why
                                //we check for 2

                                //The player that is NOT socket.id should emit the "opponentQuit" event
                                for (p in players) {
                                    if (players.hasOwnProperty(p)) {
                                        if (p !== socket.id) {
                                            remainingPlayer = players[p];
                                        }
                                    }
                                }
                                remainingPlayer.getSocket().emit('opponentQuit');
                            }
                            that.deleteGame(game.getId());
                        }
                    });

                });
            });
        }
    };
};

exports.RPS = RPS;