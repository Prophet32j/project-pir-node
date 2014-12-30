// Reader Model for handling data layer

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
  parent: { type: Schema.Types.ObjectId, ref: 'Parent', required: true },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  image: { type: String, default: 'default.png' },
  
  gender: { type: String, required: true },
  age: { type: Number, required: true },
  grade: { type: String, required: true },
  alt_phone: String,
  alt_parent: String,
  special_needs: { type: String, default: false },
  language_needs: { type: String, default: false },
  about_me: { type: String, required: true },
  pair: {
    volunteer: { type: Schema.Types.ObjectId, ref: 'Volunteer' },
    day: String,
    time: String
  },
  
  availability: [],
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
    if(!doc) return callback();
    
    doc.remove(callback);
  });
}

// schema middleware hooks

/*
 * middleware hook to remove reader from parent.readers[]
 */
schema.pre('remove', function(next) {
  var Parent = mongoose.model('Parent');
  Parent.findAndRemoveReader(this.parent, this._id, next);
});

/*
 * middleware hook to remove reader pair from volunteer
 */
schema.pre('remove', function(next) {
  // make sure there's a pair to remove
  if(!this.pair.volunteer)
    return next();
  
  mongoose.model('Volunteer').findAndRemovePair(this.pair.volunteer, this._id, next);
});

// schema.post('remove', function(doc) {
//   console.log('removed reader: ' + doc._id);
// });

module.exports = mongoose.model('Reader', schema);