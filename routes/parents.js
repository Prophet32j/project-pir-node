var express = require('express');
var Parent = require('./../models/parent');

var bodyParser = require('body-parser');
var urlencoded = bodyParser.urlencoded({ extended: false });
var jsonparser = bodyParser.json();

var router = express.Router();

router.route('/')
  .get(function(req, res) {
    // get all parents
    Parent.find(function(err, docs) {
      if (err)
        return res.status(500).json(err);
      
      res.json(docs);
    });
  })
  .post(urlencoded, jsonparser, function(req, res) {
    var data = req.body;
    console.log(data);
    Parent.create(data, function(err, doc) {
      if (err)
        return res.status(400).json(err);
      console.log(doc);
      res.status(201).json(doc);
    });
  });

// parse param value to determine if it's email or id
router.param('id', function(req, res, next, id) {
  // check if id is an hex value or email
  var regex = /@/;
  if (regex.test(id)) {  // it's an email
    Parent.findByEmail(id, function(err, doc) {
      if (err)
        return next(err);
      
      req.parent = doc;
      next();
    });
  } else {  // it's a hex value
    Parent.findById(id, function(err, doc) {
      if (err)
        return next(err);
      
      req.parent = doc;
      next();
    });
  }
});

router.route('/:id')
  .get(function(req, res) {
    res.json(req.parent);
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