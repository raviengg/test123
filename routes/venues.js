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

/*
 * POST to addvenue.
 */
router.post('/addvenue', function(req, res) {
    var db = req.db;
    db.collection('venue').insert(req.body, function(err, result){
        console.log(err);
        if(err === null){
            db.collection('venue').find().toArray(function (err, items) {
              res.json(items);
             });    	
        }else{
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