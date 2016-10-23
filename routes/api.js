/**
 * Created by barte_000 on 2016-01-04.
 */

var express = require('express');
var router = express.Router();
var Issue = require('../models/issue');
var url = require('url');
var Filtering = require('kendo-grid-filter-sequelize-converter');

/** Gets all issues paginated, filtered and sorted*/
router.get('/getissues', function(req, res){
    var urlParts = url.parse(req.url, true);

    //todo: Fix 'where' and sorting conditions
    var result = null;
    if(req.query && req.query.filter){
        var f = new Filtering();
        result = f.resolveFilter(req.query.filter);
    }

    var sorting = [["updateAt", -1]];
    if(req.query.sort && req.query.sort.length > 0){
        sorting = [[]];
        sorting[0].push(req.query.sort[0].field);
        if(req.query.sort[0].dir == 'desc')
        sorting[0].push(req.query.sort[0].dir.toUpperCase());
    }

    Issue.count({}, function(error, count){
        var data = {count: count};

        Issue.find({}).where(result).sort(sorting).skip(parseInt(urlParts.query.skip)).limit(parseInt(urlParts.query.take)).exec(function(error, r){
            data.rows = r;
            res.writeHead(200, {"Content-Type": "application/json"});
            res.end(JSON.stringify(data));
        });
    });
});

router.get('/getissue/:id', function(req, res){

    Issue.findById(req.params.id).exec(function(error, result){
        res.json({"form": result});
    });
});

router.get('/isauthenticated', function(req, res){
    var auth = false;
    if(req.user)
        auth = true;
    res.json({"isauthenticated": auth});
});

/** Updates specific issue */
router.post('/issue', function(req, res){

    var data = req.body;

    if(!data.links || data.links == null || data.links.length == 0){
        return;
    }

    if(data.isSolved && data.solveDate == null) {
        data.solveDate = new Date();
    } else if(data.isSolved == false){
        data.solveDate = null;
    }

    var completed = function(error, result){
        if(error) console.log(error);
        res.end();
    };
    var currentDate = new Date();
    data.updateAt = currentDate;

    if(data._id){
        Issue.findOneAndUpdate({_id: data._id}, data, {upsert: true}, completed);
    }else{
        data.createdAt = currentDate;
        Issue.create(data, completed);
    }

});

/* Removes issue record for selected id */
router.delete('/issue/:id', function(req, res){
    if(req.params && req.params.id) {
        Issue.find({_id: req.params.id}).remove(function(error, result){
           res.end();
        });
    }
});

module.exports = router;