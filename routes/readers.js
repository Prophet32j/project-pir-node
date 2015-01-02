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
    console.log(data);
    Reader.create(data, function(err, doc) {
      if (err) return res.status(400).json(err);
      
      // save into parent object this objectid
      Parent.findAndInsertReader(doc.parent, doc._id, function(err, p_doc, numAffected) {
        if (err) return res.status(500).json(err);
        
        res.status(201).json(doc);
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
    res.json(req.reader);
  })
  .put(function(req, res) {
    var reader = req.body.reader;
    Reader.findByIdAndUpdate(reader._id, reader, function(err, doc, numAffected) {
      if (err) return res.status(400).json(err);
      
      res.sendStatus(204);
    });
  })
  .delete(function(req, res) {
    req.reader.remove(function(err) {
      if (err) return res.status(500).json(err);
      
      res.sendStatus(204);
    });
  });

function parseQuery(query) {
  var conditions = {}
  if (query.ids)
    conditions._id = { $in: query.ids }
  if (query.parent)
    conditions.parent = query.parent;
  if (query.hasOwnProperty('special_needs'))
    conditions.special_needs = query.special_needs;
  if (query.hasOwnProperty('language_needs'))
    conditions.language_needs = query.language_needs;
  return conditions;
  
}

module.exports = router;