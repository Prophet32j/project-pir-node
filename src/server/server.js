var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    path = require('path'),
    morgan = require('morgan'),
    routes = require('./routes'),
    mongoose = require('mongoose'),
    config = require('./config/config.json'),
    cons = require('consolidate'),
    api = require('rm-api'),
    subdomain = require('express-subdomain'),
    sessions = require('client-sessions');

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
routes.mount(app);

// mount the API on api. subdomain
app.use(subdomain('api', api));

// static file serving
app.use(express.static(path.join(__dirname, '../client')));

// set cookie sessions
app.use(sessions({
  cookieName: 'session',
  secret: config.secret,
  duration: 7 * 24 * 60 * 60 * 1000,
  activeDuration: 5 * 60 * 1000
}));

app.use(function(req, res, next) {
  if (!req.session.visited) {
    req.session.visited = true;
  }
});

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