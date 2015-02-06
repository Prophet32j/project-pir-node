var express = require('express'),
    router = express.Router();
var models = require('./../models'),
    User = models.user;

router.route('/')
  .get(function(req, res, next) {
    var token = req.query.token;
    if (!token) {
      var err = new Error('no token found in query, format /logout?token=token');
      err.status = 400;
      return next(err);
    }

    User.logout(token, function(err, result) {
      if (err) {
        err.status = 500;
        return next(err);
      }
      if (!result) {
        var err = new Error('token not deleted from database') ;
        err.status(500);
        return next(err);
      }

      res.status(200).json({});
    });
  });

module.exports = router;