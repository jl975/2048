'use strict';

var app = require('express')();

var path = require('path');

var Promise = require('bluebird');


app.use(require('./statics.middleware'));

app.use('/api', require('../api/api.router'));


var pathToIndex = path.join(__dirname, '..', '..', 'public', 'index.html');

app.get('/records', function(req, res, next){
	res.redirect('/');
})

// app.get('/', function(req, res, next) {
// 	res.sendFile(pathToIndex);
// });



module.exports = app;