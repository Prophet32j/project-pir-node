// TODO
// add some tests for the User model and its db functionality

var app = require('./../../app');

// database is Mongo
var mongo = require('mongodb');
var monk = require('monk');
// getting users collection in Mongo
var db = monk('localhost/test'),
    users = db.get('users');

var expect = require('expect.js');

var User = require('./../../models/user');

describe('User Model', function() {
  
  describe('Finding Users in collection', function() {
    var _id = users.id('5491b90e8e6a9e01d284a0d1');
    var test_email = 'test.email@email.com';
    var test_data = { _id: _id, username: 'test-user', email: test_email }
    
    before('insert test user', function(done) {
      
      users.insert(test_data, function(err, doc) {
        done(err);
      });
    });
    
    after('delete test user', function(done) {
      users.remove({_id: _id}, function(err) {
        done(err);
      });
    });
    
    describe('findById()', function() {
    
      it('should return null if no record found', function(done) {
        User.findById('000000000000000000000000', function(err, user) {
          expect(user).to.not.be.ok();
          done();
        });
      });

      it('should return a User', function(done) {
        User.findById('5491b90e8e6a9e01d284a0d1', function(err, user) {
          expect(user).to.be.a(User);
          done();
        });
      });

      it('should contain _id key in data', function(done) {
        User.findById('5491b90e8e6a9e01d284a0d1', function(err, user) {
          expect(user.data).to.have.key('_id');
          done();
        });
      });
    });

    describe('findByEmail()', function() {

      it('should return null if no email is found', function(done) {
        User.findByEmail('youshallnotpass@mail.com', function(err, user) {
          expect(user).to.not.be.ok();
          done();
        });
      });

      it('should return a User when email is found', function(done) {
        User.findByEmail(test_email, function(err, user) {
          expect(user).to.be.a(User);
          done();
        });      
      });

      it('should return a User with an ObjectId', function(done) {
        User.findByEmail(test_email, function(err, user) {
          expect(user.data).to.have.key('_id');
          done();
        });
      });
    
    });

    describe('findAll()', function() {

      it('should return an Array', function(done) {
        User.findAll(function(err, users) {
          expect(users).to.be.an(Array);
          done();
        });
      });
      
      it('should contain at least 1 User', function(done) {
        User.findAll(function(err, users) {
          expect(users).to.not.be.empty();
          done();
        });
      });

    });

    describe('find()', function() {

      it('should return an Array', function(done) {
        User.find({ username: test_data.username }, function(err, users) {
          expect(users).to.be.an(Array);
          done();
        });
      });
      
      it('should contain at least 1 User', function(done) {
        User.findAll(function(err, users) {
          expect(users).to.not.be.empty();
          done();
        });
      });

    });
    
  });
  
  
  describe('Inserting and Modifying Records in Collection', function() {
    
    describe('save()', function() {
      var newUser = new User({ username: 'new-test-user', email: 'new_email@mail.com'});
      
      after('delete test user', function(done) {
        users.remove({ username: newUser.username }, function(err) {
          done(err);
        });
      });

      it('should save new User and return with ObjectId', function(done) {
        newUser.save(function(err, user) {
          newUser = user;
          expect(user.data).to.have.key('_id');
          done();
        });
      });
      
      it('should return an empty error object when update is successful', function(done) {
        users.findOne({username: newUser.username}, function(err, doc) {
          newUser.data = doc;
          newUser.set('email', 'changed_email@email.com');
          newUser.save(function(err, user) {
            expect(err).to.not.be.ok();
            done();
          });
        });
      });

    });
    
  });
  
});