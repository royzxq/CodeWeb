// var bcrypt = require('bcrypt');
var User = require('../models/user');
var Prob = require("../models/prob").Prob;

exports.addUser = function  (user, next) {
	// bcrypt.hash(user.password,10, function(err,hash){
		
		var newUser = new User({
			firstName: user.firstName,
			lastName: user.lastName,
			email: user.email.toLowerCase(),
			password: user.password,
			questions: {}
		});

		
		Prob.find({}, function(err, probs){
			if (err) {
				return next(err);
			}
			for(var p = 0 ; p < probs.length ; p++){
				// console.log(probs[p].title)
				newUser.questions[probs[p].title] = {status: false, note : ""};
			}
			newUser.save(function(err){
				if (err) {
					return next(err);
				}
				next(null);
			});
		});
		
	// });
};

exports.findUser = function(email, next){
	User.findOne({email: email.toLowerCase()}, function(err, user){
		next(err, user);
	});
};

exports.updateQuestions = function(id, prob, next){
	// console.log(id);
	// console.log(title);
	User.update({_id: id}, {$set: { questions: prob}}, function(err, user){
		// console.log(user);
		if (err) {
			return next(err);
		}
	});
}
