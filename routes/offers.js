module.exports = function(app,app_secure,uuid){
app.get('/admin/offer/list', function(req, res) {
    var db = req.db;
    db.collection('offers').find().toArray(function (err, items) {
        res.json(items);
    });
});

app.get('/admin/offer/list/:city', function(req, res) {
    var city = req.params.city;
    console.log("city name is " +  city)
    var db = req.db;
    db.collection('offers').find({'city':city}).toArray(function (err, offers) {
        res.json(offers);
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
    db.collection('venue').findOne({"_id":nOffer.venue._id},function(err,venue){
        if(err === null ){
            nOffer.city = venue.city;
            nOffer.loc.coordinates = venue.loc.coordinates;
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
        }else{
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
    db.collection('venue').findOne({"_id":nOffer.venue._id},function(err,venue){
        if(err === null ){
            nOffer.city = venue.city;
            nOffer.loc.coordinates = venue.loc.coordinates;
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
        }else{
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
