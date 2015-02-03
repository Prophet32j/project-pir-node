var jwt = require('jsonwebtoken');
var UnauthorizedError = require('./../errors/UnauthorizedError');
var client = require('./../bin/redis-client')();

module.exports = function(secret) {

  var middleware = function(req, res, next) {
    var token;
    if (req.headers && req.headers.authorization) {
      var parts = req.headers.authorization.split(' ');
      if (parts.length == 2) {
        var scheme = parts[0];
        var credentials = parts[1];

        if (/^Bearer$/i.test(scheme)) {
          token = credentials;
        } else {
          return next(new UnauthorizedError('credentials_bad_format', { message: 'Scheme is Bearer' }));
        }
      } else {
        return next(new UnauthorizedError('credentials_bad_format', { message: 'Format is Authorization: Bearer [token]' }));
      }
    }

    if (!token)
      return next(new UnauthorizedError('credentials_required', { message: 'No authorization token was found' }));

    jwt.verify(token, secret, function(err, decoded) {
      if (err) return next(new UnauthorizedError('invalid_token', err));

      // check Redis for token
      client.hget('jwt_tokens', token, function(err, result) {
        if (err) 
          return next(err);
        
        if (!result)
          return next(new UnauthorizedError('invalid_token', { message: 'Token is invalid' }));

        req['user'] = decoded;
        next();
      });
    });
  };

  return middleware;
};