// Volunteer Model for handling data layer

// database is Mongo
var mongo = require('mongodb');
var monk = require('monk');

var util = require('./../util/util');

// getting volunteers collection in Mongo
var db = monk('localhost/test'),
    volunteers = db.get('volunteers');

// Volunteer schema
var schema = require('./schemas').volunteer;

/*
 * constructor for Volunteer Class
 */
var Volunteer = function(data) {
  this.data = data || {};
}

// Volunteer data in JSON form
Volunteer.prototype.data = {}

/*
 * gets the attribute of this.data
 * @param name of the field
 * @return value of the named field
 */
Volunteer.prototype.get = function(name) {
  return this.data[name];
}

/*
 * sets the attribute of this.data
 * @param name of the field
 * @param value of the field
 */
Volunteer.prototype.set = function(name, value) {
  this.data[name] = value;
}

/*
 * saves the Volunteer data to the database
 * @param callback function(error, volunteer)
 */
Volunteer.prototype.save = function(callback) {
  var self = this;
  self.data = util.sanitize(self.data);
  
  // insert if no ObjectId
  if (!self.data._id)
    _insert(self, callback);
  else
    _update(self, callback);
}

/*
 * deletes Volunteer from collection.
 * @param callback function(error)
 */
Volunteer.prototype.delete = function(callback) {
  volunteers.remove({_id: this.data._id}, function(err) {
    callback(err);
  });
}

// private functions

/*
 * inserts sanitized Volunteer into volunteers collection
 * @param volunteer to be inserted
 * @param callback function(err, new Volunteer)
 */
function _insert(volunteer, callback) {
  volunteers.insert(volunteer.data, function(err, doc) {
    if (err) return callback(err);
    
    callback(null, new Volunteer(doc));
  });
}

/*
 * updates sanitized Volunteer in volunteers collection
 * @param volunteer to be updated
 * @param callback function(err, volunteer)
 */
function _update(volunteer, callback) {
  volunteers.updateById(volunteer.data._id, volunteer.data, function(err) {
    callback(err, volunteer);
  });
}

// starting Class/namespace functions

/*
 * find a Volunteer by ID, returns a null object if not found
 * @param id of the Volunteer as ObjectId or String
 * @param callback function(error, Volunteer)
 */
Volunteer.findById = function(id, callback) {
  volunteers.findById(id, function(err, doc) {
    if (err) return callback(err);
    
    if (!doc) return callback(null, null);
    
    callback(null, new Volunteer(doc));
  });
}

/*
 * find Volunteer by email, returns null if not found
 * @param id of the user
 * @param callback function(error, Volunteer[])
 */   
Volunteer.findByUserId = function(id, callback) {
  volunteers.findOne({ user_id: id}, function(err, doc) {
    if (err) return callback(err);
    
    if(!doc) return callback(null, null);
    
    callback(null, new Volunteer(doc));
  });
}

/*
 * find all volunteers in database
 * @param callback function(error, Volunteer[])
 */
Volunteer.findAll = function(callback) {
  volunteers.find({}, function(err, docs) {
    if (err) return callback(err);
    
    // iterate over docs and create new Volunteer, push into volunteers array
    var array = [];
    for (var i in docs)
      array.push(new Volunteer(docs[i]));
    
    callback(null, array);
  });
}

/*
 * find all volunteers in database
 * @param hash of key and value items to search on
 * @param callback function(error, Volunteer[])
 */
Volunteer.find = function(hash, callback) {
  volunteers.find(hash, function(err, docs) {
    if (err) return callback(err);
    
    var array = [];
    docs.forEach(function(doc) {
      array.push(new Volunteer(doc));
    });
    
    callback(null, array);
  });
}

module.exports = Volunteer;