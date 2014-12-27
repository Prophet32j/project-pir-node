var express = require('express');

var Reader = require('./../models/reader');
var Parent = require('./../models/parent');

var bodyParser = require('body-parser');
var urlencoded = bodyParser.urlencoded({ extended: false });
var jsonparser = bodyParser.json();

var router = express.Router();

router.route('/')
  .get(function(req, res) {
    Reader.find(function(err, docs) {
      if (err) return res.status(500).json(err);
      
      res.json(docs);
    });
  })
  .post(urlencoded, jsonparser, function(req, res) {
    var data = req.body;
    Reader.create(data, function(err, doc) {
      if (err) return res.status(400).json(err);
      
      // save into parent object this objectid
      Parent.findById(doc.parent_id, function(err, parent) {
        parent.readers.push(doc._id);
        parent.save();
      });
      res.status(201).json(doc);
    });
  });

router.param('id', function(req, res, next, id) {
  Reader.findById(id, function(err, doc) {
    if (err) return next(err);
    
    req.reader = doc;
    next();
  });
});

router.route('/:id')
  .get(function(req, res) {
    res.json(req.reader);
  })
  .put(function(req, res) {
    res.sendStatus(501);
  })
  .delete(function(req, res) {
    req.reader.remove(function(err) {
      if (err) return res.status(500).json(err);
      
      res.sendStatus(204);
    });
  });

module.exports = router;