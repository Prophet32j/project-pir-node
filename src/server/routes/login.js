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

      res.json({ token: token, user: doc });
    });
  });

module.exports = router;