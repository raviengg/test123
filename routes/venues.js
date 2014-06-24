
module.exports = function(app,app_secure,uuid){
    /*
     * GET venuelist.
     */
    app.get('/admin/venue/list', function(req, res) {
        var db = req.db;
        db.collection('venue').find().toArray(function (err, items) {
            res.json(items);
        });
    });

    app.get('/admin/venue/totaldata', function(req, res) {
        var db = req.db;
        var lat = parseFloat(req.get('lat'));
        var lon = parseFloat(req.get('lon'));
        db.collection('venue').find({'loc':{'$near':{'$geometry':{'type':'Point','coordinates':[lon,lat]}}}}).toArray(function (err, venueList) {
           db.collection('offers').find().toArray(function (err, offerList) {
                  db.collection('events').find().toArray(function (err, eventList) {
                  res.json({'venue':venueList,'offer':offerList,'event':eventList});
            });

            });
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