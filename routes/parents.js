var express = require('express');

var Parent = require('./../models/parent');
var Reader = require('./../models/reader');

var bodyParser = require('body-parser');
var urlencoded = bodyParser.urlencoded({ extended: false });
var jsonparser = bodyParser.json();

var router = express.Router();

router.route('/')
  .get(function(req, res) {
    // parse query params and send to find()
    Parent.find(parseQuery(req.query), null, { lean: true }, function(err, docs) {
      if (err)
        return res.status(500).json(err);
      var json = {
        parents: docs,
        meta: {
          count: docs.length
        }
      }
      res.json(json);
    });
  })
  .post(urlencoded, jsonparser, function(req, res) {
    var data = req.body;
    Parent.create(data, function(err, doc) {
      if (err)
        return res.status(400).json(err);

      res.status(201).json({ parent: doc });
    });
  });

// parse param value to determine if it's email or id
router.param('id', function(req, res, next, id) {
  // check if id is an hex value or email
  var regex = /@/;
  if (regex.test(id)) { 
    Parent.findByEmail(id, function(err, doc) {
      if (err) return next(err);
      if (!doc) return res.status(404).json('Email not found');
      
      req.parent = doc;
      next();
    });
  }
  else
    Parent.findById(id, function(err, doc) {
      if (err) return next(err);
      if (!doc) return res.status(404).json('id not found');

      req.parent = doc;
      next();
    });
});

router.route('/:id')
  .get(function(req, res) {
    // we need to send along the readers, reduce amount of requests
    var json = {
      parent: req.parent
    }
    if (!req.parent.readers.length)
      return res.json(json);
    
    Reader.findByParentId(req.parent._id, function(err, docs) {
      if (err) return res.status(500).json(err);
      json.readers = docs;

      res.json(json);
    });
  })
  .put(urlencoded, jsonparser, function(req, res) {
    var parent = req.parent;
//     console.log(req.body);
    Parent.findByIdAndUpdate(parent._id, req.body, function(err, doc, numAffected) {
      if (err) return res.status(400).json(err);

      res.sendStatus(204);
    });
  })
  .delete(function(req, res) {
    req.parent.remove(function(err) {
      if (err) return res.status(500).json(err);

      res.status(204).json({});
    });
  });

function parseQuery(query) {
  var conditions = {}
  if (query.ids)
    conditions._id = { $in: query.ids }
  else if (query.hasOwnProperty('activated'))
    conditions.activated = query.activated;
  return conditions;
}

module.exports = router;