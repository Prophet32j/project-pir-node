var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Home' });
});

router.get('/about', function(req, res, next) {
  res.render('about', { title: 'About' });
});

router.get('/contact', function(req, res, next) {
  res.render('contact', { title: 'Contact' });
});

router.get('/register', function(req, res, next) {
    res.render('register', { title: 'Register' });
});

router.get('/forgot-password', function(req, res, next) {
  res.render('forgot-password', { title: 'Forgot Password' });
});

module.exports = router;
