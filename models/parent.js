// Parent Model for handling data layer

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
  email: { type: String, index: { unique: true }, required: '{PATH} is required' },
  first_name: { type: String, required: '{PATH} is required' },
  last_name: { type: String, required: '{PATH} is required' },
  phone: { type: String, required: '{PATH} is required' },
  readers: [{ type: Schema.Types.ObjectId, ref: 'Reader' }]  
});

/*
 * find Parent by email
 * @param email of the parent
 * @param callback function(error, doc)
 */   
schema.statics.findByEmail = function(email, callback) {
  this.findOne({ email: email }, callback);
}

/*
 * find Parent by id and insert the reader id into readers[]
 * @param Reader to insert
 * @param callback function(error, doc, numberAffected)
 */
schema.statics.findAndInsertReader = function(reader, callback) {
  this.findByIdAndUpdate(reader.parent, { $push: { readers: reader._id} }, callback);
}

/* 
 * finds Parent by id and removes reader from readers[]
 * http://docs.mongodb.org/manual/reference/operator/update/pull/#up._S_pull
 * @param Reader to be removed
 * @param callback function(err, doc)
 */
schema.statics.findAndRemoveReader = function(reader, callback) {
  this.findByIdAndUpdate(reader.parent, { $pull: { readers: reader._id } }, callback);
}

/*
 * find Parent by id or email and remove the document.
 * This method will fire any middleware hooks
 * @param id/email of the Parent
 * @param callback function(error, doc)
 */
schema.statics.findAndRemove = function(id, callback) {
  if (/@/.test(id)) {
    this.findByEmail(id, function(err, doc) {
      if (err) return callback(err);
      if (!doc) return callback();
      
      return doc.remove(callback);
    });
  }
  this.findById(id, function(err, doc) {
    if (err) return callback(err);
    if (!doc) return callback();
    
    doc.remove(callback);
  });
}

// schema middleware hooks

/*
 * middleware hook to check email exists
 */
schema.pre('save', function(next) {
  if (!this.isNew)
    return next();

  mongoose.model('User').findByEmail(this.email, function(err, doc) {
    if (err) return next(err);
    if (!doc) return next(new Error('email not found'));

    next();
  });
});
/*
 * middleware hook to remove all readers related to parent
 */
schema.pre('remove', function(next) {
  // get reference to last reader id to check when to call next()
  // must get it now because Reader model will modify the array
  if (!this.readers.length) return next();
  
  var last_id = this.readers[this.readers.length-1];
  this.readers.forEach(function(reader_id) {
    mongoose.model('Reader').findAndRemove(reader_id, function(err) {
      if (err) return next(err);
      if (reader_id === last_id)
        next();
    });
  });
});

// schema.post('remove', function(doc) {
//   console.log('removed parent: ' + doc._id);
// });

module.exports = mongoose.model('Parent', schema);