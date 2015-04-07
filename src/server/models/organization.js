// Organizations are the libraries/schools/NPOs that register

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var req_str = '{PATH} is required';

var schema = new Schema({
  name: { type: String, index: { unique: true }, required: req_str },
  program_manager: { type: Schema.Types.ObjectId, ref: 'Manager', required: req_str },
  address: { type: String, required: req_str },
  city: { type: String, required: req_str },
  state: { type: String, required: req_str },
  phone: { type: String, required: req_str },
  contact: { type: String, required: req_str },
  program_hours: {}
});

schema.statics.findByName = function(name, callback) {
  this.find({ name: name }, callback);
}

schema.statics.findAndRemove = function(id, callback) {
  this.findById(id, function(err, doc) {
    if (err) return callback(err);
    if (!doc) return callback();

    doc.remove(callback);
  });
}

/*
 * middleware hook to remove all accounts
 */
schema.pre('remove', function(next) {
  return next();
});

module.exports = mongoose.model('Organization', schema);