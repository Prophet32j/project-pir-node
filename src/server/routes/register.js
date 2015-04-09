var express = require('express'),
    router = express.Router();
var models = require('./../models'),
    User = models.user,
    Parent = models.parent,
    Volunteer = models.volunteer;
var Mailer = require('./../mailer');
var errors = require('rm-errors');


router.route('/')
  .get(function(req, res, next) {
    res.render('register', { title: 'Register' });
  })
  .post(function(req, res, next) {
    var data = req.body;
    var user = data.user,
        account = data.parent || data.volunteer;

    console.log('user: ', user);
    console.log('account: ', account);

    registerUser(user, req.hostname, function(err, doc) {
      if (err) {
        console.log(err);
        return next(err);
      }

      // check to make sure account has associated email in data
      account.email = account.email || doc.email;

      // now we need to register the parent/volunteer
      registerAccount(doc.role, account, function(err, account) {
        if (err) {
          console.log(err);
          doc.remove();
          return next(err);
        }

        res.status(201).json({});
      });

    });
  });


module.exports = router;


function registerUser(user, hostname, callback) {

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
      "url": hostname + '/verify?key=' + uid + '&email=' + encodeURIComponent(doc.email)
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


function registerAccount(role, account, callback) {

  if (role === 'parent') {
    return registerParent(account, callback);
  } 
  
  registerVolunteer(account, callback);

}


function registerParent(parent, callback) {

  Parent.create(parent, function(err, doc) {
    if (err) {
      err.status = 400;
      return callback(err);
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

    callback(null, doc);
  });

}


function registerVolunteer(volunteer, callback) {

  Volunteer.create(volunteer, function(err, doc) {
    if (err) {
      err.status = 400;
      return callback(err);
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

    callback(null, doc);
  });

}
