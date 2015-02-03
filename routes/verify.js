var express = require('express'),
    router = express.Router();
var models = require('./../models'),
    User = models.user;

router.route('/')
  .get(function(req, res) {
    if (!req.query.key)
      return res.status(400).json({ error: new Error('no key found, please check your email for the link') });

    var key = req.query.key;
    User.activate(key, function(err, doc) {
      if (err)
        return res.status(500).json({ error: err });
      if (!doc)
        return res.status(400).json({ error: new Error('uid not found') });

      res.sendStatus(200);
    });
  });

module.exports = router;