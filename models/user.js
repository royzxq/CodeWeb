var mongoose = require('mongoose');
var userService = require('../service/user-service');
var Schema = mongoose.Schema;

function length_val(v) {
  return v.length >= 6;
};

var userSchema = new Schema({
	firstName: {type:String, required: 'Please enter your first name'},
	lastName: {type:String, required: 'Please enter your last name'},
	email: {type:String, required: 'Please enter your email'},
	password: {type:String, required: 'Please enter your password'},
	created: {type: Date, default: Date.now},
  questions: {}
}, {collection: "user"});



userSchema.path('email').validate(function(value, next) {
  userService.findUser(value, function(err, user) {
    if (err) {
      // console.log(err);
      return next(false);
    }
    next(!user);
  });
}, 'That email is already in use');

// userSchema.path('password').validate(function(value){
//   return value.length > 6;
// }, "password length should be greater than 6");

var User = mongoose.model('User', userSchema);

module.exports = User;