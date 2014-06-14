var express = require('express');
var router = express.Router();
var uuid = require('node-uuid');
router.get('/', function(req, res) {
    var db = req.db;
    db.collection('events').find().toArray(function (err, items) {
        res.json(items);
    });
});



/*
 * GET eventlist.
 */
router.get('/eventlist', function(req, res) {
    var db = req.db;
    db.collection('events').find().toArray(function (err, items) {
        res.json(items);
    });
});


/*
 * PUT to editdevent.
 */
router.put('/edit/:id', function(req, res) {
    var db = req.db;
    var nevent = req.body;

    db.collection('events').update({'_id':nevent._id},nevent,{'safe':true} ,function(err, result){
        if(err === null){
            db.collection('events').find().toArray(function (err, items) {
              res.json(items);
             });
        }else{
        	console.log(err)
        	res.send({ msg: err });
        }

    });
});
/*
 * POST to addevent.
 */
router.post('/add', function(req, res) {
    var db = req.db;
    var nevent = req.body;
    nevent._id =  uuid.v4().replace(/-/g, '');
    db.collection('events').insert(nevent, function(err, result){
        if(err === null){
            db.collection('events').find().toArray(function (err, items) {
              res.json(items);
             });
        }else{
        	console.log(err)
        	res.send({ msg: err });
        }

    });
});

/*
 * DELETE to deleteevent.
 */
router.delete('/delete/:id', function(req, res) {
    var db = req.db;
    var eventToDelete = req.params.id;
    db.collection('events').removeById(eventToDelete, function(err, result) {
        res.send((result === 1) ? { msg: '' } : { msg:'error: ' + err });
    });
});

module.exports = router;