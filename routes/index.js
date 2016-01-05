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

//router.get('/getissues', function(req, res){
//  var urlParts = url.parse(req.url, true);
//
//  models.issue.findAndCountAll({
//    order: [["\"updatedAt\"", "DESC"]],
//    offset: urlParts.query.skip,
//    limit: urlParts.query.take
//  }).then(function(result){
//    res.writeHead(200, {"Content-Type": "application/json"});
//    res.end(JSON.stringify(result));
//  });
//});

//router.get('/getlinks/:id', function(req, res){
//  models.link.findAll({
//    where: {
//      issueId: req.params.id
//    },
//    order: "\"updatedAt\" DESC"
//  }).then(function(result){
//    res.writeHead(200, {"Content-Type": "application/json"});
//    res.end(JSON.stringify(result));
//  });
//});
//
//
//router.get('/addissue', function(req, res){
//  res.render('addissue',{
//    version: pj.version});
//});

router.get('/issues', function(req, res){
  res.render('issues');
});

router.get('/addissue', function(req, res){
  res.render('addissue');
});

router.get('/edit/getissue/:iid', function(req, res){
  var iid = req.params.iid;
  models.issue.findOne({where: {id: iid}}).then(function(iss){
    res.send(iss.dataValues);
  });
});

router.get('/edit/:iid', function(req, res){
  res.render('issue', {version: pj.version, issue_id: req.params.iid});
  //var iid = req.params.iid;
  //models.issue.findOne({where: {id: iid}}).then(function(iss) {
  //  res.render('issue', {version: pj.version, id: iid, formData: iss});
  //});
});

module.exports = router;
