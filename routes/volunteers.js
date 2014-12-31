var express = require('express');
var Volunteer = require('./../models/volunteer');

var bodyParser = require('body-parser');
var urlencoded = bodyParser.urlencoded({ extended: false });
var jsonparser = bodyParser.json();

var router = express.Router();

router.route('/')
  .get(function(req, res) {
    Volunteer.find(function(err, docs) {
      if (err) return res.status(500).json(err);
      
      var json = {
        volunteers: docs,
        meta: {
          count: docs.length
        }
      }
      res.json(json);
    });
  })
  .post(urlencoded, jsonencoded, function(err, docs) {
    var data = req.body;
    Volunteer.create(data, function(err, doc) {
      if (err) return res.status(400).json(err);
      
      res.status(201).json(doc);
    });
  });

// parse param value to determine if it's email or id
router.param('id', function(req, res, next, id) {
  // check if id is an hex value or email
  var regex = /@/;
  if (regex.test(id)) {
    Volunteer.findByEmail(id, function(err, doc) {
      if (err) return next(err);
      if (!doc) return res.status(404).send('Email not found');
      
      req.volunteer = doc;
      return next();
    });
  }
  else
    Volunteer.findById(id, function(err, doc) {
      if (err) return next(err);
      if (!doc) return res.status(404).send('id not found');

      req.volunteer = doc;
      next();
    });
});

router.route('/:id')
  .get(function(req, res) {
    res.json(req.volunteer);
  })
  .put(function(req, res) {
    res.sendStatus(501);
  })
  .delete(function(req, res) {
    req.volunteer.remove(function(err) {
      if (err) return res.status(500).json(err);
      
      res.sendStatus(204);
    });
  });

module.exports = router;