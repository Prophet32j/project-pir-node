var express = require('express');
var models = require('./../../models'),
    Volunteer = models.volunteer,
    Pair = models.pair;

var Mailer = require('./../../mailer');

var router = express.Router();

router.route('/')
  .get(function(req, res) {
    Volunteer.find(parseQuery(req.query), null, { lean: true }, function(err, docs) {
      if (err) 
        return res.status(500).json({ error: err });
      
      res.json({ volunteers: docs });
    });
  })
  .post(function(req, res) {
    var data = req.body;
    Volunteer.create(data, function(err, doc) {
      if (err) 
        return res.status(400).json({ error: err });

      var mailer = new Mailer();
      mailer.loadTemplateAndCompile('volunteer-confirmation', doc.toJSON(), function(err, html) {
        if (err)
          return res.status(500).json({ error: err });

        var to = [{
          email: doc.email,
          name: doc.first_name + ' ' + doc.last_name
        }];
        var from = {
          email: 'josh.hardy.ufen@gmail.com',
          name: 'Partners In Reading'
        };
        var subject = 'Volunteer Registration Confirmation';

        mail.sendEmail(to, from, subject, html, function(err, emails) {
          if (err) 
            return res.status(500).json({ error: err });
          
          res.status(201).json({ volunteer: doc });
        });

      });
    });
  });

// parse param value to determine if it's email or id
router.param('id', function(req, res, next, id) {
  // check if id is an hex value or email
  var regex = /@/;
  if (regex.test(id)) { 
    Volunteer.findByEmail(id, function(err, doc) {
      if (err) 
        return next(err);
      if (!doc) 
        return res.status(404).json({ error: new errors.NotFoundError('volunteer_not_found', { message: 'Email not found' }) });
      
      req.volunteer = doc;
      next();
    });
  }
  else {
    Volunteer.findById(id, function(err, doc) {
      if (err) 
        return next(err);
      if (!doc) 
        return res.status(404).json({ error: new errors.NotFoundError('volunteer_not_found', { message: 'Volunteer ID not found' }) });

      req.volunteer = doc;
      next();
    });
  }
});

router.route('/:id')
  .get(function(req, res) {
    res.json({ volunteer: req.volunteer });
  })
  .put(function(req, res) {
    var json = req.body;
    Volunteer.findByIdAndUpdate(req.volunteer._id, json.volunteer, function(err, doc, numAffected) {
      if (err) 
        return res.status(400).json({ error: err });
      
      res.sendStatus(204);
    });
  })
  .delete(function(req, res) {
    req.volunteer.remove(function(err) {
      if (err) 
        return res.status(500).json({ error: err });
      
      res.status(204).json({});
    });
  });

router.get('/:id/pairs', function(req, res) {
    Pair.find({ volunteer: req.volunteer._id }, null, { lean: true }, function(err, docs) {
      if (err)
        return res.status(500).json({ error: err });

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