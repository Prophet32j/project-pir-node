// User Model for handling data layer

// database is Mongo
var mongo = require('mongodb');
var monk = require('monk');

var util = require('./../util/util');

// getting users collection in Mongo
var db = monk('localhost/test'),
    users = db.get('users');

// ensure that email is unique constrained
users.index('email', { unique: true });

// User schema
var schema = require('./schemas').user;

/*
 * constructor for User Class
 */
var User = function(data) {
  this.data = data || {};
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
 * saves the User data to the database
 * @param callback function(error, user)
 */
User.prototype.save = function(callback) {
  var self = this;
  self.data = util.sanitize(self.data, schema);
  
  // insert if no ObjectId
  if (!self.data._id)
    _insert(self, callback);
  else
    _update(self, callback);
}

/*
 * deletes User from collection.
 * @param callback function(error)
 */
User.prototype.remove = function(callback) {
  users.remove({_id: this.data._id}, function(err) {
    callback(err);
  });
}

// private functions

/*
 * inserts sanitized User into users collection
 * @param user to be inserted
 * @param callback function(err, new User)
 */
function _insert(user, callback) {
  users.insert(user.data, function(err, doc) {
    if (err) return callback(err);
    
    callback(null, new User(doc));
  });
}

/*
 * updates sanitized user in users collection
 * @param user to be updated
 * @param callback function(err, user)
 */
function _update(user, callback) {
  users.updateById(user.data._id, user.data, function(err) {
    callback(err, user);
  });
}

// starting Class/namespace functions

/*
 * find a User by ID, returns a null object if not found
 * @param id of the User as ObjectId or String
 * @param callback function(error, User)
 */
User.findById = function(id, callback) {
  users.findById(id, function(err, doc) {
    if (err) return callback(err);
    
    if (!doc) return callback(null, null);
    
    callback(null, new User(doc));
  });
}

/*
 * find User by email, returns null if not found
 * @param email of the User
 * @param callback function(error, User[])
 */   
User.findByEmail = function(email, callback) {
  users.findOne({ email: email}, function(err, doc) {
    if (err) return callback(err);
    
    if(!doc) return callback(null, null);
    
    callback(null, new User(doc));
  });
}

/*
 * find all Users in database
 * @param callback function(error, User[])
 */
User.findAll = function(callback) {
  users.find({}, function(err, docs) {
    if (err) return callback(err);
    
    // iterate over docs and create new User, push into users array
    var array = [];
    docs.forEach(function(doc) {
      array.push(new User(doc));
    });
    
    callback(null, array);
  });
}

/*
 * find all Users in database
 * @param hash of key and value items to search on
 * @param callback function(error, User[])
 */
User.find = function(hash, callback) {
  users.find(hash, function(err, docs) {
    if (err) return callback(err);
    
    var array = [];
    docs.forEach(function(doc) {
      array.push(new User(doc));
    });
    
    callback(null, array);
  });
}

module.exports = User;