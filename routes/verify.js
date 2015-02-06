var express = require('express'),
    router = express.Router();
var models = require('./../models'),
    User = models.user;

router.route('/')
  .get(function(req, res, next) {
    if (!req.query.key) {
      var err = new Error('no key found, please check your email for the link');
      err.status(400);
      return next(err);
    }

    var key = req.query.key;
    User.activate(key, function(err, doc) {
      if (err) {
        err.status = 500;
        return next(err);
      }
      if (!doc) {
        err = new Error('uid not found');
        err.status = 400;
        return next(err);
      }

      res.status(200).json({});
    });
  })
  .post(function(req, res) {
    // send another verification email
    
  });

module.exports = router;