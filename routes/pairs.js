// var express = require('express');
// var Pair = require('./../models/pair');

// var bodyParser = require('body-parser');
// var urlencoded = bodyParser.urlencoded({ extended: false });
// var jsonparser = bodyParser.json();

// var router = express.Router();

// router.route('/')
//   .get(function(req, res) {
//     // need to add functionality to query for approved/unapproved pairs
//     Pair.find(function(err, docs) {
//       if (err) return res.status(500).json(err);
      
//       res.json(docs);
//     });
//   })
//   .post(urlencoded, jsonparser, function(req, res) {
//     var data = req.body;
    
//     Pair.create(data, function(err, doc) {
//       if (err) return res.status(400).json(err);
      
//       res.json(doc);
//     });
//   });

// router.param('id', function(req, res, next, id) {
//   Pair.findById(id, function(err, doc) {
//     if (err) return next(err);
    
//     req.pair = doc;
//     next();
//   })
// });

// router.route('/:id')
//   .get(function(req, res) {
//     res.json(req.pair)
//   })
//   .put(function(req, res) {
//     res.sendStatus(501);
//   })
//   .delete(function(req, res) {
//     req.pair.remove(function(err) {
//       if (err) return res.status(500).json(err);
      
//       res.sendStatus(204);
//     });
//   });

// module.exports = router;