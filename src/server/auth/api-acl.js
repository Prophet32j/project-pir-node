var unless = require('express-unless');
var errors = require('./../errors');
var _ = require('lodash');


module.exports = function() {

  var middleware = function(req, res, next) {
    var method = req.method;
    var path = req.path,
        parts = parsePath(path);
    var user = req.tokenPayload;


    // make sure something was entered in path
    if (!parts.length) {
      return next();
    }

    // admin check
    if (/[af]/i.test(user.type)) {
      return next();
    }

    // front desk
    // if (user.type === 'f') {
    //   switch (method) {
    //     case 'GET': 
    //       return next();
    //     case 'POST': 

    //     default:
    //       return next(new errors.UnauthorizedError('user_not_authorized', { message: 'User is not authorized this request' }));
    //   }
    // }

    // parents
    if (user.type === 'p') {
      var resource = parts.shift();
      switch (resource) {
        case 'users':
          // parents not allowed full resource access
          if (!parts.length) {
            return next(new errors.UnauthorizedError('access_denied', { messaged: 'User not authorized resource' }));
          } else {
            var id = parts.shift();
            if (id !== user._id || id !== user.email) {
              return next(new errors.UnauthorizedError('access_denied', { messaged: 'User not authorized resource' }));
            }
            return next();
          }
          break;
        case 'parents':

        case 'readers':

        case 'pairs':

        case 'volunteers':

        default:
      }
    }

    // volunteers
    if (user.type === 'v') {

    }
    next();
  }

  middleware.unless = unless;

  return middleware;
}


function parsePath(path) {
  return _.filter(path.split('/'), function(part) {
    return part.length;
  });
}