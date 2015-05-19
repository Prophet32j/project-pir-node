var jwt = require('jsonwebtoken'),
    errors = require('./../../errors'),
    UnauthorizedError = errors.UnauthorizedError,
    config = require('./../config/config.json');

// exports.middleware = function(secret) {

//   var middleware = function(req, res, next) {
//     var token;

//     // check for token in auth header
//     if (req.headers.authorization) {
//       var parts = req.headers.authorization.split(' ');
//       if (parts.length == 2) {
//         var scheme = parts[0];
//         var credentials = parts[1];

//         if (/^Bearer$/i.test(scheme)) {
//           token = credentials;
//         } else {
//           return next(new UnauthorizedError('credentials_bad_format', { message: 'Scheme is Bearer' }));
//         }
//       } else {
//         return next(new UnauthorizedError('credentials_bad_format', { message: 'Format is Authorization: Bearer [token]' }));
//       }
//     } 
//     // check for token in query string
//     else if (req.query && req.query.token) {
//       token = req.query.token;
//     }

//     if (!token)
//       return next(new UnauthorizedError('credentials_required', { message: 'No authorization token was found' }));

//     jwt.verify(token, secret, function(err, decoded) {
//       if (err) {
//         err.status = 401;
//         return next(err);
//       }

//       // set the decoded user
//       req['session'] = decoded;
//       next();

//     });
//   };

//   middleware.unless = unless;

//   return middleware;
// };

exports.generateToken = function(user) {
  var token = jwt.sign({email: user.email, role: user.role}, config.jwt_secret, {
    expiresInMinutes: 10080 // expires in 7 days, 60*24*7
  });

  return token;
}