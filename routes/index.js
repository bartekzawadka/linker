var express = require('express');
var pj = require('../package.json');
var passport = require('passport');
var url = require('url');
var router = express.Router();

router.get('/', function(req, res){
    var a = req.isAuthenticated();

    if(req.user && req.user.fullName){
        var user = req.user.fullName;
    }

    res.render('index', {
      version: pj.version, user: user});
});

router.get('/issues',
    function(req, res) {
        res.render('partials/issues');
    });

router.get('/issue', function(req, res){
  res.render('partials/addeditissue');
});

router.get('/login', function(req, res){
  res.render('partials/login');
});

router.get('/logout', function(req, res){
    req.logout();
    res.end();
});

router.post('/login', passport.authenticate('bearer', {successRedirect: '/'}));

module.exports = router;
