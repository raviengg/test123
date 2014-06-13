var express = require('express');
var router = express.Router();
var uuid = require('node-uuid');
router.get('/', function(req, res) {
    var db = req.db;
    db.collection('offers').find().toArray(function (err, items) {
        res.json(items);
    });
});



/*
 * GET offerlist.
 */
router.get('/offerlist', function(req, res) {
    var db = req.db;
    db.collection('offers').find().toArray(function (err, items) {
        res.json(items);
    });
});


/*
 * PUT to editdoffer.
 */
router.put('/editoffer/:id', function(req, res) {
    var db = req.db;
    var nOffer = req.body;

    db.collection('offers').update({'_id':nOffer._id},nOffer,{'safe':true} ,function(err, result){
        if(err === null){
            db.collection('offers').find().toArray(function (err, items) {
              res.json(items);
             });
        }else{
        	console.log(err)
        	res.send({ msg: err });
        }

    });
});
/*
 * POST to addoffer.
 */
router.post('/addoffer', function(req, res) {
    var db = req.db;
    var nOffer = req.body;
    nOffer._id =  uuid.v4().replace(/-/g, '');
    db.collection('offers').insert(nOffer, function(err, result){
        if(err === null){
            db.collection('offers').find().toArray(function (err, items) {
              res.json(items);
             });
        }else{
        	console.log(err)
        	res.send({ msg: err });
        }

    });
});

/*
 * DELETE to deleteoffer.
 */
router.delete('/deleteoffer/:id', function(req, res) {
    var db = req.db;
    var offerToDelete = req.params.id;
    db.collection('offers').removeById(offerToDelete, function(err, result) {
        res.send((result === 1) ? { msg: '' } : { msg:'error: ' + err });
    });
});

module.exports = router;