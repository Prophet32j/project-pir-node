var express = require('express'),
    router = express.Router();
var models = require('./../models'),
    User = models.user,
    Parent = models.parent,
    Volunteer = models.volunteer;
var Mailer = require('./../mailer');
var errors = require('./../errors');


router.route('/')
  .get(function(req, res, next) {
    res.render('register', { title: 'Register' });
  })
  .post(function(req, res, next) {
    var data = req.body;
    var user = data.user,
        account = data.parent || data.volunteer;

    registerUser(user, function(err, doc) {
      if (err) {
        return next(err);
      }

      // now we need to register the parent/volunteer
      registerAccount(doc.type, account, function(err, account) {
        if (err) {
          doc.remove();
          return next(err);
        }

        res.status(201).json({});
      });

    });
  });


module.exports = router;


function registerUser(user, callback) {

  User.register(user, function(err, doc, uid) {
    if (err) {
      err.status = 400;
      return callback(err);
    }

    // send email to confirm email address
    var message = {
      to: [{ email: doc.email }],
      subject: 'Confirm Your Email Address',
    }
    var email_data = {
      "url": req.hostname + '/verify?key=' + uid + '&email=' + encodeURIComponent(doc.email)
    }

    var mailer = new Mailer();

    mailer.sendEmail('email-confirmation', email_data, message, function(err, emails) {
      if (err) {
        console.err('Mandrill API Error: ', err.stack);
      }
    });

    callback(null, doc);
  });

}


function registerAccount(type, account, callback) {

  if (type === 'p') {
    return registerParent(account, callback);
  } 
  registerVolunteer(account, callback);

}


function registerParent(parent, callback) {

  Parent.create(parent, function(err, doc) {
    if (err) {
      err.status = 400;
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
  });

}


function registerVolunteer(volunteer, callback) {

  Volunteer.create(volunteer, function(err, doc) {
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
  });

}
