var express = require('express');
var router = express.Router();
const {User} = require("../models")
const passport = require('passport')


function isLogedIn(req, res, next) {
  if (req.isAuthenticated()) {

    next()
  } else res.redirect('/login')
}

router.get('/register', function(req, res, next) {
  res.render('register');
});


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/login', function(req, res, next) {
  
  res.render('login');
});

router.post('/login',passport.authenticate("local"), function (req, res) {
  //console.log(req.user)
  console.log(req.isAuthenticated());
  
  res.redirect('/private');
});


router.post('/register', function(req, res, next) {
  User.create({
    username: req.body.username,
    password: req.body.password
  })
    .then((user)=> res.send(user))
  
});

router.get('/public', function(req, res, next) {
  res.render('public');
});




router.get('/private', isLogedIn, function(req, res) {
  res.render('private');
});

router.post('/private',(req,res)=>{
  req.logout();
  res.redirect('/')
})


module.exports = router
