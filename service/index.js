"use strict";

var randtoken = require('rand-token'),
    mongoose = require('mongoose'),
    nodemailer = require('nodemailer');
    // wellknown = require('nodemailer-wellknown');
    // config = require('../../config');
// mongoose.connect(config.mongoUri); // needed for testing

/**
 * Retrieve a nested value of an object given a string, using dot notation.
 *
 * @func getNestedValue
 * @param {object} obj - object to retrieve the value from
 * @param {string} path - path to value
 * @param {string} def - default value to return if not found
*/
var getNestedValue = function(obj, path, def){
    var i, len;

    for(i = 0,path = path.split('.'), len = path.length; i < len; i++){
        if(!obj || typeof obj !== 'object') return def;
        obj = obj[path[i]];
    }

    if(obj === undefined)
        return def;
    return obj;
};


// default options
var options = {
    verificationURL: 'http://example.com/email-verification/${URL}',
    URLLength: 48,

    //mongo-stuff
    persistentUserModel: null,
    tempUserModel: null,
    tempUserCollection: 'temporary_users',
    emailFieldName: 'email',
    URLFieldName: 'GENERATED_VERIFYING_URL',
    expirationTime: 86400,

    // emailing options
    transportOptions: {
        service: "Gmail",
        auth: {
            user: 'user@gmail.com',
            pass: 'password'
        }
    },
    verifyMailOptions: {
        from: 'Do Not Reply <user@gmail.com>',
        subject: 'Confirm your account',
        html: '<p>Please verify your account by clicking <a href="${URL}">this link</a>. If you are unable to do so, copy and ' +
                'paste the following link into your browser:</p><p>${URL}</p>',
        text: 'Please verify your account by clicking the following link, or by copying and pasting it into your browser: ${URL}'
    },
    verifySendMailCallback: function(err, info) {
        if (err) throw err;
        else console.log(info.response);
    },
    sendConfirmationEmail: true,
    confirmMailOptions: {
        from: 'Do Not Reply <user@gmail.com>',
        subject: 'Successfully verified!',
        html: '<p>Your account has been successfully verified.</p>',
        text: 'Your account has been successfully verified.'
    },
    confirmSendMailCallback: function(err, info) {
        if (err) throw err;
        else console.log(info.response);
    },
};


var transporter = nodemailer.createTransport(options.transportOptions);


/**
 * Modify the default configuration.
 *
 * @func configure
 * @param {object} o - options to be changed
*/
var configure = function(o) {
    for (var key in o)
        options[key] = o[key];
    transporter = nodemailer.createTransport(options.transportOptions);
};


/**
 * Create a Mongoose Model for the temporary user, based off of the persistent
 * User model, i.e. the temporary user inherits the persistent user. An
 * additional field for the URL is created, as well as a TTL.
 *
 * @func generateTempUserModel
 * @param {object} User - the persistent User model.
*/
var generateTempUserModel = function(User) {
    var tempUserSchemaObject = {}, // a copy of the schema
        tempUserSchema, tempUserModel;

    // copy over the attributes of the schema
    Object.keys(User.schema.paths).forEach(function(field) {
        tempUserSchemaObject[field] = User.schema.paths[field].options;
    });
    tempUserSchemaObject[options.URLFieldName] = String;

    // create a TTL
    tempUserSchemaObject.createdAt = {type: Date, expires: options.expirationTime.toString() + 's', default: Date.now};

    tempUserSchema = mongoose.Schema(tempUserSchemaObject);

    // copy over the methods of the schema
    Object.keys(User.schema.methods).forEach(function(meth) { // tread lightly 
        tempUserSchema.methods[meth] = User.schema.methods[meth];
    });
    
    options.tempUserModel = mongoose.model(options.tempUserCollection, tempUserSchema);
};


/**
 * Attempt to create an instance of a temporary user based off of an instance of a
 * persistent user. If user already exists in the temporary collection, passes null
 * to the callback function; otherwise, passes the instance to the callback, with a
 * randomly generated URL associated to it.
 *
 * @func createTempUser
 * @param {object} user - an instance of the persistent User model
 * @return {object} null if user already exists; Mongoose Model instance otherwise
*/
var createTempUser = function(user, callback) {
    if (!options.tempUserModel)
        throw new TypeError("Temporary user model not defined. Either you forgot to generate one or you did not predefine one.");

    var query = {};
    query[options.emailFieldName] = user[options.emailFieldName];
    options.tempUserModel.findOne(query, function(err, existingUser) {
        if (err)
            throw err;
        // user has already signed up...
        if (existingUser)
            callback(null);

        else {
            var tempUserData = {},
                newTempUser;

            // copy the credentials for the user
            Object.keys(user._doc).forEach(function(field) {
                tempUserData[field] = user[field];
            });
            tempUserData[options.URLFieldName] = randtoken.generate(options.URLLength);
            callback(new options.tempUserModel(tempUserData));
        }
    });
};


/**
 * Send an email to the user requesting confirmation.
 *
 * @func sendVerificationEmail
 * @param {string} email - the user's email address.
 * @param {string} url - the unique url generated for the user.
*/
var sendVerificationEmail = function(email, url) {
    var r = /\$\{URL\}/g;

    // inject newly-created URL into the email's body and FIRE

    var URL = options.verificationURL.replace(r, url),
        mailOptions = JSON.parse(JSON.stringify(options.verifyMailOptions));
    mailOptions.to = email;
    mailOptions.html = mailOptions.html.replace(r, URL);
    mailOptions.text = mailOptions.text.replace(r, URL);


    transporter.sendMail(mailOptions, options.verifySendMailCallback);
};


/**
 * Save the user to the temporary collection, and send an email to the user
 * requesting confirmation.
 *
 * @func registerTempUser
 * @param {object} newTempUser - an instance of the temporary user model
*/
var registerTempUser = function(newTempUser) {
    var r = /\$\{URL\}/g;
    newTempUser.save(function(err) {
        if (err)
            throw err;
        sendVerificationEmail(getNestedValue(newTempUser, options.emailFieldName),
            newTempUser[options.URLFieldName]);
    });
};


/**
 * Transfer a temporary user from the temporary collection to the persistent
 * user collection, removing the URL assigned to it.
 *
 * @func confirmTempUser
 * @param {string} url - the randomly generated URL assigned to a unique email
*/
var confirmTempUser = function(url, callback) {
    var TempUser = options.tempUserModel,
        query = {};
    query[options.URLFieldName] = url;

    TempUser.findOne(query, function(err, tempUserData) {
        if (err)
            throw err;

        // temp user is found (i.e. user accessed URL before their data expired)
        if (tempUserData) {
            var userData = JSON.parse(JSON.stringify(tempUserData)), // copy data
                User = options.persistentUserModel,
                user;

            delete userData[options.URLFieldName];

            TempUser.remove(query, function(err) {
                if (err)
                    throw err;

                if (options.sendConfirmationEmail) {
                    var mailOptions = JSON.parse(JSON.stringify(options.confirmMailOptions));
                    mailOptions.to = getNestedValue(userData, options.emailFieldName);
                    transporter.sendMail(mailOptions, options.confirmSendMailCallback);
                }
            });
            // save the temporary user to the persistent user collection
            

            callback(userData);

        // temp user is not found (i.e. user accessed URL after data expired, or something else...)
        } else {
            callback(null);
        }
    });
};


/**
 * Resend the verification email to the user given only their email.
 *
 * @func resendVerificationEmail
 * @param {object} email - the user's email address
*/
var resendVerificationEmail = function(email, callback) {
    var query = {};
    query[options.emailFieldName] = email;

    options.tempUserModel.findOne(query, function(err, tempUser) {
        if (err)
            throw err;

        // user found (i.e. user re-requested verification email before expiration)
        if (tempUser) {
            sendVerificationEmail(getNestedValue(tempUser, options.emailFieldName), tempUser[options.URLFieldName]);
            callback(true);
        } else {
            callback(false);
        }
    });
};


module.exports = {
    options: options,
    configure: configure,
    generateTempUserModel: generateTempUserModel,
    createTempUser: createTempUser,
    registerTempUser: registerTempUser,
    confirmTempUser: confirmTempUser,
    resendVerificationEmail: resendVerificationEmail,
    sendVerificationEmail: sendVerificationEmail,
};
