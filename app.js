var express = require('express'),
    app = express();
var bodyParser = require('body-parser');
var authjwt = require('./auth/auth-jwt');
var path = require('path');
var morgan = require('morgan');

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


// application routes
// secure all API routes with tokens
app.use('/api', authjwt(config.jwt_secret).unless({ path: /\/api\/users\/exists/i }));


app.use('/', require('./routes'));
app.use('/login', require('./routes/login'));
app.use('/register', require('./routes/register'));
app.use('/verify', require('./routes/verify'));


// mount API
require('./routes/api')(app);

// error handlers
handleErrors();
app.use(handleApiErrors);


module.exports = app;



function handleApiErrors(err, req, res, next) {  
  res.status(err.status || 500);
  res.json({ error: err });
}

function handleErrors() {
  var regex = /^\/api\//i;

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
      if (regex.test(req.path)) {
        return next(err);
      }
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
    if (regex.test(req.path)) {
      return next(err);
    }
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: {}
    });
});
}