var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require("mongoose");
var passport = require('passport');
var flash = require('connect-flash');
var expressSession = require("express-session");
var connectMongo = require('connect-mongo');
var compression = require('compression')

var MongoStore = connectMongo(expressSession);

var config = require("./config");
mongoose.connect(config.mongoUri);

var routes = require('./routes/index');
var users = require('./routes/users');
var graph = require('./routes/graph');
var passportConfig = require('./auth/passport-config');



var app = express();
passportConfig();

app.set('production', process.env.NODE_ENV === 'production');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(compression());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(expressSession(
    {
        secret: 'online judgement',
        saveUninitialized: false,
        resave: false,
        store: new MongoStore({
           mongooseConnection: mongoose.connection 
        })
    }
));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());



app.use('/', routes);
app.use('/users', users);
app.use('/graph',graph);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// // production error handler
// // no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
