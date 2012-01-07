var RPS = function () {
    'use strict';

    var that = this,
        games = {},
        players = {};

    this.Game = function (id) {
        var gamePlayers = {},
            rounds = 0,
            inProgress,
            playerThrows,
            results;

        function initGameProps() {
            inProgress = false;
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
                gamePlayers[player.getId()] = player;
            }
        };

        this.getPlayers = function () {
            return gamePlayers;
        };

        this.isReady = function () {
            var ready = null,
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
                inProgress = true;

                //re-initializing (clearing) obj to keep track of
                //player throws
                playerThrows = {};

                return true;
            }
        };

        this.isInProgress = function () {
            return inProgress;
        };

        this.getPlayerThrows = function () {
            return playerThrows;
        };

        this.registerThrow = function (player, throwRPS) {
            if (!this.isInProgress()) {
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
            inProgress = false;
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
    };

    this.Player = function (id) {
        var ready = false,
            record = {
                'wins': 0,
                'losses': 0,
                'ties': 0
            };

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
    };
};

exports.RPS = RPS;