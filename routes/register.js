var express = require('express'),
    router = express.Router();
var models = require('./../models'),
    User = models.user;
var Mailer = require('./../mailer');

router.route('/')
  .post(function(req, res, next) {
    var data = req.body;

    User.register(data, function(err, doc, uid) {
      if (err) {
        err.status = 400;
        return next(err);
      }

      // send email to confirm email address
      // var from = config.system_email;
      var subject = 'Confirm Your Email Address';
      var link = req.hostname + '/verify?key=' + uid;

      var mailer = new Mailer();
      mailer.loadTemplateAndCompile('email-confirmation', { "url": link }, function(err, html) {
        if (err) {
          err.status = 500;
          return next(err);
        }

        mailer.sendEmail([{ email: data.email }], null, subject, html, function(err, emails) {
          if (err) {
            err.status = 500;
            return next(err);
          }

          res.status(201).json({ status: emails[0] });
        });
      });

    });
  });

module.exports = router;