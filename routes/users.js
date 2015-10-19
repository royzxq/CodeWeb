var express = require('express');
var router = express.Router();
var passport = require('passport');
var userService = require('../service/user-service');
var config = require("../config");
var nev = require("../service/email-verification");
var User = require('../models/user');
var bcrypt = require('bcrypt');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/create', function(req, res, next){
	// console.log(req.session);
	var vm = {
		title: "Create an account",
		first_name: req.session.flash.msg ? req.session.flash.msg.firstName:null,
		lastName: req.session.flash.msg ? req.session.flash.msg.lastName:null,
		email: req.session.flash.msg ? req.session.flash.msg.email:null,
		resend: req.session.flash.msg ? req.session.flash.msg.resend: false,
		msg: req.session.flash.msg ? req.session.flash.msg.msg: null
	};
	// delete req.session.flash.msg;
	req.session.flash.msg = {};
	// console.log(req.session.flash.msg);
	res.render('users/create',vm);
})

router.post('/create', function(req, res, next){
	
	if (req.body.type === "register") {
		userService.findUser(req.body.email, function(err, user){
			if (err) {
				res.status(500).json({status:"failure"});
			}
			if (user) {
				return res.render('users/create',{error: "email already in use, please change another one"});
			}
			bcrypt.hash(req.body.password, 10, function(err, hash){
				var newUser = new User({
					email: req.body.email,
					password: hash,
					firstName: req.body.firstName,
					lastName : req.body.lastName,
					questions: {}
				});
				nev.createTempUser(newUser,function(newTempUser){
					
					if (newTempUser) {
						// newTempUser.password = newTempUser.generateHash(newTempUser.password);
						// console.log(newTempUser);
						nev.registerTempUser(newTempUser);
						console.log("An email has been sent to you. Please check it to verify your account.");
						// res.json({msg:"An email has been sent to you. Please check it to verify your account."});
						var tmp = {
							msg:"An email has been sent to you. Please check it to verify your account.",
							resend: true,
							firstName: req.body.firstName,
							lastName: req.body.lastName,
							email: req.body.email
						};
						req.session.flash.msg = tmp;
						// res.render('users/create',tmp);
						res.redirect('/users/create');

					}
					else{
						res.redirect('/users/create');
					}
				})
			});
		}) 
		
		
	}
	else{
		nev.resendVerificationEmail(req.body.email, function(userFound) {
			var tmp = {
				resend: true,
				firstName: req.body.firstName,
				email: req.body.email,
				lastName: req.body.lastName
			};
            if (userFound) {
                tmp.msg = 'An email has been sent to you, yet again. Please check it to verify your account.';
            } else {
                tmp.msg = 'Your verification code has expired. Please sign up again.';
            }
            req.session.flash.msg = tmp;
            res.redirect('/users/create');
        });
	}
	
});

router.get('/email-verification/:URL', function(req,res, next){
	var url = req.params.URL;
	nev.confirmTempUser(url, function(user){
		if (user) {
			userService.addUser(user, function(err){
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
				req.login(user, function(err){
					if (err) {
						return res.redirect('/users/create');
					}
					res.redirect('/');
				});
			});
		}

	})
})

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
	// req.session.destroy();
	// console.log(req.session);
	res.render('index', {firstName: null});
})

router.get('/getUser', function(req, res, next){
	if(req.user){
		res.json(req.user);
	}
	else{
		res.json(null);
	}
})

router.post("/mark", function(req, res, next){
	if (req.body.user && req.body.prob) {
		// console.log(req.body.user.email);
		// console.log(req.body.prob.title);
		userService.updateQuestions(req.body.user._id, req.body.prob, function(err){
			if (err) {
				console.log(err);
				res.status(500).json(err);
			}
		})
	}
});
module.exports = router;
