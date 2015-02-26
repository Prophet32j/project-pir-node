// Front Desk model will be used since we are getting rid of User model

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
  email: { type: String, index: { unique: true }, required: '{PATH} is required' },
  first_name: { type: String, required: '{PATH} is required' },
  last_name: { type: String, required: '{PATH} is required' },
  phone: { type: String, required: '{PATH} is required' },
});

/*
 * find FrontDesk by email
 * @param email of the FrontDesk
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

module.exports = mongoose.model('FrontDesk', schema);