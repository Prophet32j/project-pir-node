var express = require('express');
var router = express.Router();

router.route('/')
  .get(function(req, res, next) {
    res.render('forgot-password', { title: 'Forgot Password' });
  })
  .post(function(req, res, next) {
    var data = req.body;
    
  });

module.exports = router;