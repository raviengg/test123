var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('welcome-page', { title: 'Partyy' });
});

router.get('/admin-user', function(req, res) {
  res.render('admin-user', { title: 'user' });
});

router.get('/admin-venue', function(req, res) {
  res.render('admin-venue', { title: 'Venues List' });
});


// get offer admin page
router.get('/admin-offer', function(req, res) {
    var db = req.db;
    db.collection('venue').find().toArray(function (err, venue) {
    console.log(venue)
          res.render('admin-offer', { title: 'Offers' ,'venue':venue});
    });


});

module.exports = router;
