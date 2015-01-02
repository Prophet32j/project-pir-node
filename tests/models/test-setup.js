var mongoose = require('mongoose');
var uri = 'mongodb://localhost/test';

module.exports = function(callback) {
  if (mongoose.connection.db) return callback();
    require('./../../models/schemas').init();
    mongoose.connect(uri, callback);
}