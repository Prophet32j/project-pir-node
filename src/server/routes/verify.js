var express = require('express'),
    router = express.Router();
var models = require('./../models'),
    User = models.user;
var errors = require('./../errors');
var redisClient = require('./../bin/redis-client')();
var uuid = require('node-uuid');
var Mailer = require('./../mailer');

router.route('/')
  .get(function(req, res, next) {
    // check to see if they followed the email
    if (!req.query.key || !req.query.email) {
      return res.render('verify', { title: 'Email Verification', status: 'error', message: 'Missing key and/or email' });
    }

    var key = req.query.key;
    var email = req.query.email;
    User.activate(email, key, function(err, doc) {
      if (err) {
        console.log(err);
        if (err.status == 500) {
          return next(err);
        } else {
          return res.render('verify', { title: 'Email Verification', status: 'error', message: err.message });
        }
      }
      if (!doc) {
        return res.render('verify', { title: 'Email Verification', status: 'error', message: 'Key not found' });
      }

      // let's send out a success email
      var mailer = new Mailer();
      var message = {
        to: [{ email: email }],
        subject: 'Email Address Activated'
      }
      mailer.sendEmail('email-confirmed', {}, message, function(err, emails) {
        if (err) {
          console.error('Mandrill API Error: ', err.stack);
        }
      });
      
      res.render('verify', { title: 'Email Verification', status: 'success' });
    });
  })
  .post(function(req, res, next) {
    // send another verification email
    var email = req.body.email;
    if (!email) {
      var err = new errors.InvalidRequestError('request_body_missing_email', { message: 'Email not sent in request body' });
      return res.status(400).json({ error: err });
    }

    // send new email and with new key

    // delete the key if it exists first
    redisClient.hdel('activations', email);
    var uid = uuid.v4();
    redisClient.hset('activations', email, uid, function(err, result) {
      if (err) {
        err.status = 500;
        return next(err);
      }

      if (!result) {
        err = new Error('something went wrong writing to the database');
        err.status = 500;
        return next(err);
      }

      // send the email
      var mailer = new Mailer();
      var message = {
        to: [{ email: email }],
        subject: 'Confirm Your Email Address'
      }
      var data = {
        "url": req.hostname + '/verify?key=' + uid + '&email=' + email
      }

      mailer.sendEmail('email-confirmation', data, message, function(err, emails) {
        if (err) {
          console.error('Mandrill API Error: ', err.stack);
        }
      });

      res.sendStatus(204);
    });
  });

module.exports = router;