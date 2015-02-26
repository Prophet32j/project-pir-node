var fs = require('fs');

exports.mountRoutes = function(app) {

  /*
   * initializes all models and sources them as .model-name
   */
  fs.readdirSync(__dirname).forEach(function(file) {
    if (file !== 'index.js') {
      var moduleName = file.split('.')[0];
      app.use('/' + moduleName, require('./' + moduleName));
    }
  });


  app.get('/', function(req, res, next) {
    res.render('index', { title: 'Home' });
  });

  app.get('/about', function(req, res, next) {
    res.render('about', { title: 'About' });
  });

  app.get('/contact', function(req, res, next) {
    res.render('contact', { title: 'Contact' });
  });

}
