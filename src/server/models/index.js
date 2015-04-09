var fs = require('fs');
var mongoose = require('mongoose');

/*
 * initializes all models and sources them as .model-name
 */
fs.readdirSync(__dirname).forEach(function(file) {
  if (file !== 'index.js') {
    var moduleName = file.split('.')[0];
    exports[moduleName] = require('./' + moduleName);
  }
});

exports.getAccount = function(user, callback) {
  // find accounts
  var email = user.email;
  switch(user.role) {
    case 'parent':
      retrieveParent(email, callback);
      break;
    case 'volunteer':
      mongoose.model('Volunteer').findByEmail(email, callback);
      break;
    case 'administrator':
      mongoose.model('Administrator').findByEmail(email, callback);
      break;
    case 'assistant':
      mongoose.model('Assistant').findByEmail(email, callback);
      break;
    case 'manager':
      mongoose.model('Manager').findByEmail(email, callback);
      break;
    default:
      return callback();
  }
}

function retrieveParent(email, callback) {
  mongoose.model('Parent').findByEmail(email, function(err, parent) {
    if (err) {
      return callback(err);
    }

    mongoose.model('Reader').findByParentId(parent.id, function(err, readers) {
      if (err) {
        return callback(err);
      }

      return callback(null, {
        parent: parent,
        readers: readers
      });
    });
  });
}