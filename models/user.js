// User Model for handling data layer

// db is Mongo
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost/pir'),
    users = db.get('users');

/*
 * constructor for User Class
 */
var User = function(data) {
  this.data = data;
}

// User data in JSON form
User.prototype.data = {}

/*
 * gets the attribute of this.data
 * @param name of the field
 * @return value of the named field
 */
User.prototype.get = function(name) {
  return this.data[name];
}

/*
 * sets the attribute of this.data
 * @param name of the field
 * @param value of the field
 */
User.prototype.set = function(name, value) {
  this.data[name] = value;
}

/*
 * find a User by ID
 * @param id of the User as ObjectId or String
 * @param callback function(error, data)
 */
User.findById = function(id, callback) {
  users.findById(id, function(err, doc) {
    if (err) return callback(err);
    
    callback(null, new User(doc));
  });
}

/*
 * find all Users in database
 * @param callback function(error, User[])
 */
User.find = function(callback) {
  users.find({}, function(err, docs) {
    if (err) return callback(err);
    
    // iterate over docs and create new User, push into users array
    var users = [];
    for (var i in docs)
      users.push(new User(docs[i]));
    
    callback(null, users);
  });
}
             
module.exports = User;