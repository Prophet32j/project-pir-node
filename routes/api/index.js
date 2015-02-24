var express = require('express'),
    api = express();
    
var fs = require('fs');
var authjwt = require('./../../auth/auth-jwt');
var config = require('./../../config/config.json');

// secure routes with token-based authentication
var allows = [
  // /\/api\/users\/exists/i,
  /\/api\/register/i,
  /\/api\/users/i,
  /\/api\/parents/i,
  /\/api\/volunteers/i
];

api.use('/', authjwt(config.jwt_secret).unless({ path: allows }));

fs.readdirSync(__dirname).forEach(function(file) {
  if (file !== 'index.js') {
    var moduleName = file.split('.')[0];

    api.use('/' + moduleName, require('./' + moduleName));
  }
});

api.on('mount', function(parent) {
  console.log('API mounted on ', api.mountpath);
});


// error handler for API
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