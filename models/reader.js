// Reader Model for handling data layer

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
  parent_id: { type: Schema.Types.ObjectId, ref: 'Parent' },
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
  pair: {type: Schema.Types.ObjectId, ref: 'Pair' },
  
  availability: [],
  reader_request: {
    first_name: String,
    last_name: Sting,
    day: String,
    time: String
  },
  metadata: {
    interests: [String]
  }
});

/*
 * find Readers by the Parent id
 * @param id of the Parent
 * @param callback function(error, docs[])
 */   
schema.statics.findByParentId = function(id, callback) {
  readers.find({ parent_id: id }, callback);
}

module.exports = mongoose.model('Reader', schema);