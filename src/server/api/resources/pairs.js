var express = require('express'),
    router = express.Router(),
    errors = require('./../../errors'),
    mailer = require('./../../mailer'),
    models = require('./../../models'),
    Pair = models.pair,
    Reader = models.reader,
    Volunteer = models.volunteer;

router.route('/')
  .get(function(req, res, next) {
    // query allowed on ids[] and approved
    Pair.find(parseQuery(req.query), null, { lean: true })
    .populate('volunteer reader', 'first_name last_name')
    .exec(function(err, docs) {
      if (err) {
        err.status = 500;
        return next(err);
      }
      
      res.json({ pairs: docs });
    });
  })
  .post(function(req, res, next) {
    var pair = req.body

    // need to save this reference into Reader and Volunteer
    Pair.create(pair, function(err, doc) {
      if (err) {
        err.status = 400;
        return next(err);
      }

      var message = {

      };
      var email_data = {

      };
      
      mailer.sendEmail('pair-confirmation', email_data, message, function(err, emails) {
        if (err) {
          err.status = 500;
          return next(err);
        }

        res.status(201).json({ pair: doc });
      });

    });
  });

router.param('id', function(req, res, next, id) {
  Pair.findById(id)
  .populate('volunteer reader')
  .exec(function(err, doc) {
    if (err) {
      err.status = 500;
      return next(err);
    }
    if (!doc) {
      return next(new errors.NotFoundError('id_not_found', { message: 'ID not found' }));
    }
    
    req.pair = doc;
    next();
  });
});

router.route('/:id')
  .get(function(req, res, next) {
    res.json({ pair: req.pair });
  })
  .put(function(req, res, next) {
    var pair = req.body.pair;

    // iterate through sent pair properties and modify pair
    Object.getOwnPropertyNames(pair).forEach(function(name) {
      req.pair[name] = pair[name];
    });

    req.pair.save(function(err, doc) {
      if (err) {
        err.status = 400;
        return next(err);
      }
      
      res.status(204).json({});
    });
  })
  .delete(function(req, res, next) {
    req.pair.remove(function(err, doc) {
      if (err) {
        err.status = 500;
        return err(next);
      }
      
      res.status(204).json({});
    });
  });


router.get('/:id/reader', function(req, res, next) {
    Reader.findById(req.pair.reader, function(err, doc) {
      if (err) {
        err.status = 500;
        return next(err);
      }

      res.json({ reader: doc });
    });
  });


router.get('/:id/volunteer', function(req, res, next) {
    Volunteer.findById(req.pair.volunteer, function(err, doc) {
      if (err) {
        err.status = 500;
        return next(err);
      }

      res.json({ volunteer: doc });
    });
  });

function parseQuery(query) {
  var conditions = {}
  if (query.ids)
    conditions._id = { $in: query.ids };
  else if (query.volunteer)
    conditions.volunteer = query.volunteer;
  else if (query.hasOwnProperty('approved'))
    conditions.approved = query.approved;
  
  return conditions;
}

module.exports = router;