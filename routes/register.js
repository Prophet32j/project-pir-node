var express = require('express'),
    router = express.Router();
var models = require('./../models'),
    User = models.user,
    Parent = models.parent,
    Volunteer = models.volunteer;
var Mailer = require('./../mailer');
var errors = require('./../errors');

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
      });

      res.status(201).json({ user: doc });
    });
  });

router.param('id', function(req, res, next, id) {
  User.findById(id, function(err, doc) {
    if (err) {
      err.status = 500;
      next(err);
    }
    if (!doc) {
      next(new errors.NotFoundError('user_not_found', { message: 'User ID not found' }));
    }

    req.user = doc;
    next();
  });
});

router.route('/:id')
  .post(function(req, res, next) {
    switch (req.user.type) {
      case 'p': {
        Parent.create(req.body, function(err, doc) {
          if (err) {
            err.status = 500;
            return next(err);
          }

          var mailer = new Mailer();
          var message = {
            to: [{
                  email: doc.email,
                  name: doc.first_name + ' ' + doc.last_name 
                }],
            subject: 'Parent Registration Confirmation'
          };
          var email_data = { "parent": doc.toJSON() };

          mailer.sendEmail('parent-confirmation', email_data, message, function(err, emails) {
            if (err) {
              console.err('Mandrill API Error: ', err.stack);
            }

          });

          res.status(201).json({ parent: doc });
        });
        break;
      }
      case 'v': {
        Volunteer.create(req.data, function(err, doc) {
          if (err) {
            err.status = 400;
            return next(err);
          }

          // send email
          var mailer = new Mailer();
          var email_data = { 
            "volunteer": doc.toJSON()
          };
          var message = {
            to: [{
                  email: doc.email,
                  name: doc.first_name + ' ' + doc.last_name
                }],
            subject: 'Volunteer Registration Confirmation'
          };

          mailer.sendEmail('volunteer-confirmation', email_data, message, function(err, emails) {
            if (err) {
              console.err('Mandrill API Error: ', err.stack);
            }
          });
      
          res.json({ volunteer: doc });
        });
        break;
      }
      default: {
        return next(new errors.UnauthorizedError('invalid_user_type', { message: 'User type is invalid' }));
      }
    }
  });



module.exports = router;