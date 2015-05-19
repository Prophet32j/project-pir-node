var fs = require('fs'),
    mongoose = require('mongoose');

// connect mongo to mongoose
// mongoose.connect(process.env.MONGOLAB_URI || 
//   "mongodb://heroku_app33314683:t6al45aciqoesripvsd62jikae@ds031651.mongolab.com:31651/heroku_app33314683");

/*
 * initializes all models and sources them as .model-name
 */
fs.readdirSync(__dirname).forEach(function(file) {
  if (file !== 'index.js') {
    var moduleName = file.split('.')[0];
    exports[moduleName] = require('./' + moduleName);
  }
});