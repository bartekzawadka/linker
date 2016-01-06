var express = require('express');
var models  = require('../models');
var pj = require('../package.json');
var url = require('url');
var router = express.Router();

router.get('/', function(req, res){
    res.render('index', {
      //issues: getData(),
      version: pj.version});
});

router.get('/view/:iid', function(req, res){
  var iid = req.params.iid;
  models.issue.findOne({where: {id: iid}}).then(function(iss){
    res.render('issue', {title: 'Podgląd isiusa', issue: iss});
  });
});

router.post('/addupdate', function(req, res){

    if(req.body.id && req.body.id>=0){
      // EDYCJA
      res.end();
      return;
    }

    if(req.body.title != null && req.body.links != null) {

      var iss = models.issue.create({
        title: req.body.title,
        description: req.body.description,
        solveDate: req.body.solveDate
      }).then(function (data) {
        var links = [];

        for (var l in req.body.links) {
          var item = req.body.links[l];
          models.link.create({
            link: item,
            issueId: data.id
          });
        }

        res.end();
      });
    }
});

router.get('/issues', function(req, res){
  res.render('partials/issues');
});

router.get('/issue', function(req, res){
  res.render('partials/addeditissue');
});

module.exports = router;
