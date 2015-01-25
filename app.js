var express = require('express');
var app = express();

var mongoose = require('mongoose');
var config = require('./config/config.json');

mongoose.connect(process.env.MONGOLAB_URI || config.db.uri);

// make sure everything connected correctly
var db = mongoose.connection;
db.on('error', function(err) {
  console.log('Error: ' + err);
  process.exit();
});

db.once('open', function() {
  console.log('Connection open');
  
  // initialize all mongoose models
  require('./models')();
  
  // static file serving
  app.use(express.static(__dirname + '/public'));

  // routes
  var userRoutes = require('./routes/users');
  app.use('/users', userRoutes);
  
  var parentRoutes = require('./routes/parents');
  app.use('/parents', parentRoutes);

  var readerRoutes = require('./routes/readers');
  app.use('/readers', readerRoutes);

  var volunteerRoutes = require('./routes/volunteers');
  app.use('/volunteers', volunteerRoutes);

  var pairRoutes = require('./routes/pairs');
  app.use('/pairs', pairRoutes);
});

module.exports = app;