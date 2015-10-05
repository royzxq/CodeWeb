var express = require('express');
var router = express.Router();
var restrict = require('../auth/restrict');

router.get('/', function (req, res, next) {
	res.render('graph/graph',{
		layout:'graph_layout',
		firstName: req.user ? req.user.firstName : null,
	});
})

router.get('/force', function(req, res, next){
	res.render('graph/force',{
		layout:'graph_layout',
		firstName: req.user ? req.user.firstName : null,
	});
})

module.exports = router;