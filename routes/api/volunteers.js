var express = require('express');
var models = require('./../../models'),
    Volunteer = models.volunteer,
    Pair = models.pair;

var Mailer = require('./../../mailer');

var router = express.Router();

router.route('/')
  .get(function(req, res, next) {
    Volunteer.find(parseQuery(req.query), null, { lean: true }, function(err, docs) {
      if (err) {
        err.status = 500;
        return next(err);
      }
      
      res.json({ volunteers: docs });
    });
  })
  .post(function(req, res, next) {
    var data = req.body;
    Volunteer.create(data, function(err, doc) {
      if (err) {
        err.status = 400;
        return next(err);
      }

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
   
      res.status(201).json({ volunteer: doc });
    });
  });

// parse param value to determine if it's email or id
router.param('id', function(req, res, next, id) {
  // check if id is an hex value or email
  var regex = /@/;
  if (regex.test(id)) { 
    Volunteer.findByEmail(id, function(err, doc) {
      if (err) {
        return next(err);
      }
      if (!doc) {
        return next(new errors.NotFoundError('volunteer_not_found', { message: 'Email not found' }));
      }
      
      req.volunteer = doc;
      next();
    });
  }
  else {
    Volunteer.findById(id, function(err, doc) {
      if (err) {
        return next(err);
      }
      if (!doc) {
        return next(new errors.NotFoundError('volunteer_not_found', { message: 'Volunteer ID not found' }));
      }

      req.volunteer = doc;
      next();
    });
  }
});

router.route('/:id')
  .get(function(req, res, next) {
    res.json({ volunteer: req.volunteer });
  })
  .put(function(req, res, next) {
    var json = req.body;
    Volunteer.findByIdAndUpdate(req.volunteer._id, json.volunteer, function(err, doc, numAffected) {
      if (err) {
        err.status = 400;
        return next(err);
      }
      
      res.sendStatus(204);
    });
  })
  .delete(function(req, res, next) {
    req.volunteer.remove(function(err) {
      if (err) {
        err.status = 500;
        return next(err);
      }
      
      res.status(204).json({});
    });
  });

router.get('/:id/pairs', function(req, res, next) {
    Pair.find({ volunteer: req.volunteer._id }, null, { lean: true }, function(err, docs) {
      if (err) {
        err.status = 500;
        return next(err);
      }

      res.json({ pairs: docs });
    });
  });

function parseQuery(query) {
  var conditions = {}
  if (query.ids)
    conditions._id = { $in: query.ids };
  if (query.hasOwnProperty('activated'))
    conditions.activated = query.activated;
  return conditions;
}

module.exports = router;