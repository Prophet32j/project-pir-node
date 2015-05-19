// Organizations are the libraries/schools/NPOs that register

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    req_str = '{PATH} is required';

var schema = new Schema({
  name: { type: String, required: req_str },
  address: { type: String, required: req_str },
  city: { type: String, required: req_str },
  state: { type: String, required: req_str },
  phone: { type: String, required: req_str },
  contact: { type: String, required: req_str },
  program_hours: {},
  users: [{ type: Schema.Types.ObjectId, ref: 'User' }]
});

/*
 * middleware hook to remove all accounts
 */
schema.pre('remove', function(next) {
  mongoose.model('User').findAndRemove
  return next();
});

module.exports = mongoose.model('Organization', schema);