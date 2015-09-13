'use strict';

var router = require('express').Router();

router.use('/records', require('./records/record.router'));

module.exports = router;