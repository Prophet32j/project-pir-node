// var express = require('express');
// var User = require('./../models/user');

// var bodyParser = require('body-parser');
// var urlencoded = bodyParser.urlencoded({ extended: false });

// var router = express.Router();

// router.route('/')
//   .get(function(req, res) {
    
//     // we need to check for query params, filters
// //     if (req.query.first_name) {
// //       User.find({first_name: req.query.first_name}, function(err, users) {
// //         if (err) return res.status(500).json(err);
        
// //         return res.status(200).json(users);
// //       });
// //     }
// //     else
//       User.find(function(err, docs) {
//         if (err) {
//           // what is the error?
//           return res.status(400).send(err);
//         }

//         res.json(docs);
//       });
//   })
//   .post(urlencoded, function(req, res) { // uses a JSON parser first to populate body
//     var userData = req.body;
//     console.log(userData);
    
//     var user = new User(userData);
//     console.log(user);
//     user.save(function(err) {
//       if (err) {
//         // we need to check what the error was
//         return res.status(400).send(err);
//       }
//       res.status(201).json(user);
//     });
//   });

// router.route('/:id')
//   .get(function(req, res) {
//     User.findById(req.params.id, function(err, doc) {
//       if (err) {
//         // what error was thrown??
//         return res.status(400).send(err);
//       }
//       if (!doc)
//         return res.status(404).json('ID was not found in system');
      
//       // user was found, send it
//       res.json(doc);
//     });
//   })
//   .put(urlencoded, function(req, res) {
//     var userData = req.body;
    
//     User.findByIdAndUpdate(req.params.id, function(err, doc) {
//       if (err) { 
//         return res.status(400).send(err);
//       }
//       user.data = userData;
//       user.save(function(err, user) {
//         res.status(200).json(user);
//       });
//     });
//   })
//   .delete(function(req, res) {
//     User.findByIdAndRemove(req.params.id, function(err, doc) {
//       if (err) { 
//         return res.status(400).send(err);
//       }
//       res.status(204).json(doc);
//     });
//   });

// module.exports = router;

