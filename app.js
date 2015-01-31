var express = require('express'),
    app = express();
var bodyParser = require('body-parser')
var authjwt = require('./auth/auth-jwt');

var mongoose = require('mongoose');
var config = require('./config/config.json');

mongoose.connect(process.env.MONGOLAB_URI || config.mongodb.url);

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

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  
  // non-REST utility routes
  var index = require('./routes');
  app.post('/login', index.login);
  app.get('/logout', index.logout);
  app.post('/register', index.register);


  // application routes
  // secure all API routes with tokens
  app.use('/api', authjwt(config.jwt_secret));

  var userRoutes = require('./routes/users');
  app.use('/api/users', userRoutes);
  
  var parentRoutes = require('./routes/parents');
  app.use('/api/parents', parentRoutes);

  var readerRoutes = require('./routes/readers');
  app.use('/api/readers', readerRoutes);

  var volunteerRoutes = require('./routes/volunteers');
  app.use('/api/volunteers', volunteerRoutes);

  var pairRoutes = require('./routes/pairs');
  app.use('/api/pairs', pairRoutes);
});

module.exports = app;