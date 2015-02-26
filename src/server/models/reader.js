// Reader Model for handling data layer

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var errors = require('./../errors');

var schema = new Schema({
  parent: { type: Schema.Types.ObjectId, ref: 'Parent', required: '{PATH} is required' },
  first_name: { type: String, required: '{PATH} is required' },
  last_name: { type: String, required: '{PATH} is required' },
  image: { type: String, default: 'default.png' },
  
  gender: { type: String, required: '{PATH} is required' },
  age: { type: Number, required: '{PATH} is required' },
  grade: { type: String, required: '{PATH} is required' },
  alt_phone: String,
  alt_parent: String,
  special_needs: { type: String, default: false },
  language_needs: { type: String, default: false },
  about_me: { type: String, required: '{PATH} is required' },
  pair: { type: Schema.Types.ObjectId, ref: 'Pair' },
  
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
 * find Readers by the Parent id
 * @param id of the Parent
 * @param callback function(error, docs[])
 */   
schema.statics.findByParentId = function(id, callback) {
  this.find({ parent: id }, callback);
}

/*
 * find Reader by id and remove the document.
 * This method will fire any middleware hooks
 * @param id of the Reader
 * @param callback function(error, doc)
 */
schema.statics.findAndRemove = function(id, callback) {
  this.findById(id, function(err, doc) {
    if (err) return callback(err);
    if (!doc) return callback();
    
    doc.remove(callback);
  });
}

/*
 * find Reader by id and add pair
 * @param id of the Reader
 * @param pair to add
 * @param callback function(err, doc)
 */
schema.statics.findAndPair = function(pair, callback) {
  this.findById(pair.reader, function(err, doc) {
    if (err) {
      return callback(err);
    }
    if (!doc) {
      return callback(new errors.NotFoundError('reader_not_found', { message: 'Reader ID not found' }));
    }
    if (doc.pair) {
      return callback(new Error('Reader already paired!'));
    }
    doc.pair = pair._id;
    doc.save(callback);
  });
}

// schema middleware hooks

/*
 * middleware hook to remove reader from parent.readers[]
 */
schema.pre('remove', function(next) {
  var Parent = mongoose.model('Parent');
  Parent.findAndRemoveReader(this, next);
});

/*
 * middleware hook to find and remove pair if exists
 */
schema.pre('remove', function(next) {
  // make sure there's a pair to remove
  if(!this.pair)
    return next();
  
  mongoose.model('Pair').findAndRemove(this.pair, next);
});



module.exports = mongoose.model('Reader', schema);