var express = require('express');
var router = express.Router();
var restrict = require('../auth/restrict');

router.get('/', function (req, res, next) {
	res.render('graph');
})

module.exports = router;