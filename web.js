#!/usr/bin/env node
var debug = require('debug')('my-application');
var app = require('./app');

console.log(app.get('server'))

if(app.get('server') === 'local' ){
    app.set('port', process.env.PORT || 80);
}else{
    app.set('port', process.env.PORT || 3000);
}

console.log(app.get('port'));
var server = app.listen(app.get('port'), function() {
  debug('Express server listening on port ' + server.address().port);
});
