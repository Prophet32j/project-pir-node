var express = require('express');
var app = express();

// set up Mongo and Mongoose
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');

// make sure everything connected correctly
var db = mongoose.connection;
db.on('error', function(err) {
  console.log('Error: ' + err);
  process.exit();
});
db.once('open', function() {
  console.log('Connection open');
});

// initialize all mongoose models
require('./models/schemas').init();

// static file serving
app.use(express.static(__dirname + '/public'));

// routes
var parentRoutes = require('./routes/parents');
app.use('/parents', parentRoutes);

var readerRoutes = require('./routes/readers');
app.use('/readers', readerRoutes);

var volunteerRoutes = require('./routes/volunteers');
app.use('/volunteers', volunteerRoutes);

module.exports = app;
