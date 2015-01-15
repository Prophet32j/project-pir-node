// Pair Model for handling data layer

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
  volunteer: { type: Schema.Types.ObjectId, ref: 'Volunteer', required: true },
  reader: { type: Schema.Types.ObjectId, ref: 'Reader', required: true, index: { unique: true } },
  day: { type: String, required: true },
  time: { type: String, required: true },
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
 * find Pair by volunteer
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

// middleware functions

/*
 * middleware hook to remove reading pair from volunteer and reader
 */
schema.pre('remove', function(next) {
  mongoose.model('Volunteer').findAndRemovePair(this, next);
});

schema.pre('remove', function(next) {
  mongoose.model('Reader').findByIdAndUpdate(this.reader, { pair: null }, next);
});

schema.pre('save',function(next) {
  if (!this.isNew) 
    return next();
  
  mongoose.model('Reader').findById(this.reader, function(err, doc) {
    if (err) return next(err);
    if (!doc) return next(new Error('id not found'));
    
    doc.pair = this._id;
    doc.save(next);
  });
});

schema.pre('save', function(next) {
  if (!this.isNew) 
    return next();
  
  mongoose.model('Volunteer').findAndInsertPair(this, next);
});

module.exports = mongoose.model('Pair', schema);