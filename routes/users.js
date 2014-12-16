var express = require('express');
var redis = require('redis');

var bodyParser = require('body-parser');
var urlencoded = bodyParser.urlencoded({ extended: false });

var client = redis.createClient();

var router = express.Router();

router.route('/')
  .get(function(req, res) {
    client.smembers('users', function(err, users) {
      if (err) throw err;
      
      res.json(users);
    });
  })
  .post(urlencoded, function(req, res) { // uses a JSON parser first to populate body
    var user = req.body;
    console.log(user);
    client.sadd('users', user.username, function(success) {
      if (!success) {
        res.status(400).send('User already exists!');
        return false;
      }
      client.set(user.username, user, function(err) {
        if (err) throw err;
        res.status(201).json(user.username);
      });
    });
  });

module.exports = router;

