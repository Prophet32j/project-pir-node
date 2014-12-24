// Admin model will be used since we are getting rid of User model

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true, select: false },
  created: { type: Date, default: Date.now },
  last_login: { type: Date, default: null },
  activated: { type: Boolean, default: false }
});

/*
 * find Admin by email
 * @param email of the Admin
 * @param callback function(error, doc)
 */   
schema.statics.findByEmail = function(email, callback) {
  this.findOne({ email: email }, callback);
}

module.exports = mongoose.model('Admin', schema);