var express = require('express');

var Reader = require('./../models/reader');
var Parent = require('./../models/parent');

var bodyParser = require('body-parser');
var urlencoded = bodyParser.urlencoded({ extended: false });
var jsonparser = bodyParser.json();

var router = express.Router();

router.route('/')
  .get(function(req, res) {
    // we need to be able to query based on parent first and foremost
    Reader.find(parseQuery(req.query), function(err, docs) {
      if (err) return res.status(500).json(err);
      
      var json = {
        readers: docs,
        meta: {
          count: docs.length
        }
      }
      res.json(json);
    });
  })
  .post(urlencoded, jsonparser, function(req, res) {
    var data = req.body;
    // ensure there is a parent to save the reader to
    Parent.findById(data.parent, function(err, parent) {
      if (err) return res.status(400).json(err);
      if (!parent) return res.status(400).json('parent does not exist');
      
      Reader.create(data, function(err, doc) {
        if (err) return res.status(400).json(err);
      
        // save into parent object this objectid
        parent.readers.push(doc._id);
        parent.save();
        
        res.status(201).json({ reader: doc });
    });
    });
    
  });

router.param('id', function(req, res, next, id) {
  Reader.findById(id, function(err, doc) {
    if (err) return next(err);
    if (!doc) return res.status(404).send('id not found');
    
    req.reader = doc;
    next();
  });
});

router.route('/:id')
  .get(function(req, res) {
    res.json({ reader: req.reader });
  })
  .put(urlencoded, jsonparser, function(req, res) {
    var json = req.body;
    Reader.findByIdAndUpdate(req.reader._id, json.reader, function(err, doc, numAffected) {
      if (err) return res.status(400).json(err);
      
      res.sendStatus(204);
    });
  })
  .delete(function(req, res) {
    req.reader.remove(function(err) {
      if (err) return res.status(500).json(err);
      
      res.status(204).json({});
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
  return conditions;
}

module.exports = router;