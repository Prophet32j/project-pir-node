var express = require('express'),
    router = express.Router(),
    errors = require('./../../errors'),
    mailer = require('./../../mailer'),
    models = require('./../../models'),
    User = models.user;

router.route('/')
  .get(function(req, res, next) {
    User.find(parseQuery(req.query), null, { lean: true }, function(err, docs) {
      if (err) {
        err.status = 500;
        return next(err);
      }

      res.json({ users: docs });
    });
  })
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
        "url": req.hostname + '/verify?key=' + uid + '&email=' + encodeURIComponent(doc.email)
      }

      mailer.sendEmail('email-confirmation', email_data, message, function(err, emails) {
        if (err) {
          console.err('Mandrill API Error: ', err.stack);
        }
      });

      res.status(201).json({ user: doc });
    });
  });

router.param('id', function(req, res, next, id) {
  // check if id is an hex value or email
  var regex = /@/;
  if (regex.test(id)) { 
    User.findByEmail(id, function(err, doc) {
      if (err) {
        return next(err);
      }
      if (!doc) {
        return next(new errors.NotFoundError('user_not_found', { message: 'Email not found' }));
      }
      
      req.user = doc;
      next();
    });
  }
  else {
    User.findById(id, function(err, doc) {
      if (err) {
        return next(err);
      }
      if (!doc) {
        return next(new errors.NotFoundError('user_not_found', { message: 'User ID not found' }));
      }

      req.user = doc;
      next();
    });
  }
});

router.route('/:id')
  .get(function(req, res, next) {
    res.json({ user: req.user });
  })
  .put(function(req, res, next) {
    User.findByIdAndUpdate(req.user._id, req.body, function(err, doc, numAffected) {
      if (err) {
        err.status = 400;
        return next(err);
      }

      res.status(204).json({});
    });
  })
  .delete(function(req, res, next) {
    req.user.remove(function(err) {
      if (err) {
        err.status = 500;
        return next(err);
      }

      res.status(204).json({});
    });
  });

router.get('/exists/:id', function(req, res, next) {
  res.status(204).json({});
});

function parseQuery(query) {
  var conditions = {};
  if (query.ids)
    conditions._id = { $in: query.ids };
  else if (query.type)
    conditions.type = query.type;
  else if (query.hasOwnProperty('activated'))
    conditions.activated = query.activated;
  return conditions;
}

module.exports = router;