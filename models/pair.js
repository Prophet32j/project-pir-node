// // Pair Model for handling data layer

// var mongoose = require('mongoose');
// var Schema = mongoose.Schema;

// var schema = new Schema({
//   volunteer_id: { type: Schema.Types.ObjectId, ref: 'Volunteer' },
//   reader_id: { type: Schema.Types.ObjectId, ref: 'Reader' },
//   day: { type: String, required: true },
//   time: { type: String, required: true },
//   approved: { type: Boolean, default: false }
// });

// /*
//  * find Pair by reader
//  * @param id of the Reader
//  * @param callback function(error, doc)
//  */   
// schema.statics.findByReaderId = function(id, callback) {
//   this.findOne({ reader_id: id }, callback);
// }

// /*
//  * find Pair by reader
//  * @param id of the Volunteer
//  * @param callback function(error, docs[])
//  */   
// schema.statics.findByVolunteerId = function(id, callback) {
//   this.find({ volunteer_id: id }, callback);
// }

// module.exports = mongoose.model('Pair', schema);