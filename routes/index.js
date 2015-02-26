var express = require('express'),
    app = express();
var api = require('./api');

app.get('/', function(req, res, next) {
  res.render('index', { title: 'Home' });
});

app.get('/about', function(req, res, next) {
  res.render('about', { title: 'About' });
});

app.get('/contact', function(req, res, next) {
  res.render('contact', { title: 'Contact' });
});

app.use('/forgot-password', require('./forgot-password'));
app.use('/register', require('./register'));
app.use('/verify', require('./verify'));
app.use('/login', require('./login'));
app.use('/logout', require('./logout'));

// mount API
app.use('/api', api);


module.exports = app;
