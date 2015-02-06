var express = require('express'),
    router = express.Router();
var models = require('./../models'),
    User = models.user;

router.route('/')
  .get(function(req, res, next) {
    if (!req.query.key) {
      return res.status(400).json({ error: new Error('no key found, please check your email for the link') });
    }

    var key = req.query.key;
    User.activate(key, function(err, doc) {
      if (err) {
        err.status = 500;
        return next(err);
      }
      if (!doc) {
        return res.status(400).json({ error: new Error('uid not found') });
      }

      res.status(200).json({});
    });
  })
  .post(function(req, res) {
    // send another verification email
    
  });

module.exports = router;