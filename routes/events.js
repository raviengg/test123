module.exports = function(app,app_secure,uuid){
    app.get('/admin/event/', function(req, res) {
        var db = req.db;
        db.collection('events').find().toArray(function (err, items) {
            res.json(items);
        });
    });



    /*
     * GET eventlist.
     */
    app.get('/admin/event/list', function(req, res) {
        var db = req.db;
        db.collection('events').find().toArray(function (err, items) {
            res.json(items);
        });
    });


    /*
     * PUT to editdevent.
     */
    app.put('/admin/event/edit/:id', function(req, res) {
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
    app.post('/admin/event/add', function(req, res) {
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
    app.delete('/admin/event/delete/:id', function(req, res) {
        var db = req.db;
        var eventToDelete = req.params.id;
        db.collection('events').removeById(eventToDelete, function(err, result) {
            res.send((result === 1) ? { msg: '' } : { msg:'error: ' + err });
        });
    });
}
