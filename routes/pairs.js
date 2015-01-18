var express = require('express');
var Pair = require('./../models/pair');

var bodyParser = require('body-parser');
var urlencoded = bodyParser.urlencoded({ extended: true });
var jsonparser = bodyParser.json();

var router = express.Router();

router.route('/')
  .get(function(req, res) {
    // query allowed on ids[] and approved
    Pair.find(parseQuery(req.query), null, { lean: true })
    .populate('volunteer reader', 'first_name last_name')
    .exec(function(err, docs) {
      if (err) {return res.status(500).json(err);}
      
      var json = {
        pairs: docs,
        meta: {
          count: docs.length
        }
      }
      res.json(json);
    });
  })
  .post(urlencoded, jsonparser, function(req, res) {
    var pair = req.body

    // need to save this reference into Reader and Volunteer
    Pair.create(pair, function(err, doc) {
      if (err) return res.status(400).json(err);
      
      res.status(201).json({ pair: doc });
    });
  });

router.param('id', function(req, res, next, id) {
  Pair.findById(id)
  .populate('volunteer reader', 'first_name last_name')
  .exec(function(err, doc) {
    if (err) return next(err);
    if (!doc) return res.status(404).json('pair not found');
    
    req.pair = doc;
    next();
  });
});

router.route('/:id')
  .get(function(req, res) {
    res.json({ pair: req.pair });
  })
  .put(urlencoded, jsonparser, function(req, res) {
    var pair = req.body.pair;

    // iterate through sent pair properties and modify pair
    Object.getOwnPropertyNames(pair).forEach(function(name) {
      req.pair[name] = pair[name];
    });

    req.pair.save(function(err, doc) {
      if (err) {console.log(err); return res.status(400).json(err)};
      
      res.status(204).json({});
    });
  })
  .delete(function(req, res) {
    req.pair.remove(function(err, doc) {
      if (err) return res.status(500).json(err);
      
      res.status(204).json({});
    });
  });

function parseQuery(query) {
  var conditions = {}
  if (query.ids)
    conditions._id = { $in: query.ids };
  else if (query.volunteer)
    conditions.volunteer = query.volunteer;
  else if (query.hasOwnProperty('approved'))
    conditions.approved = query.approved;
  
  return conditions;
}

module.exports = router;