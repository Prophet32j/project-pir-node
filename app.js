var express = require('express'),
    app = express();
var bodyParser = require('body-parser');
var path = require('path');
var morgan = require('morgan');
var api = require('./routes/api');
var mongoose = require('mongoose');
var config = require('./config/config.json');

// connect to Mongo and Mongoose
mongoose.connect(process.env.MONGOLAB_URI || config.mongodb.url);


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(morgan('dev'));

// static file serving
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// mount web pages
app.use('/', require('./routes'));
app.use('/login', require('./routes/login'));
app.use('/verify', require('./routes/verify'));


// mount API
app.use('/api', api);

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