'use strict';

var app = require('./app/app'),
	scoreboard = require('./scoreboard');

var port = 2048;
var server = app.listen(port, function(){
	console.log('Successfully connected to port',port);
});

module.exports = server;