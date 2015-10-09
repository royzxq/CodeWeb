var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var userService = require('../service/user-service');
var Schema = mongoose.Schema;



var userSchema = new Schema({
	firstName: {type:String, required: 'Please enter your first name'},
	lastName: {type:String, required: 'Please enter your last name'},
	email: {type:String, required: 'Please enter your email'},
	password: {type:String, required: 'Please enter your password'},
	created: {type: Date, default: Date.now},
  GENERATED_VERIFYING_URL: String,
  questions: {}
}, {collection: "temp_user"});



// userSchema.path('email').validate(function(value, next) {
//   userService.findUser(value, function(err, user) {
//     if (err) {
//       // console.log(err);
//       return next(false);
//     }
//     next(!user);
//   });
// }, 'That email is already in use');


userSchema.path('email').validate(function(value,next){
  var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
  return next(re.test(value));
}, 'Invalid email');


userSchema.methods.generateHash = function(password){
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
}

userSchema.methods.validPassword = function(password){
  return bcrypt.compareSync(password,this.password);
}
// userSchema.path('password').validate(function(value){
//   return value.length > 6;
// }, "password length should be greater than 6");

var User = mongoose.model('TempUser', userSchema);

module.exports = User;