// User Model for handling data layer

var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var config = require('./../config/config.json');
var errors = require('rm-errors');
var redisClient = require('./../bin/redis-client')();
var uuid = require('node-uuid');

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
  email: { type: String, required: '{PATH} is required', index: { unique: true } },
  password: { type: String, required: '{PATH} is required' },
  role: { type: String, required: '{PATH} is required' },
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
    if (err) {
      err.status = 500;
      return callback(err);
    }
    if (!doc) {
      return callback(new errors.NotFoundError('user_not_found', { message: 'Email not found' }));
    }
    if (!doc.activated) {
      return callback(new errors.NotActivatedError('account_not_activated', { message: 'User account not activated, check your email' }));
    }

    doc.verifyPassword(password, function(err, matched) {
      if (err) {
        err.status = 500;
        return callback(err);
      }
      if (!matched) {
        return callback(new errors.UnauthorizedError('invalid_password', { message: 'Invalid password' }));
      }

      // console.log(doc.toJSON());
      var token = jwt.sign(doc.toJSON(), config.jwt_secret);

      // save to database, redis
      redisClient.hset('jwt_tokens', token, email, function(err, result) {
        if (err) {
          err.status = 500;
          return callback(err);
        }
        if (!result) {
          err = new Error('JWT not added to redis');
          err.status = 500;
          return calback(err);
        }

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
 * @param user_data object{email,password,role}
 * @param callback function(err, doc, uid)
 */
schema.statics.register = function(user_data, callback) {
  // validate role
  var role = user_data.role;
  if (!role || !/[pv]/i.test(role)) {
    return callback(new errors.InvalidRequestError('invalid_user_type', { message: 'User role is invalid' }));
  }


  this.create(user_data, function(err, doc) {
    if (err) {
      err.status = 400;
      return callback(err);
    }

    var uid = uuid.v4();
    redisClient.hset('activations', doc.email, uid, function(err, result) {
      // need to handle errors and delete document
      if (err) {
        doc.remove();
        err.status = 500;
        return callback(err);
      }
      if (!result) {
        doc.remove();
        err = new Error('something happened saving to database. uuid: ' + uid);
        err.status = 500;
        return callback(err);
      }

      callback(null, doc, uid);
    });
  });
}

schema.statics.activate = function(email, uid, callback) {
  redisClient.hget('activations', email, function(err, uuid) {
    if (err) {
      err.status = 500;
      return callback(err);
    }
    if (!uuid) {
      return callback(new errors.NotFoundError('email_not_found', { message: 'Email or Activation Key not found' }));
    }
    // make sure keys match
    if (uid !== uuid) {
      return callback (new errors.UnauthorizedError('uid_mismatch', { message: 'Activation keys do not match' }));
    }
    redisClient.hdel('activations', email);

    // good to go, activate the user
    mongoose.model('User').findByEmail(email, function(err, doc) {
      if (err) {
        err.status = 500;
        return callback(err);
      }
      if (!doc) {
        return callback(new errors.NotFoundError('user_not_found', { message: 'User ID not found' }));
      }

      doc.activated = true;
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

/*
 * hash password before saving
 */
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
 * validate that user role is correct
 */
schema.pre('save', function(next) {
  if (!this.isModified('role')) return next();

  if (!/[afpv]/i.test(this.role)) {
    return next(new errors.InvalidRequestError('invalid_user_type', { message: 'User role is invalid '}));
  }
  next();
});

/*
 * remove related parent/volunteer
 */
schema.pre('remove', function(next) {
  switch(this.role) {
    case 'parent':
      return mongoose.model('Parent').findAndRemove(this.email, next);
    case 'volunteer':
      return mongoose.model('Volunteer').findAndRemove(this.email, next);
    case 'administrator':
      return mongoose.model('Admin').findAndRemove(this.email, next);
    case 'assistant':
      return mongoose.model('FrontDesk').findAndRemove(this.email, next);  
    default:
      next();
  }
});


module.exports = mongoose.model("User", schema);