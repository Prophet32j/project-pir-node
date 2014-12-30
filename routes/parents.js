var express = require('express');

var Parent = require('./../models/parent');
var Reader = require('./../models/reader');

var bodyParser = require('body-parser');
var urlencoded = bodyParser.urlencoded({ extended: false });
var jsonparser = bodyParser.json();

var router = express.Router();

router.route('/')
  .get(function(req, res) {
    // get all parents
    // need to figure out query
    Parent.find(function(err, docs) {
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

      res.status(201).json(doc);
    });
  });

// parse param value to determine if it's email or id
router.param('id', function(req, res, next, id) {
  // check if id is an hex value or email
  var regex = /@/;
  if (regex.test(id)) { 
    Parent.findByEmail(id, function(err, doc) {
      if (err) return next(err);
      if (!doc) return res.status(404).send('Email not found');
      
      req.parent = doc;
      return next();
    });
  }
  else
    Parent.findById(id, function(err, doc) {
      if (err) return next(err);
      if (!doc) return res.status(404).send('id not found');

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
    res.sendStatus(501);
  })
  .delete(function(req, res) {
    req.parent.remove(function(err) {
      if (err) return res.status(500).json(err);
      
      res.sendStatus(204);
    });
  });

module.exports = router;