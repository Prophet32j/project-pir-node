// Volunteer Model for handling data layer

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true, select: false },
  created: { type: Date, default: Date.now },
  last_login: { type: Date, default: null },
  activated: { type: Boolean, default: false },
  
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  phone: { type: String, required: true },
  image: { type: String, default: 'default.png' },
  gender: { type: String, required: true },
  first_time: { type: String, default: true },
  orientation_complete: { type: String, default: false },
  background_complete: { type: String, default: false },
  affiliation: { type: String, required: true },
  special_ed: { type: String, default: false },
  language_ed: { type: String, default: false },
  about_me: { type: String, required: true },
  two_children: { type: Boolean, default: false },
  pairs: [{ 
    reader: { type: Schema.Types.ObjectId, ref: 'Reader' },
    day: String,
    time: String
  }],
  availability: [],
  reader_request: {
    first_name: String,
    last_name: String,
    day: String,
    time: String
  },
  metadata: {
    interests: [String]
  }
});

/*
 * find Volunteer by email
 * @param email of the volunteer
 * @param callback function(error, doc)
 */   
schema.statics.findByEmail = function(email, callback) {
  this.findOne({ email: email}, callback);
}

/*
 * find Volunteer by id and remove reader from pairs array
 * @param volunteer id of the Volunteer
 * @param reader id of the Reader
 * @param callback function(error, doc)
 */
schema.statics.findAndRemovePair = function(volunteer_id, reader_id, callback) {
  this.findByIdAndUpdate(volunteer_id, { $pull: { pairs: { reader: reader_id } } }, callback );
}

// middleware hooks
var Reader = require('./reader');

schema.pre('remove', function(next) {
  // need to process all removals before next
  var last_pair = this.pairs[this.pairs.length-1];
  
  this.pairs.forEach(function(pair) {
    Reader.findByIdAndUpdate(pair.reader, { pair: null }, function(err) {
      if (err) return next(err);
      if (last_pair.reader === pair.reader)
        next();
    });
  });
});

module.exports = mongoose.model('Volunteer', schema);