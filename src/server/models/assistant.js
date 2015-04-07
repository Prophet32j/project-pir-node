// Assistant model for doing non-administrative tasks

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var req_str = '{PATH} is required';

var schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: req_str },
  email: { type: String, index: { unique: true }, required: req_str },
  first_name: { type: String, required: req_str },
  last_name: { type: String, required: req_str },
  phone: { type: String, required: req_str },
});

/*
 * find assistant by email
 * @param email of the assistant
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

module.exports = mongoose.model('Assistant', schema);