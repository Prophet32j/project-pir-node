// Parent Model for handling data layer

// database is Mongo
// var mongo = require('mongodb');
var monk = require('monk');

var util = require('./../util/util');

// getting parents collection in Mongo
var db = monk('localhost/test'),
    parents = db.get('parents');

// Parent schema
var schema = require('./schemas').parent;

/*
 * constructor for Parent Class
 */
var Parent = function(data) {
  this.data = data || {};
}

// Parent data in JSON form
Parent.prototype.data = {}

/*
 * gets the attribute of this.data
 * @param name of the field
 * @return value of the named field
 */
Parent.prototype.get = function(name) {
  return this.data[name];
}

/*
 * sets the attribute of this.data
 * @param name of the field
 * @param value of the field
 */
Parent.prototype.set = function(name, value) {
  this.data[name] = value;
}

/*
 * saves the Parent data to the database
 * @param callback function(error, parent)
 */
Parent.prototype.save = function(callback) {
  var self = this;
  self.data = util.sanitize(self.data);
  
  // insert if no ObjectId
  if (!self.data._id)
    _insert(self, callback);
  else
    _update(self, callback);
}

/*
 * deletes Parent from collection.
 * @param callback function(error)
 */
Parent.prototype.remove = function(callback) {
  parents.remove({_id: this.data._id}, function(err) {
    callback(err);
  });
}

// private functions

/*
 * inserts sanitized Parent into parents collection
 * @param parent to be inserted
 * @param callback function(err, new Parent)
 */
function _insert(parent, callback) {
  parents.insert(parent.data, function(err, doc) {
    if (err) return callback(err);
    
    callback(null, new Parent(doc));
  });
}

/*
 * updates sanitized Parent in parents collection
 * @param parent to be updated
 * @param callback function(err, parent)
 */
function _update(parent, callback) {
  parents.updateById(parent.data._id, parent.data, function(err) {
    callback(err, parent);
  });
}

// starting Class/namespace functions

/*
 * find a Parent by ID, returns a null object if not found
 * @param id of the Parent as ObjectId or String
 * @param callback function(error, Parent)
 */
Parent.findById = function(id, callback) {
  parents.findById(id, function(err, doc) {
    if (err) return callback(err);
    
    if (!doc) return callback();
    
    callback(null, new Parent(doc));
  });
}

/*
 * find Parent by email, returns null if not found
 * @param id of the user
 * @param callback function(error, Parent[])
 */   
Parent.findByUserId = function(id, callback) {
  parents.findOne({ user_id: id}, function(err, doc) {
    if (err) return callback(err);
    
    if(!doc) return callback();
    
    callback(null, new Parent(doc));
  });
}

/*
 * find all parents in database
 * @param callback function(error, Parent[])
 */
Parent.findAll = function(callback) {
  parents.find({}, function(err, docs) {
    if (err) return callback(err);
    
    // iterate over docs and create new Parent, push into parents array
    var array = [];
    docs.forEach(function(doc) {
      array.push(new Parent(doc));
    });
    
    callback(null, array);
  });
}

/*
 * find all parents in database
 * @param hash of key and value items to search on
 * @param callback function(error, Parent[])
 */
Parent.find = function(hash, callback) {
  parents.find(hash, function(err, docs) {
    if (err) return callback(err);
    
    var array = [];
    docs.forEach(function(doc) {
      array.push(new Parent(doc));
    });
    
    callback(null, array);
  });
}

module.exports = Parent;