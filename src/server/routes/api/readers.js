var express = require('express'),
    router = express.Router();
var errors = require('rm-errors');
var models = require('./../../models'),
    Reader = models.reader,
    Parent = models.parent,
    Pair = models.pair;
var Mailer = require('./../../mailer');

router.route('/')
  .get(function(req, res) {
    // we need to be able to query based on parent first and foremost
    Reader.find(parseQuery(req.query), null, { lean: true }, function(err, docs) {
      if (err) {
        err.status = 500;
        return next(err);
      }
      
      res.json({ readers: docs });
    });
  })
  .post(function(req, res) {
    var data = req.body;
    // ensure there is a parent to save the reader to
    Parent.findById(data.parent, function(err, parent) {
      if (err) {
        err.status = 500;
        return next(err);
      }
      if (!parent) {
        return next(new errors.NotFoundError('parent_not_found', { message: 'Parent ID not found' }));
      }
      
      Reader.create(data, function(err, doc) {
        if (err) {
          err.status = 400;
          return next(err);
        }
      
        // save into parent object this objectid
        parent.readers.push(doc._id);
        parent.save();
        
        res.status(201).json({ reader: doc });
    });
    });
    
  });

router.param('id', function(req, res, next, id) {
  Reader.findById(id, function(err, doc) {
    if (err) {
      return next(err);
    }
    if (!doc) {
      return next(new errors.NotFoundError('reader_not_found', { message: 'Reader ID not found' }));
    }
    
    req.reader = doc;
    next();
  });
});

router.route('/:id')
  .get(function(req, res) {
    res.json({ reader: req.reader });
  })
  .put(function(req, res) {
    var json = req.body;
    Reader.findByIdAndUpdate(req.reader._id, json.reader, function(err, doc, numAffected) {
      if (err) {
        err.status = 400;
        return next(err);
      }
      
      res.status(204).json({});
    });
  })
  .delete(function(req, res) {
    req.reader.remove(function(err) {
      if (err) {
        err.status = 500;
        return next(err);
      }
      
      res.status(204).json({});
    });
  });

router.get('/:id/parent', function(req, res) {
  Parent.findById(req.reader.parent, function(err, doc) {
    if (err) {
      err.status = 500;
      return next(err);
    }

    res.json({ parent: doc });
  });
});

router.get('/:id/pair', function(req, res) {
  if (!req.reader.pair) {
    return res.status(404).send({ error: new errors.NotFoundError('pair_not_found', { message: 'Pair ID not found' }) });
  }

  Pair.findById(req.reader.pair, function(err, doc) {
    if (err) {
        err.status = 500;
        return next(err);
      }

    res.json({ pair: doc });
  });
});

function parseQuery(query) {
  var conditions = {}
  if (query.ids)
    conditions._id = { $in: query.ids }
  else if (query.parent)
    conditions.parent = query.parent;
  else if (query.hasOwnProperty('special_needs'))
    conditions.special_needs = query.special_needs;
  else if (query.hasOwnProperty('language_needs'))
    conditions.language_needs = query.language_needs;
  else if (query.hasOwnProperty('paired')) {
    conditions.pair = query.paired ? { $ne: null } : null;
  }
  return conditions;
}

module.exports = router;