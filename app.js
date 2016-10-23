var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var crypto = require('crypto');
var User = require('./models/user');
var es = require('express-session');

var routes = require('./routes/index');
var users = require('./routes/users');
var api = require('./routes/api');

var passport = require('passport');
var BearerStrategy = require('passport-http-bearer').Strategy;

var app = express();


passport.use(new BearerStrategy({passReqToCallback : true },function(req, token, done){
    User.findOne({username: req.body.user}, function(err, user){
        if(!user) {
            done(false)
        }else if(err){
            done(false);
        }
        else {
            done(null, user);
        }
    });
}));

passport.serializeUser(function(username, done){
   done(null, username);
});

passport.deserializeUser(function(user, done){
   done(null, user);
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(es({ secret: 'hacoonamatata1969' }));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/api', api);
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));
app.use('/modules', express.static(path.join(__dirname+'/node_modules')));

app.get('*', routes);

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

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
