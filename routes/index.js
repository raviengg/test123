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

/*
// get offer admin page
router.get('/offers', function(req, res) {
  res.render('offer', { title: 'offers' });
});
*/
module.exports = router;
