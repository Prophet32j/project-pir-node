var express = require('express');
var User = require('./../models/user');

var bodyParser = require('body-parser');
var urlencoded = bodyParser.urlencoded({ extended: false });

var router = express.Router();

router.route('/')
  .get(function(req, res) {
    User.find(function(err, users) {
      if (err) throw err;
      
      res.json(users);
    });
  })
  .post(urlencoded, function(req, res) { // uses a JSON parser first to populate body
    var userData = req.body;
    console.log(userData);
    
    var newUser = new User(userData);
    console.log(newUser);
    res.status(201).json(newUser);
  });

module.exports = router;

