var fs = require('fs');

exports.mount = function(app) {

  fs.readdirSync(__dirname).forEach(function(file) {
    if (file !== 'index.js') {
      var parts = file.split('.');
        var moduleName = parts[0];
        app.use('/' + moduleName, require('./' + moduleName));
    }
});

}