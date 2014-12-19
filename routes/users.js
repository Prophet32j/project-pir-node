var express = require('express');
var User = require('./../models/user');

var bodyParser = require('body-parser');
var urlencoded = bodyParser.urlencoded({ extended: false });

var router = express.Router();

router.route('/')
  .get(function(req, res) {
    
    // we need to check for query params, filters
    
    User.findAll(function(err, users) {
      if (err) {
        // what is the error?
        return res.status(400).json(err);
      }
      
      res.json(users);
    });
  })
  .post(urlencoded, function(req, res) { // uses a JSON parser first to populate body
    var userData = req.body;
    console.log(userData);
    
    var user = new User(userData);
    user.save(function(err, newUser) {
      if (err) {
        // we need to check what the error was
        return res.status(400).json(err);
      }
      res.status(201).json(newUser);
    });
  });

router.route('/:email')
  .get(function(req, res) {
    var email = req.params.email;
    User.findByEmail(email, function(err, user) {
      if (err) {
        // what error was thrown??
        return res.status(400).json(err);
      }
      if (!user)
        return res.status(404).json('Email was not found in system');
      
      // user was found, send it
      res.json(user);
    });
  })
  .put(urlencoded, function(req, res) {
    
    // TODO
    // implement put method on API
    
    res.sendStatus(501);
  })
  .delete(function(req, res) {
    
    // TODO
    // implement delete method on API
    
    res.sendStatus(501);
  });

module.exports = router;

