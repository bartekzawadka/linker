/**
 * Created by barte_000 on 2016-01-04.
 */

var express = require('express');
var router = express.Router();
var models  = require('../models');
var pj = require('../package.json');
var url = require('url');

/** Gets all issues paginated */
router.get('/getissues', function(req, res){
    var urlParts = url.parse(req.url, true);

    //todo: ADD SORTING AND FILTERING (parameters in url)
    models.issue.findAndCountAll({
        order: [["\"updatedAt\"", "DESC"]],
        offset: urlParts.query.skip,
        limit: urlParts.query.take
    }).then(function(result){
        res.writeHead(200, {"Content-Type": "application/json"});
        res.end(JSON.stringify(result));
    });
});

/** Gets all links for specified issue (by id) */
router.get('/getlinks/:id', function(req, res){
    models.link.findAll({
        where: {
            issueId: req.params.id
        },
        order: "\"updatedAt\" DESC"
    }).then(function(result){
        res.writeHead(200, {"Content-Type": "application/json"});
        res.end(JSON.stringify(result));
    });
});

router.get('/getissue/:id', function(req, res){
    models.issue.findOne({where: {id: iid}}).then(function(iss){
        res.json(iss);
    });
});

/** Posts new issue */
router.post('/addissue', function(req, res){
    console.log('issue added (title: '+req.body.title+')');
});

/** Updates specific issue */
router.get('/updateissue', function(req, res){

});

router.put('/updateissue', function(req, res){

});

module.exports = router;