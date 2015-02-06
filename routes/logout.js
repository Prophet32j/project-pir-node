var express = require('express'),
    router = express.Router();
var models = require('./../models'),
    User = models.user;

router.route('/')
  .get(function(req, res, next) {
    var token = req.query.token;
    if (!token) {
      return res.status(400).json({error: new Error('no token found in query, format /logout?token=token') });
    }

    User.logout(token, function(err, result) {
      if (err) {
        err.status = 500;
        return next(err);
      }
      if (!result) {
        return res.status(500).json({ error: new Error('token not deleted from database') });
      }

      res.status(200).json({});
    });
  });

module.exports = router;