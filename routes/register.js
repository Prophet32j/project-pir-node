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
      var message = {
        to: [{ email: doc.email }],
        subject: 'Confirm Your Email Address',
      }
      var email_data = {
        "url": req.hostname + '/verify?key=' + uid
      }

      var mailer = new Mailer();

      mailer.sendEmail('email-confirmation', email_data, message, function(err, emails) {
        if (err) {
          console.err('Mandrill API Error: ', err.stack);
        }

        res.status(201).json({ status: emails[0] });
      });

    });
  });

module.exports = router;