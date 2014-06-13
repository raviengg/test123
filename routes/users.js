var express = require('express');
var router = express.Router();
var uuid = require('node-uuid');
/*
 * GET userlist.
 */
router.get('/userlist', function(req, res) {
    var db = req.db;
    db.collection('userlist').find().toArray(function (err, items) {
        res.json(items);
        console.log(">>>>>>>  2");
    });
});


router.post('/addNewUser', function(req, res) {
    var db = req.db;
    var location = req.body;
    console.log(req.body);
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
 * POST to adduser.
 */
router.post('/adduser', function(req, res) {
    var db = req.db;
    var nUser =  req.body;
    nUser._id =  uuid.v4().replace(/-/g, '');
    db.collection('userlist').insert(nUser, function(err, result){
        console.log(err);
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
});

/*
 * DELETE to deleteuser.
 */
router.delete('/deleteuser/:id', function(req, res) {
    var db = req.db;
    var userToDelete = req.params.id;
    db.collection('userlist').removeById(userToDelete, function(err, result) {
        res.send((result === 1) ? { msg: '' } : { msg:'error: ' + err });
    });
});

module.exports = router;