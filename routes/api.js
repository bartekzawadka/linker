/**
 * Created by barte_000 on 2016-01-04.
 */

var express = require('express');
var router = express.Router();
var models  = require('../models');
var pj = require('../package.json');
var url = require('url');
var asy = require('async');

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
    models.issue.findOne({where: {id: req.params.id}, include: {model: models.link, attributes:['link']}}).then(function(iss){
        res.json({"form": iss});
    });
});

router.get('/isauthenticated', function(req, res){
    if(req.user)
        var auth = true;
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

    if(data.id)
    {
        models.link.destroy({where: {"\"issueId\"" : data.id}}).then(function(e){
                models.issue.upsert({title: data.title, description: data.description, solveDate: data.solveDate, id: data.id}).then(function(e){
                    console.log('upserted');

                    asy.each(data.links, function(item, callback){
                            models.link.create({
                                link: item,
                                issueId: data.id
                            }).then(function(e){
                                console.log('link created');
                                callback();
                            }).catch(function(e){
                                console.log('link creation failed:');
                                console.log(e);
                                callback(e);
                            })
                    }, function(error){
                        if(error) {
                            console.log(error);
                        }
                        else{
                            res.end();
                        }
                    });
                }).catch(function(e){
                    console.log('upsert error:');
                    console.log(e);
                });
        }).catch(function(e){
            console.log('poracha...');
        });


    } else {
        var k = models.issue.create({title: data.title, description: data.description, solveDate: data.solveDate}).then(function(record){
            //console.log('upserted');

            asy.each(data.links, function(item, callback){
                models.link.create({
                    link: item,
                    issueId: record.id
                }).then(function(e){
                    callback();
                }).catch(function(e){
                    callback(e);
                })
            }, function(error){
                if(error) {
                    console.log(error);
                }
                else{
                    res.end();
                }
            });
        }).catch(function(e){
            console.log('upsert error:');
            console.log(e);
        });
    }


});

module.exports = router;