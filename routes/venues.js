
module.exports = function(app,app_secure,uuid){
    /*
     * GET venuelist.
     */
    app.get('/admin/welcome-page', function(req, res) {
        var db = req.db;
        console.log('normal landing page');
        db.collection('venue').find({},{},{limit:4}).toArray(function (err, venue) {
            db.collection('offers').find({},{},{limit:4}).toArray(function (err, offer) {
                db.collection('events').find({},{},{limit:4}).toArray(function (err, event) {
                    res.json({'venue':venue,'offer':offer,'event':event});
                });
            });
        });
    });

    app.get('/admin/welcome-page/:city', function(req, res) {
        var db = req.db;
        console.log('city landing page page');
        db.collection('venue').find({},{},{limit:4}).toArray(function (err, venue) {
            db.collection('offers').find({},{},{limit:4}).toArray(function (err, offer) {
                db.collection('events').find({},{},{limit:4}).toArray(function (err, event) {
                    res.json({'venue':venue,'offer':offer,'event':event});
                });
            });
        });
    });

    app.get('/admin/venue', function(req, res) {
        var db = req.db;
        db.collection('venue').find().toArray(function (err, items) {
            res.json(items);
        });
    });


    app.get('/admin/venue/detail/:id', function(req, res) {
        var db = req.db;
        var id = req.params.id;
        db.collection('venue').findOne({'_id':id},function (err, venue) {
            db.collection('offers').find({'venue._id':id}).toArray(function (err, offers) {
                db.collection('events').find({'venue._id':id}).toArray(function (err, events) {
                    res.json({v:venue,o:offers,e:events});
                });
            });
        });
    });

    app.get('/admin/venue/:id', function(req, res) {
        var db = req.db;
        var id = req.params.id;
        db.collection('venue').find().toArray(function (err, items) {
            res.json(items);
        });
    });

    app.get('/admin/venue/list/:city', function(req, res) {
        var db = req.db;
        var city = req.params.city;
        db.collection('venue').find({'city':city}).toArray(function (err, items) {
            res.json(items);
        });
    });

    /*
     * POST to addvenue.
     */

    app.post('/admin/venue/add', function(req, res) {
        var db = req.db;

        var newVen = req.body;
        var longC = parseFloat(newVen.loc.coordinates[0]);
        var latC = parseFloat(newVen.loc.coordinates[1]);
        newVen.loc.coordinates=[longC,latC];
        newVen.loc.type = "Point";
        console.log(newVen);
        newVen._id =  uuid.generate();
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

    app.put('/admin/venue/edit/:id', function(req, res) {
        var db = req.db;
        var newVen = req.body;
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
    app.delete('/admin/venue/delete/:id', function(req, res) {
        var db = req.db;
        var venueToDelete = req.params.id;
        db.collection('venue').removeById(venueToDelete, function(err, result) {
            res.send((result === 1) ? { msg: '' } : { msg:'error: ' + err });
        });
    });


}
//module.exports = app;