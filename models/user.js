var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var userSchema = new Schema({
	firstName: {type:String, required: 'Please enter your first name'},
	lastName: {type:String, required: 'Please enter your last name'},
	email: {type:String, required: 'Please enter your email'},
	password: {type:String, required: 'Please enter your password'},
	created: {type: Date, default: Date.now},
  questions: {}
}, {collection: "user"});



var User = mongoose.model('User', userSchema);

module.exports = User;