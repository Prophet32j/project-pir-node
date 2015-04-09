var express = require('express'),
    router = express.Router();

var models = require('./../models'),
    User = models.user;

router.route('/')
  .get(function(req, res, next) {
    res.render('login', { title: 'Sign-in' });
  })
  .post(function(req, res, next) {
    var email = req.body.email;
    var password = req.body.password;

    User.login(email, password, function(err, doc, token) {
      if (err) {
        err.status = err.status || 500;
        return next(err);
      }
      // models.getAccount(doc, function(err, json) {
      //   if (err) {
      //     err.status = err.status || 500;
      //     return next(err);
      //   }

      // });
      var user = {
        id: doc.id,
        email: doc.email,
        role: doc.role,
        created: doc.created,
        last_login: doc.last_login
      }
      res.json({ token: token, user: user });
    });
  });

module.exports = router;


// function createAccountPayload(user, callback, token) {
//   models.getAccount(user, function(err, account) {
//     if (err) {
//       return callback(err);
//     }

//     if (user.role === 'parent') {
//       account.user = user;
//     }
//   });
// }