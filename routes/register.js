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
      var from = { email: 'josh.hardy.ufen@gmail.com', name: 'Partners In Reading' };
      var subject = 'Confirm Your Email Address';
      var link = req.hostname + '/verify?key=' + uid;

      mailer.getTemplate('confirm-email.hbs', function(err, hbs) {
        if (err) throw err;
        var html = mailer.compileHbs(hbs, { "url": link });

        mailer.sendEmail([{ email: data.email }], from, subject, html, function(err, emails) {
          if (err)
            return res.status(500).json({ error: err });

          res.status(201).json({ status: emails[0] });
        });
      });
    });
  });

module.exports = router;