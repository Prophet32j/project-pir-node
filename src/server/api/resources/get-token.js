var express = require('express'),
    router = express.Router(),
    errors = require('./../../errors'),
    models = require('./../../models'),
    jwt = require('./../auth/auth-jwt');

router.post('/', function(req, res, next) {
  var creds = req.body;

  // validate creds
  models.User.login(creds.email, creds.password, function(err, doc) {
    if (err) {
      return next(err);
    }

    // no errors thrown, user is validated, get token and send via json
    var token = jwt.generateToken(doc);

    res.json({ token: token });
  });
});

module.exports = router;