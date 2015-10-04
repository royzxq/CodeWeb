var express = require('express');
var router = express.Router();
var restrict = require('../auth/restrict');

router.get('/', function (req, res, next) {
	res.render('graph/graph',{
		layout:'graph_layout'
	});
})

router.get('/force', function(req, res, next){
	res.render('graph/force',{
		layout:'graph_layout'
	});
})

module.exports = router;