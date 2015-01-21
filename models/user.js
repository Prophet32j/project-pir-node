// User Model for handling data layer

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
  email: { type: String, required: '{PATH} is required', index: { unique: true } },
  password: { type: String, required: '{PATH} is required' },
  type: { type: String, required: '{PATH} is required' },
  created: { type: Date, default: Date.now },
  last_login: { type: Date, default: null },
  activated: { type: Boolean, default: false }
});

/*
 * find User by email
 * @param email of the User
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
    if (err) return callback(err);
    if (!doc) return callback();
    
    doc.remove(callback);
  });
}

/*
 * find User by id and remove the document.
 * This method will fire any middleware hooks
 * @param id of the User
 * @param callback function(error, doc)
 */
schema.statics.findAndRemove = function(id, callback) {
  this.findById(id, function(err, doc) {
    if (err) return callback(err);
    if (!doc) return callback();
    
    doc.remove(callback);
  });
}

// middleware hooks

/*
 * remove related parent/volunteer
 */
schema.pre('remove', function(next) {
  switch(this.type) {
    case 'p':
      return mongoose.model('Parent').findAndRemove(this.email, next);
    case 'v':
      return mongoose.model('Volunteer').findAndRemove(this.email, next);
    default:
      next();
  }
});

module.exports = mongoose.model("User", schema);