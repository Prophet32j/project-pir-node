// Pair Model for handling data layer

// database is Mongo
// var mongo = require('mongodb');
var monk = require('monk');

var util = require('./../util/util');

// getting pairs collection in Mongo
var db = monk('localhost/test'),
    pairs = db.get('pairs');

// ensure that email is unique constrained
pairs.index('email', { unique: true });

// Pair schema
var schema = require('./schemas').pair;

/*
 * constructor for Pair Class
 */
var Pair = function(data) {
  this.data = data || {};
}

// Pair data in JSON form
Pair.prototype.data = {}

/*
 * gets the attribute of this.data
 * @param name of the field
 * @return value of the named field
 */
Pair.prototype.get = function(name) {
  return this.data[name];
}

/*
 * sets the attribute of this.data
 * @param name of the field
 * @param value of the field
 */
Pair.prototype.set = function(name, value) {
  this.data[name] = value;
}

/*
 * saves the Pair data to the database
 * @param callback function(error, pair)
 */
Pair.prototype.save = function(callback) {
  var self = this;
  self.data = util.sanitize(self.data, schema);
  
  // insert if no ObjectId
  if (!self.data._id)
    _insert(self, callback);
  else
    _update(self, callback);
}

/*
 * deletes Pair from collection.
 * @param callback function(error)
 */
Pair.prototype.remove = function(callback) {
  pairs.remove({_id: this.data._id}, function(err) {
    callback(err);
  });
}

// private functions

/*
 * inserts sanitized Pair into pairs collection
 * @param pair to be inserted
 * @param callback function(err, new Pair)
 */
function _insert(pair, callback) {
  pairs.insert(pair.data, function(err, doc) {
    if (err) return callback(err);
    
    callback(null, new Pair(doc));
  });
}

/*
 * updates sanitized pair in pairs collection
 * @param pair to be updated
 * @param callback function(err, pair)
 */
function _update(pair, callback) {
  pairs.updateById(pair.data._id, pair.data, function(err) {
    callback(err, pair);
  });
}

// starting Class/namespace functions

/*
 * find a Pair by ID, returns a null object if not found
 * @param id of the Pair as ObjectId or String
 * @param callback function(error, Pair)
 */
Pair.findById = function(id, callback) {
  pairs.findById(id, function(err, doc) {
    if (err) return callback(err);
    
    if (!doc) return callback();
    
    callback(null, new Pair(doc));
  });
}

/*
 * find Pair by reader, returns null if not found
 * @param id of the Reader
 * @param callback function(error, Pair)
 */   
Pair.findByReaderId = function(id, callback) {
  pairs.findOne({ reader_id: id }, function(err, doc) {
    if (err) return callback(err);
    
    if(!doc) return callback();
    
    callback(null, new Pair(doc));
  });
}

/*
 * find Pair by reader, returns null if not found
 * @param id of the Volunteer
 * @param callback function(error, Pair[])
 */   
Pair.findByVolunteerId = function(id, callback) {
  pairs.find({ volunteer_id: id }, function(err, docs) {
    if (err) return callback(err);
    
    var array = [];
    docs.forEach(function(doc) {
      array.push(new Pair(doc));
    });
    
    callback(null, array);
  });
}

/*
 * find all Pairs in database
 * @param callback function(error, Pair[])
 */
Pair.findAll = function(callback) {
  pairs.find({}, function(err, docs) {
    if (err) return callback(err);
    
    // iterate over docs and create new Pair, push into pairs array
    var array = [];
    docs.forEach(function(doc) {
      array.push(new Pair(doc));
    });
    
    callback(null, array);
  });
}

/*
 * find all Pairs in database
 * @param hash of key and value items to search on
 * @param callback function(error, Pair[])
 */
Pair.find = function(hash, callback) {
  pairs.find(hash, function(err, docs) {
    if (err) return callback(err);
    
    var array = [];
    docs.forEach(function(doc) {
      array.push(new Pair(doc));
    });
    
    callback(null, array);
  });
}

module.exports = Pair;