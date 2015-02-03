var fs = require('fs');

module.exports = function(app) {
  mountDirectory(__dirname, '', app);
}

function mountDirectory(directory, root, app) {
  fs.readdirSync(directory).forEach(function(file) {
    var parts = file.split('.');
    var moduleName = parts[0];
    if (moduleName !== 'index') { 
      var path = root + '/' + moduleName;
      console.log('path: ' + path);
      console.log('directory: ' + directory);
      if (parts.length < 2) // it's a directory
        mountDirectory(directory + '/' + moduleName, path, app);
      else {
        app.use(path, require('.' + path));
      }
    }
  });
}