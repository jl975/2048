'use strict';

var router = require('express').Router();

var Record = require('./record.model');

var bodyParser = require('body-parser');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));

router.param('id', function(req, res, next, id) {
	Record.findById(id).exec()
	.then(function(record) {
		if (record) {
			req.record = record;
			next();
		}
		else throw HttpError(404);
	})
	.then(null, next);
})

router.get('/', function(req, res, next) {
	Record.find({}).exec()
	.then(function(records) {
		res.json(records);
	})
	.then(null, next);
});

router.get('/:id', function(req, res, next) {
	res.json(req.record);
})

router.post('/', function(req, res, next) {
	console.log('backend req.body:',req.body);
	Record.create(req.body)
	.then(function(record) {
		res.status(201).json(record);
	})
	.then(null, next);
})


module.exports = router;