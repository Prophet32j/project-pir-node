// User Model for handling data layer

var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var config = require('./../config/config.json');
var NotActivatedError = require('./../errors/NotActivatedError');
var redisClient = require('./../bin/redis-client')();
var uuid = require('node-uuid');

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
  email: { type: String, required: '{PATH} is required', index: { unique: true } },
  password: { type: String, required: '{PATH} is required' },
  type: { type: String, required: '{PATH} is required' },
  created: { type: Date, default: Date.now },
  last_login: { type: Date, default: null },
  activated: { type: Boolean, default: false }
});

/*
 * find User by email
 * @param email of the User
 * @param callback function(error, doc)
 */   
schema.statics.findByEmail = function(email, callback) {
  this.findOne({ email: email }, callback);
}

/*
 * find User by email and remove the document.
 * This method will fire any middleware hooks
 * @param email of the User
 * @param callback function(error, doc)
 */
schema.statics.findByEmailAndRemove = function(email, callback) {
  this.findByEmail(email, function(err, doc) {
    if (err) return callback(err);
    if (!doc) return callback();
    
    doc.remove(callback);
  });
}

/*
 * find User by id and remove the document.
 * This method will fire any middleware hooks
 * @param id of the User
 * @param callback function(error, doc)
 */
schema.statics.findAndRemove = function(id, callback) {
  this.findById(id, function(err, doc) {
    if (err) return callback(err);
    if (!doc) return callback();
    
    doc.remove(callback);
  });
}

/*
 * verifies credentials and issues a json web token
 * @param email of the User
 * @param password of the User
 * @param callback function(error, User, token)
 */
schema.statics.login = function(email, password, callback) {
  this.findByEmail(email, function(err, doc) {
    if (err) return callback(err);
    if (!doc) return callback();
    if (!doc.activated) 
      return callback(new NotActivatedError('account_not_activated', { message: 'User account not activated, check your email' }));

    doc.verifyPassword(password, function(err, matched) {
      if (err) return callback(err);
      if (!matched) return callback();

      // console.log(doc.toJSON());
      var token = jwt.sign(doc.toJSON(), config.jwt_secret);

      // save to database, redis
      redisClient.hset('jwt_tokens', token, email, function(err, result) {
        if (err) return callback(err);
        if (!result) return callback(new Error('json token not added to redis'));

        callback(null, doc, token);
      });
    });
  });
}

/*
 * logs out user by removing token from Redis store
 * @param token to remove
 * @param callback function(err, result)
 */
schema.statics.logout = function(token, callback) {
  redisClient.hdel('jwt_tokens', token, callback);
}

/*
 * creates a new user and generates a UID so an email can be sent
 * @param user_data object{email,password,type}
 * @param callback function(err, doc, uid)
 */
schema.statics.register = function(user_data, callback) {
  // validate type
  var type = user_data.type;
  if (!type || !(type === 'p' || type === 'v'))
    return callback(new Error('invalid User type'));


  this.create(user_data, function(err, doc) {
    if (err) 
      return callback(err);

    var uid = uuid.v4();
    redisClient.hset('uuid', uid, doc.id, function(err, result) {
      if (err)
        return callback(err);
      if (!result)
        return callback(new Error('something happened saving to database. uuid: ' + uid));

      callback(null, doc, uid);
    });
  });
}

schema.statics.activate = function(uid, callback) {
  redisClient.hget('uuid', uid, function(err, id) {
    if (err) 
      return callback(err);
    if (!id)
      return callback();

    mongoose.model('User').findById(id, function(err, doc) {
      if (err)
        return callback(err);
      if (!doc)
        return callback();

      doc.activated = true;
      redisClient.hdel('uuid', uid);
      doc.save(callback);
    });
  });
}

/*
 * verifies password by comparing to stored hash
 * @param password to compare
 * @param callback function(error, boolean)
 */
schema.methods.verifyPassword = function(password, callback) {
  bcrypt.compare(password, this.password, callback);
}

// middleware hooks

schema.pre('save', function(next) {
  if (!this.isModified('password')) return next();

  var user = this;

  bcrypt.genSalt(5, function(err, salt) {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, function(err, hash) {
      if (err) return next(err);

      user.password = hash;
      next();
    });
  });
});

/*
 * remove related parent/volunteer
 */
schema.pre('remove', function(next) {
  switch(this.type) {
    case 'p':
      return mongoose.model('Parent').findAndRemove(this.email, next);
    case 'v':
      return mongoose.model('Volunteer').findAndRemove(this.email, next);
    default:
      next();
  }
});


module.exports = mongoose.model("User", schema);