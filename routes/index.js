var User = require('./../models').user;
var redisClient = require('./../bin/redis-client')();
var mailer = require('./../mailer');

// not REST routes for logging in, logging out, verifying email

exports.logout = function(req, res) {
  var token = req.query.token;
  if (!token)
    return res.status(400).json({error: 'no token found in query, format /logout?token=token' });

  User.logout(token, function(err, result) {
    if (err) 
      return res.status(500).json({ error: err });
    if (!result)
      return res.status(500).json({ error: 'token not deleted from database' });

    res.sendStatus(200);
  });
};

exports.register = function(req, res) {
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
}

exports.verify = function(req, res) {
  if (!req.query.key)
    return res.status(400).json({ error: 'no key found, please check your email for the link' });

  var key = req.query.key;
  User.activate(key, function(err, doc) {
    if (err)
      return res.status(500).json({ error: err });
    if (!doc)
      return res.status(400).json({ error: new Error('uid not found') });

    res.status(204).json({ user: doc });
  });
}