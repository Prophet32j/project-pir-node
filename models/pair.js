// Pair Model for handling data layer

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
  volunteer: { type: Schema.Types.ObjectId, ref: 'Volunteer', required: '{PATH} is required' },
  reader: { type: Schema.Types.ObjectId, ref: 'Reader', required: '{PATH} is required', index: { unique: true } },
  day: { type: String, required: '{PATH} is required' },
  time: { type: String, required: '{PATH} is required' },
  approved: { type: Boolean, default: false }
});

/*
 * find Pair by reader
 * @param id of the Reader
 * @param callback function(error, doc)
 */   
schema.statics.findByReaderId = function(id, callback) {
  this.findOne({ reader: id }, callback);
}

/*
 * find pairs by volunteer
 * @param id of the Volunteer
 * @param callback function(error, docs[])
 */   
schema.statics.findByVolunteerId = function(id, callback) {
  this.find({ volunteer: id }, callback);
}

/*
 * finds by id and removes pair, fires any middleware hooks
 * @param id of the pair
 * @parama callback function(err, doc)
 */
schema.statics.findAndRemove = function(id, callback) {
  this.findById(id, function(err, doc) {
    if (err) return callback(err);
    
    doc.remove(callback);
  });
}

/*
 * finds pair by id and sets approved to true
 * @param id of the pair
 * @param callback function(err, doc)
 */
schema.statics.approve = function(id, callback) {
  this.findById(id, function(err, doc) {
    if (err) {
      return callback(err);
    }

    doc.approved = true;
    doc.save(callback);
  });
}

// middleware functions

/*
 * remove reading pair from volunteer
 */
schema.pre('remove', function(next) {
  mongoose.model('Volunteer').findAndRemovePair(this, next);
});

/*
 * remove reading pair from reader
 */
schema.pre('remove', function(next) {
  mongoose.model('Reader').findByIdAndUpdate(this.reader, { pair: null }, next);
});

/*
 * add pair to reader
 */
schema.pre('save',function(next) {
  if (!this.isNew) 
    return next();
  
  mongoose.model('Reader').findAndPair(this, next);
}

/*
 * add pair to volunteer
 */
schema.pre('save', function(next) {
  if (!this.isNew) 
    return next();
  
  mongoose.model('Volunteer').findAndInsertPair(this, next);
});



module.exports = mongoose.model('Pair', schema);