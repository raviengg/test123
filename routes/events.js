module.exports = function(app,app_secure,uuid){
    app.get('/admin/event', function(req, res) {
        var db = req.db;
        db.collection('events').find().toArray(function (err, items) {
            res.json(items);
        });
    });


    app.get('/admin/event/list/:city', function(req, res) {
        var city = req.params.city;
        console.log("city name is " +  city)
        var db = req.db;
        db.collection('events').find({'city':city}).toArray(function (err, events) {
            res.json(events);
        });
    });

    /*
     * PUT to editdevent.
     */
    app.put('/admin/event/edit/:id', function(req, res) {
        var db = req.db;
        var nevent = req.body;
        db.collection('venue').findOne({"_id":nevent.venue._id},function(err,venue){
            if(err === null ){
                nevent.city = venue.city;
                nevent.loc.coordinates = venue.loc.coordinates;
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
            }else{
            }
        });
    });

    /*
     * POST to addevent.
     */
    app.post('/admin/event/add', function(req, res) {
        var db = req.db;
        var nevent = req.body;
        nevent._id =  uuid.generate();
        db.collection('venue').findOne({"_id":nevent.venue._id},function(err,venue){
            if(err === null ){
                console.log(venue.loc.coordinates+ ">>>>>>>>>" + venue.city)
                nevent.city = venue.city;
                nevent.loc = {'coordinates':venue.loc.coordinates}

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
            }else{
            }
        });
    });

    /*
     * DELETE to deleteevent.
     */
    app.delete('/admin/event/delete/:id', function(req, res) {
        var db = req.db;
        var eventToDelete = req.params.id;
        db.collection('events').removeById(eventToDelete, function(err, result) {
            res.send((result === 1) ? { msg: '' } : { msg:'error: ' + err });
        });
    });
}
