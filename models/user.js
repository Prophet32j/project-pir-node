// // User Model for handling data layer

// var mongoose = require('mongoose');
// var Schema = mongoose.Schema;

// var schema = new Schema({
//   email: String,
//   password: String,
//   type: String,
//   created: { type: Date, default: Date.now },
//   last_login: { type: Date, default: null },
//   activated: { type: Boolean, default: false }
// });

// /*
//  * find User by email
//  * @param email of the User
//  * @param callback function(error, doc)
//  */   
// schema.statics.findByEmail = function(email, callback) {
//   this.findOne({ email: email }, callback);
// }

// module.exports = mongoose.model("User", schema);