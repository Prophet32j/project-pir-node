// Admin model will be used since we are getting rid of User model

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    req_str = '{PATH} is required';

var schema = new Schema({
  email: { type: String, index: { unique: true }, required: req_str },
  first_name: { type: String, required: req_str },
  last_name: { type: String, required: req_str },
  phone: { type: String, required: req_str },
});

/*
 * find Admin by email
 * @param email of the Admin
 * @param callback function(error, doc)
 */   
schema.statics.findByEmail = function(email, callback) {
  this.findOne({ email: email }, callback);
}

/*
 * find User by email and remove the document.
 * This method will fire any middleware hooks
 * @param email of the User
 * @param callback function(error, doc)
 */
schema.statics.findByEmailAndRemove = function(email, callback) {
  this.findByEmail(email, function(err, doc) {
    if (err || !doc) {
      return callback(err);
    }
    
    doc.remove(callback);
  });
}

module.exports = mongoose.model('Administrator', schema);