var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session= require("express-session")
const {User} = require("./models")
const passport = require('passport')
, LocalStrategy = require('passport-local').Strategy;
const db = require('./db')
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({secret:"cats"}))
app.use(passport.initialize())
app.use(passport.session())


passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ where: {username: username} })
    .then((user)=> {
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!user.validatePassword(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
  ));
  
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    User.findByPk(id)
    .then( function(user) {
      done(null, user);
    });
  });


app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  
  // render the error page
  //console.log(err)
  res.status(err.status || 500);
  res.render('error');
});

db.sync({})
  
    .then(()=> {
      console.log('asds')
    })

  
  module.exports = app;
  