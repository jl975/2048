'use strict';

var mongoose = require('mongoose');

var scoreboard = require('../../scoreboard');

var validPower = [
	function(value) {
		return (Math.log(value)/Math.log(2))%1 === 0;
	}
];

var Record = new mongoose.Schema({
	name: {
		type: String
	},
	highest: {
		type: Number,
		validate: validPower,
		required: true
	},
	score: {
		type: Number,
		required: true
	}
});

module.exports = scoreboard.model('Record', Record);