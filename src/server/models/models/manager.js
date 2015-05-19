var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    errors = require('./../../errors'),
    req_str = '{PATH} is required';

var schema = new Schema({
  email: String,
  organization: { type: Schema.Types.ObjectId, ref: 'Organization', required: req_str },
  first_name: { type: String, required: req_str },
  last_name: { type: String, required: req_str },
});

module.exports = mongoose.model('Manager', schema);