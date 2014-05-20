var express = require('express');
var router = express.Router();

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
    console.log('>>>>>>>>>>>@22')
    db.collection('offers').find().toArray(function (err, items) {
        res.json(items);
    });
});

/*
 * POST to addoffer.
 */
router.post('/addoffer', function(req, res) {
    var db = req.db;
    db.collection('offers').insert(req.body, function(err, result){
        console.log(err);
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
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