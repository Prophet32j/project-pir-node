var express = require('express');
var app = express();

// set up Mongo and Mongoos
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
})

// static file serving
app.use(express.static(__dirname + '/public'));

// routes
var userRoutes = require('./routes/users');
app.use('/users', userRoutes);

module.exports = app;
