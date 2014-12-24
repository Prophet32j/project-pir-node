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
        return res.status(400).send(err);
      
      res.json(docs);
    });
  })
  .post(urlencoded, jsonparser, function(req, res) {
    var data = req.body;
    console.log(data);
    Parent.create(data, function(err, doc) {
      if (err)
        return res.status(400).send(err);
      console.log(doc);
      res.status(201).json(doc);
    });
  });

// TODO
// http://expressjs.com/api.html#router.param
// parse param value to determine if it's email or id

router.route('/:email')
  .get(function(req, res) {
    Parent.findByEmail(req.params.email, function(err, doc) {
      if (err)
        return res.status(400).send(err);
      
      if (!doc)
        return res.status(404).send('email not found');
      
      res.json(doc);
    });
  })
  .put(function(req, res) {
    res.sendStatus(501);
  })
  .delete(function(req, res) {
    Parent.remove({ email: req.params.email }, function(err) {
      if (err) return res.status(400).send(err);
      
      res.sendStatus(204);
    });
  });

router.route('/:id')
  .get(function(req, res) {
    Parent.findById(req.params.id, function(err, doc) {
      if (err)
        return res.status(400).send(err);
      
      if (!doc)
        return res.status(404).send('id not found');
      
      res.json(doc);
    });
  })
  .put(function(req, res) {
    res.sendStatus(501);
  })
  .delete(function(req, res) {
    Parent.findByIdAndRemove(req.params.id, function(err, doc) {
      if (err)
        return res.status(400).send(err);
      
      if (!doc)
        return res.status(404).send('id not found');
      
      res.sendStatus(204);
    });
  });

module.exports = router;