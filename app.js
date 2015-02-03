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
  
  // static file serving
  app.use(express.static(__dirname + '/public'));

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));


  // application routes
  // secure all API routes with tokens
  app.use('/api', authjwt(config.jwt_secret));

  // mount routes
  require('./routes')(app);

});

module.exports = app;