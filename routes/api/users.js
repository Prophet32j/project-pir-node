var express = require('express');
var models = require('./../../models'),
    User = models.user;

// var bodyParser = require('body-parser');
// var urlencoded = bodyParser.urlencoded({ extended: true });
// var jsonparser = bodyParser.json();

var router = express.Router();

router.route('/')
  .get(function(req, res) {
    User.find(parseQuery(req.query), null, { lean: true }, function(err, docs) {
      if (err) return res.status(500).send(err);

      res.json({ users: docs });
    });
  })
  .post(/*urlencoded, jsonparser, */function(req, res) {
    var data = req.body;
    // need to validate submitted data...later
    console.log(data);
    User.create(data, function(err, doc) {
      if (err) return res.status(400).json(err);

      // need to send email here to set up email validation
      
      res.status(201).json({ user: doc });
    });
  });

router.param('id', function(req, res, next, id) {
  // check if id is an hex value or email
  var regex = /@/;
  if (regex.test(id)) { 
    User.findByEmail(id, function(err, doc) {
      if (err) return next(err);
      if (!doc) return res.status(404).json('Email not found');
      
      req.user = doc;
      next();
    });
  }
  else
    User.findById(id, function(err, doc) {
      if (err) return next(err);
      if (!doc) return res.status(404).json('id not found');

      req.user = doc;
      next();
    });
});

router.route('/:id')
  .get(function(req, res) {
    res.json({ user: req.user });
  })
  .put(/*urlencoded, */function(req, res) {
    User.findByIdAndUpdate(req.user._id, req.body, function(err, doc, numAffected) {
      if (err) return res.status(400).json(err);

      res.status(204).json({});
    });
  })
  .delete(function(req, res) {
    req.user.remove(function(err) {
      if (err) return res.status(500).json(err);

      res.status(204).json({});
    });
  });

function parseQuery(query) {
  var conditions = {};
  if (query.ids)
    conditions._id = { $in: query.ids };
  else if (query.type)
    conditions.type = query.type;
  else if (query.hasOwnProperty('activated'))
    conditions.activated = query.activated;
  return conditions;
}

module.exports = router;