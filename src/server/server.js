var express = require('express'),
    app = express();
var bodyParser = require('body-parser');
var path = require('path');
var morgan = require('morgan');
var routeHandler = require('./routes');
var mongoose = require('mongoose');
var config = require('./config/config.json');
var cons = require('consolidate');

// connect to Mongo and Mongoose
mongoose.connect(process.env.MONGOLAB_URI || config.mongodb.url);

// console.log(path.join(__dirname, 'src/server/views'));
app.engine('dust', cons.dust);
app.set('view engine', 'dust');
app.set('views', path.join(__dirname, 'views'));

app.use(morgan('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// mount web pages
routeHandler.mountRoutes(app);

// static file serving
app.use(express.static(path.join(__dirname, '../client')));

// error handlers
handleErrors();

module.exports = app;


function handleErrors() {

  // catch 404 and forward to error handler
  app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  // development error handler
  // will print stacktrace
  if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
      res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: err
      });
    });
  }

  // production error handler
  // no stacktraces leaked to user
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: {}
    });
  });
}