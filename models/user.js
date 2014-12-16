// User Model for handling data layer
// db is Mongo
var mongo = require('mongodb');

/*
 * constructor for User Class
 */
var User = function(data) {
  this.data = data;
}

// User data in JSON form
User.prototype.data = {}

/*
 * find a User by ID
 * @param id of the User
 * @param callback function(error, data)
 */
User.prototype.findById = function(id, callback) {
  
}