// RPS.Instance
// RPS.Game
// RPS.Player

var RPS = {};

RPS.RPSInstance = function () {
	'use strict';
	var games = {};

	this.addGame = function (id, game) {
		if (games.hasOwnProperty(id)) {
			throw new Error('Games must have unique IDs');
		}
		games[id] = game;
		return true;
	};

	this.getGames = function () {
		//this actually exposes the real object ... not secure
		//b/c it passes a reference
		return games;
	};
};



exports.RPS = RPS;