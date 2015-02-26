var express = require('express'),
    api = express();
    
var fs = require('fs');
var authjwt = require('./../../auth/auth-jwt');
// var acl = require('./../../auth/api-acl');
var config = require('./../../config/config.json');
var errors = require('./../../errors');

// secure routes with token-based authentication
var allows = [
  /\/api\/users\/exists/i
];

api.use('/', authjwt(config.jwt_secret).unless({ path: allows }));
// api.use('/', acl());

fs.readdirSync(__dirname).forEach(function(file) {
  if (file !== 'index.js') {
    var moduleName = file.split('.')[0];

    api.use('/' + moduleName, require('./' + moduleName));
  }
});

api.on('mount', function(parent) {
  console.log('API mounted on ', api.mountpath);
});


// error handlers for API

// catch 404 and forward to error handler
api.use(function(req, res, next) {
    var err = new errors.NotFoundError('resource_not_found', { message: 'Resource not found' });
    next(err);
});

// development error handler
// will print stacktrace
if (api.get('env') === 'development') {
  api.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({ error: err });
  });
}

// production error handler
// no stacktraces leaked to user
api.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({ 
    name: err.name,
    message: err.message,
    code: err.code,
    status: err.status || 500
  });
}); 

module.exports = api;