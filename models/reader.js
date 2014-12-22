// Reader Model for handling data layer

// database is Mongo
// var mongo = require('mongodb');
var monk = require('monk');

var util = require('./../util/util');

// getting readers collection in Mongo
var db = monk('localhost/test'),
    readers = db.get('readers');

// Reader schema
var schema = require('./schemas').reader;

/*
 * constructor for Reader Class
 */
var Reader = function(data) {
  this.data = data || {};
}

// Reader data in JSON form
Reader.prototype.data = {}

/*
 * gets the attribute of this.data
 * @param name of the field
 * @return value of the named field
 */
Reader.prototype.get = function(name) {
  return this.data[name];
}

/*
 * sets the attribute of this.data
 * @param name of the field
 * @param value of the field
 */
Reader.prototype.set = function(name, value) {
  this.data[name] = value;
}

/*
 * saves the Reader data to the database
 * @param callback function(error, reader)
 */
Reader.prototype.save = function(callback) {
  var self = this;
  self.data = util.sanitize(self.data);
  
  // insert if no ObjectId
  if (!self.data._id)
    _insert(self, callback);
  else
    _update(self, callback);
}

/*
 * deletes Reader from collection.
 * @param callback function(error)
 */
Reader.prototype.remove = function(callback) {
  readers.remove({_id: this.data._id}, function(err) {
    callback(err);
  });
}

// private functions

/*
 * inserts sanitized Reader into readers collection
 * @param reader to be inserted
 * @param callback function(err, new Reader)
 */
function _insert(reader, callback) {
  readers.insert(reader.data, function(err, doc) {
    if (err) return callback(err);
    
    callback(null, new Reader(doc));
  });
}

/*
 * updates sanitized Reader in readers collection
 * @param reader to be updated
 * @param callback function(err, reader)
 */
function _update(reader, callback) {
  readers.updateById(reader.data._id, reader.data, function(err) {
    callback(err, reader);
  });
}

// starting Class/namespace functions

/*
 * find a Reader by ID, returns a null object if not found
 * @param id of the Reader as ObjectId or String
 * @param callback function(error, Reader)
 */
Reader.findById = function(id, callback) {
  readers.findById(id, function(err, doc) {
    if (err) return callback(err);
    
    if (!doc) return callback();
    
    callback(null, new Reader(doc));
  });
}

/*
 * find Reader by email, returns null if not found
 * @param id of the user
 * @param callback function(error, Reader[])
 */   
Reader.findByParentId = function(id, callback) {
  readers.findOne({ parent_id: id}, function(err, doc) {
    if (err) return callback(err);
    
    if(!doc) return callback();
    
    callback(null, new Reader(doc));
  });
}

/*
 * find all readers in database
 * @param callback function(error, Reader[])
 */
Reader.findAll = function(callback) {
  readers.find({}, function(err, docs) {
    if (err) return callback(err);
    
    // iterate over docs and create new Reader, push into readers array
    var array = [];
    docs.forEach(function(doc) {
      array.push(new Reader(doc));
    });
    
    callback(null, array);
  });
}

/*
 * find all readers in database
 * @param hash of key and value items to search on
 * @param callback function(error, Reader[])
 */
Reader.find = function(hash, callback) {
  readers.find(hash, function(err, docs) {
    if (err) return callback(err);
    
    var array = [];
    docs.forEach(function(doc) {
      array.push(new Reader(doc));
    });
    
    callback(null, array);
  });
}

module.exports = Reader;