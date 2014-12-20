// User Model for handling data layer

// database is Mongo
var mongo = require('mongodb');
var monk = require('monk');
var _ = require('lodash');

// getting users collection in Mongo
var db = monk('localhost/test'),
    users = db.get('users');

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
  self.data = _sanitize(self.data);
  
  // insert User if there is no Mongo ObjectId
  if (!self.data._id)
    return _insert(self, callback);
  
  // User is in collection, update
  users.updateById(self.data._id, self.data, function(err) {
    if (err) return callback(err);
    
    callback(null, self);
  });
}

/*
 * deletes User from collection.
 * @param callback function(error)
 */
User.prototype.delete = function(callback) {
  users.remove({_id: this.data._id}, function(err) {
    callback(err);
  });
}

/*
 * sets default keys on data from User schema.
 * Strips out any keys not specified in User schema
 * @param data to be sanitized
 * @return sanitized data
 */
function _sanitize(data) {
  return _.pick(_.defaults(data, schema), _.keys(schema));
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
    var users = [];
    for (var i in docs)
      users.push(new User(docs[i]));
    
    callback(null, users);
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
    
    var users = [];
    for (var i in docs) {
      users.push(new User(docs[i]));
    }
    
    callback(null, users);
  });
}

module.exports = User;