var express = require('express');
var router = express.Router();
var restrict = require('../auth/restrict');

router.get('/graph/:layout', function (req, res, next) {
	var lo = req.params.layout;
	if (lo === "force") {
		res.render('graph/graph',{
			layout:'graph_layout',
			firstName: req.user ? req.user.firstName : null,
		});
	}
	else if(lo === "fruch"){
		res.render('graph/graph_fruch',{
			layout:'graph_layout',
			firstName: req.user ? req.user.firstName : null,
		});
	}
	else{
		res.render('index',{
			firstName: req.user ? req.user.firstName : null,
		});
	}	
});

router.get('/force', function(req, res, next){
	res.render('graph/force',{
		layout:'graph_layout',
		firstName: req.user ? req.user.firstName : null,
	});
})

module.exports = router;