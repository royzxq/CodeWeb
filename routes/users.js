var express = require('express');
var router = express.Router();
var passport = require('passport');
var userService = require('../service/user-service');
var config = require("../config");


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/create', function(req, res, next){
	var vm = {
		title: "Create an account"
	};
	res.render('users/create',vm);
})

router.post('/create', function(req, res, next){
	userService.addUser(req.body, function(err){
		if (err) {
			// console.log(err);
			var error = []
			for(var x in err.errors){
				error.push(err.errors[x].message);
			}
			// console.log(error);
			var vm = {
				title: "create an account",
				error: error
			};
			// delete req.body.password;
			return res.render('users/create',vm);
		}
		req.login(req.body,function(err){
			if (err) {
				res.redirect('users/create');
			}
			res.redirect('/');
		});
	});
	
});

router.get('/login', function(req, res, next){
	var vm = {
	    title : "OJ Integration",
	    firstName: req.user ? req.user.firstName : null,
	    error : req.flash('error')
	  }
	res.render('users/login', vm);
})

router.post('/login', function(req, res, next){
	if(req.body.rememberMe){
		req.session.cookie.maxAge = config.cookieMaxAge;
	}
	next();	
}, passport.authenticate('local',{
	failureRedirect: 'login', 
    successRedirect:'/',
    failureFlash: 'Wrong username or password'
}));

router.get('/logout', function(req, res, next){
	req.logout();
	req.session.destroy();
	res.redirect('/');
})

module.exports = router;
