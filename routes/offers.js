module.exports = function(app,app_secure,uuid){
app.get('/admin/offer', function(req, res) {
    var db = req.db;
    db.collection('offers').find().toArray(function (err, items) {
        res.json(items);
    });
});



/*
 * GET offerlist.
 */
app.get('/admin/offer/offerlist', function(req, res) {
    var db = req.db;
    db.collection('offers').find().toArray(function (err, items) {
        res.json(items);
    });
});


/*
 * PUT to editdoffer.
 */
app.put('/admin/offer/editoffer/:id', function(req, res) {
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
app.post('/admin/offer/addoffer', function(req, res) {
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
app.delete('/admin/offer/deleteoffer/:id', function(req, res) {
    var db = req.db;
    var offerToDelete = req.params.id;
    db.collection('offers').removeById(offerToDelete, function(err, result) {
        res.send((result === 1) ? { msg: '' } : { msg:'error: ' + err });
    });
});
}
