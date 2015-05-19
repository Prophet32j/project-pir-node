var express = require('express'),
    app = express(),
    errors = require('./../errors'),
    config = require('./config/config.json'),
    jwt = require('express-jwt'),
    resources = require('./resources');

// secure routes with token-based authentication
var allows = [
  /\/get-token/i
];

// app.use('/', jwt({ secret: config.jwt_secret }).unless({ path: allows }));
/// TODO
/// need to create an access control using the scopes on the token
/// need to create an access control validator to validate proper scope

// mount the resources
resources.mount(app);

// app.on('mount', function(parent) {
//   console.log('API mounted on ', app.mountpath);
// });

// error handlers for API

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new errors.NotFoundError('resource_not_found', { message: 'Resource not found' });
    next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({ error: err });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({ 
    name: err.name,
    message: err.message,
    code: err.code,
    status: err.status || 500
  });
}); 

module.exports = app;