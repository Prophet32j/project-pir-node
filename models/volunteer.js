// Volunteer Model for handling data layer

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
  email: { type: String, index: { unique: true }, required: '{PATH} is required' },
  
  first_name: { type: String, required: '{PATH} is required' },
  last_name: { type: String, required: '{PATH} is required' },
  phone: { type: String, required: '{PATH} is required' },
  image: { type: String, default: 'default.png' },
  gender: { type: String, required: '{PATH} is required' },
  first_time: { type: String, default: true },
  orientation_complete: { type: String, default: false },
  background_complete: { type: String, default: false },
  affiliation: { type: String, required: '{PATH} is required' },
  special_ed: { type: String, default: false },
  language_ed: { type: String, default: false },
  about_me: { type: String, required: '{PATH} is required' },
  two_readers: { type: Boolean, default: false },
  pairs: [{ type: Schema.Types.ObjectId, ref: 'Pair' }],
  availability: {},
  reader_request: {
    first_name: String,
    last_name: String,
    day: String,
    time: String
  },
  meta: {
    interests: [String]
  }
});

/*
 * find Volunteer by email
 * @param email of the volunteer
 * @param callback function(error, doc)
 */   
schema.statics.findByEmail = function(email, callback) {
  this.findOne({ email: email }, callback);
}

/*
 * find Volunteer by id and remove pair from array
 * @param Pair to be removed
 * @param callback function(error, doc)
 */
schema.statics.findAndRemovePair = function(pair, callback) {
  this.findByIdAndUpdate(pair.volunteer, { $pull: { pairs: pair._id } }, callback );
}

/*
 * finds Volunteer by id and pushes pair into array
 * fires any middleware hooks
 * @param Pair to insert
 * @param callback function(err, doc)
 */
schema.statics.findAndInsertPair = function(pair, callback) {
  this.findById(pair.volunteer, function(err, doc) {
    if (err) return callback(err);
    if (!doc) return callback(new Error('id does not exist!'));
    
    // make sure volunteer is not already paired per requested max
    if ((doc.pairs.length == 1 && !doc.two_children) || (doc.pairs.length == 2))
      return callback(new Error('Volunteer already paired to requested maximum'));

    doc.pairs.push(pair._id);
    doc.save(callback);
  });
}

/*
 * find Volunteer by id or email and remove the document.
 * This method will fire any middleware hooks
 * @param id/email of the Volunteer
 * @param callback function(error, doc)
 */
schema.statics.findAndRemove = function(id, callback) {
  if (/@/.test(id)) {
    this.findByEmail(id, function(err, doc) {
      if (err) return callback(err);
      if (!doc) return callback();
      
      return doc.remove(callback);
    });
  } else {
    this.findById(id, function(err, doc) {
      if (err) return callback(err);
      if (!doc) return callback();
      
      doc.remove(callback);
    });
  } 
}

schema.statics.findPairableVolunteers = function(callback) {
  
  
}

schema.pre('save', function(next) {
  if (!this.isNew)
    return next();

  mongoose.model('User').findByEmail(this.email, function(err, doc) {
    if (err) 
      return next(err);
    if (!doc)
      return next(new errors.NotFoundError('email_not_found', { message: 'Email not found' }));

    next();
  });
});

// middleware hooks
var Pair = require('./pair');

schema.pre('remove', function(next) {
  if (!this.pairs.length) return next();
  
  // need to process all removals before next
  var last_pair = this.pairs[this.pairs.length-1];
  
  this.pairs.forEach(function(pair) {
    Pair.findAndRemove(pair, function(err) {
      if (err) return next(err);
      
      if (last_pair === pair)
        next();
    });
  });
});

// Validators

/*
 * validates that pairs length does not violate pairing rule
 */
schema.path('pairs').validate(function(id) {
//   if (this.pairs.count > 1) return false;
//   if (!this.two_children && this.pairs.count > 0) return false;
  return ((this.pairs.count > 1) || (!this.two_children && this.pairs.count > 0)) ? false : true;
}, 'Volunteer has reached maximum pair capacity');

module.exports = mongoose.model('Volunteer', schema);