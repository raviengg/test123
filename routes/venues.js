var express = require('express');
var router = express.Router();
var uuid = require('node-uuid');
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
    var lat = parseFloat(req.get('lat'));
    var lon = parseFloat(req.get('lon'));
    db.collection('venue').find({'loc':{'$near':{'$geometry':{'type':'Point','coordinates':[lon,lat]}}}}).toArray(function (err, venueList) {
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
    newVen._id =  uuid.v4().replace(/-/g, '');
    db.collection('venue').insert(newVen, function(err, result){
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


router.put('/editvenue/:id', function(req, res) {
    var db = req.db;


    var newVen = req.body;

    //db.ObjectID.createFromHexString(newVen._id);
  /*  console.log(newVen._id +  typeof(newVen._id))

    db.collection('venue').findById(newVen._id,function(err,result){
       console.log( result);
    });
*/


    var longC = parseFloat(newVen.loc.coordinates[0]);
    var latC = parseFloat(newVen.loc.coordinates[1]);
    newVen.loc.coordinates=[longC,latC];
    newVen.loc.type = "Point";
    db.collection('venue').update({'_id':newVen._id},newVen,{'safe':true },function(err, result){
    console.log(result)
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