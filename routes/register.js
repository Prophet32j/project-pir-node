var express = require('express'),
    router = express.Router();
var models = require('./../models'),
    User = models.user;
var mailer = require('./../mailer');

router.route('/')
  .post(function(req, res) {
    var data = req.body;

    User.register(data, function(err, doc, uid) {
      if (err)
        return res.status(400).json({ error: err });

      // send email to confirm email address
      var subject = 'Confirm Your Email Address';
      var link = req.hostname + '/verify?key=' + uid;
      mailer.sendEmail({ email: data.email }, subject, link, function(err, status) {
        if (err)
          return res.status(500).json({ error: err });

        res.status(201).json({ status: status });
      });
    });
  });

module.exports = router;