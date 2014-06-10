var express = require('express');
var router = express.Router();

/*
 * GET venuelist.
 */
router.get('/venuelist', function(req, res) {
    var db = req.db;
    db.collection('venue').find().toArray(function (err, items) {
        res.json(items);
    });
});

router.get('/totaldata', function(req, res) {
    var db = req.db;
    var location = req.body;

    var lonC= parseInt(location.longitude);
    var latC = parseInt(location.latitude);
    lonC = 77.665;
    latC= 27.488;
    db.collection('venue').find({'loc':{'$near':{'$geometry':{'type':'Point','coordinates':[lonC,latC]}}}}).toArray(function (err, venueList) {
       db.collection('offers').find().toArray(function (err, offerList) {
            res.json({'venue':venueList,'offer':offerList});
        });
    });
});

/*
 * POST to addvenue.
 */
router.post('/addvenue', function(req, res) {
    var db = req.db;

    var newVen = req.body;
    console.log(newVen);
    var longC = parseFloat(newVen.loc.coordinates[0]);
    var latC = parseFloat(newVen.loc.coordinates[1]);
    newVen.loc.coordinates=[longC,latC];
    newVen.loc.type = "Point";
    console.log(newVen);
    db.collection('venue').insert(newVen, function(err, result){
        ;
        if(err === null){
            db.collection('venue').find().toArray(function (err, items) {

              res.json(items);
             });
        }else{
        	console.log(err)
        	res.send({ msg: err });
        }

    });
});

/*
 * DELETE to deletevenue.
 */
router.delete('/deletevenue/:id', function(req, res) {
    var db = req.db;
    var venueToDelete = req.params.id;
    db.collection('venue').removeById(venueToDelete, function(err, result) {
        res.send((result === 1) ? { msg: '' } : { msg:'error: ' + err });
    });
});

module.exports = router;