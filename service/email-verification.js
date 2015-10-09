var nev = require('email-verification');

var User = require('../models/user');
var TempUser = require('../models/temp_user');
var config = require('../config');
var url;
if (process.env.NODE_ENV === 'production') {
    url = "https://morning-basin-5736.herokuapp.com/users/email-verification/${URL}";
}
else{
  url = "http://localhost:3000/users/email-verification/${URL}";
}
var from = "Do Not Reply <" + config.emailUser + ">";
nev.configure({
  verificationURL: url,
  persistentUserModel: User,
  expirationTime: 600,
  tempUserModel: TempUser,
  transportOptions:{
    service: 'Gmail',
    auth:{
      user: config.emailUser,
      pass: config.emailPass
    }
  },
  verifyMailOptions:{
    from: from,
    subject: "Please confirm accout",
    html: "Click the following link to confirm your account:</p><p>${URL}</p>",
    text: 'Please confirm your account by clicking the following link: ${URL}'
  }
});

module.exports = nev;
