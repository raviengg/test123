module.exports = function(app,app_secure){
    var hash = require('./pass.js').hash;
    var redirect_secure = function(req, res, next){
        if(!req.secure){
            res.redirect('https://' + req.header('Host') + req.url)}
        else{
            next();
        }
    }

    app.get('/',function(req,res){
        if(req.secure){
            res.redirect('/login');
        }else{
            res.render('site/index.jade');
        }
    });


    app.get('/admin-user', restrict,function(req, res) {
      res.render('admin-user', { title: 'user' });
    });

    app.get('/logout', function(req, res){
      // destroy the user's session to log them out
      // will be re-created next request
      req.session.destroy(function(){
        res.redirect('/login');
      });
    });

    app.get('/admin-offer',restrict,function(req, res) {
        var db = req.db;
        db.collection('venue').find().toArray(function (err, venue) {
              res.render('admin-offer', { title: 'Offers' ,'venue':venue});
        });
    });

    app.get('/admin-panel',restrict,function(req, res) {
      res.render('admin-panel', { title: 'Partyy' });
    });

    app.get('/admin-venue',restrict, function(req, res) {
      res.render('admin-venue', { title: 'Venues List' });
    });



// get offer admin page
    app.get('/admin-event', function(req, res) {
        var db = req.db;
        db.collection('venue').find().toArray(function (err, venue) {
              res.render('admin-event', { title: 'Events' ,'venue':venue});
        });
    });

    app.get('/login',redirect_secure,function(req, res) {
        res.render('login', { title: 'Sign In' });
    });

    app.post('/login', function(req, res){
      authenticate(req.body.user, req.body.pass, function(err, user){
        if (user) {
          // Regenerate session when signing in
          // to prevent fixation
          req.session.regenerate(function(){
            // Store the user's primary key
            // in the session store to be retrieved,
            // or in this case the entire user object
            req.session.user = user;
            req.session.success = 'Authenticated as ' + user.name
              + ' click to <a href="/logout">logout</a>. '
              + ' You may now access <a href="/restricted">/restricted</a>.';
            res.redirect('/admin-panel');

          });
        } else {
          req.session.error = 'Authentication failed, please check your '
            + ' username and password.' ;
          res.redirect('/login');
        }
      });
    });

    // dummy database

    var users = {
      tom: { name: 'tom' }
    };

    // when you create a user, generate a salt
    // and hash the password ('foobar' is the pass here)

    hash('foobar1', function(err, salt, hash){
      if (err) throw err;
      // store the salt & hash in the "db"
      users.tom.salt = salt;
      users.tom.hash = hash;
    });

// Authenticate using our plain-object database of doom!

    function authenticate(name, pass, fn) {
      if (!module.parent) console.log('authenticating %s:%s', name, pass);
      var user = users[name];
      // query the db for the given username
      if (!user) return fn(new Error('cannot find user'));
      // apply the same algorithm to the POSTed password, applying
      // the hash against the pass / salt, if there is a match we
      // found the user
      hash(pass, user.salt, function(err, hash){
        if (err) return fn(err);
        if (hash == user.hash) return fn(null, user);
        fn(new Error('invalid password'));
      });
    }

    function restrict(req, res, next) {
      if (req.session.user) {
         console.log('pass')
        next();
      } else {
          console.log('fail')
        req.session.error = 'Access denied!';
        res.redirect('/login');
      }
    }

}

/*
var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  res.render('welcome-page', { title: 'Partyy' });
});

router.get('/admin-user', function(req, res) {
  res.render('admin-user', { title: 'user' });
});

router.get('/login', function(req, res) {
  res.render('login', { title: 'Sign In' });
});

router.get('/admin-venue', function(req, res) {
  res.render('admin-venue', { title: 'Venues List' });
});


// get offer admin page
router.get('/admin-offer', function(req, res) {
    var db = req.db;
    db.collection('venue').find().toArray(function (err, venue) {
          res.render('admin-offer', { title: 'Offers' ,'venue':venue});
    });
});


// get offer admin page
router.get('/admin-event', function(req, res) {
    var db = req.db;
    db.collection('venue').find().toArray(function (err, venue) {
          res.render('admin-event', { title: 'Events' ,'venue':venue});
    });
});

module.exports = router;
*/