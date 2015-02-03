var express = require('express'),
    router = express.Router();
var models = require('./../models'),
    User = models.user;

router.route('/')
  .get(function(req, res) {
    var token = req.query.token;
    if (!token)
      return res.status(400).json({error: new Error('no token found in query, format /logout?token=token') });

    User.logout(token, function(err, result) {
      if (err) 
        return res.status(500).json({ error: err });
      if (!result)
        return res.status(500).json({ error: new Error('token not deleted from database') });

      res.sendStatus(200);
    });
  });

module.exports = router;