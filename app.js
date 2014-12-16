var express = require('express');
var app = express();

// static file serving
app.use(express.static(__dirname + '/public'));

// routes
var userRoutes = require('./routes/users');
app.use('/users', userRoutes);

module.exports = app;
