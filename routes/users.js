var express = require('express');
var router = express.Router();
var passport = require('passport');
var userService = require('../service/user-service');



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
			console.log(err);
			var vm = {
				title: "create an account",
				err: err
			};
			delete req.body.password;
			return res.render('users/create',vm);
		}
	});
	req.login(req.body,function(err){
		res.redirect('/');
	});
});

router.get('/login', function(req, res, next){
	res.render('users/login');
})

router.post('/login', function(req, res, next){
	next();	
}, passport.authenticate('local',{
	failureRedirect: 'login', 
    successRedirect:'/',
    // failureFlash: 'Invalid credentials'
}));

router.get('/logout', function(req, res, next){
	req.logout();
	res.redirect('/');
})

module.exports = router;
