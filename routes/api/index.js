var fs = require('fs');

module.exports = function(app) {
  fs.readdirSync(__dirname).forEach(function(file) {
    if (file !== 'index.js') {
      var moduleName = file.split('.')[0];

      app.use('/api/' + moduleName, require('./' + moduleName));
    }
  });
}