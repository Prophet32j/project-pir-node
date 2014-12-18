// TODO
// add some tests for the User model and its db functionality

var app = require('./../../app');
var expect = require('expect.js');
var User = require('./../../models/user');

describe('User Model', function() {
  
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
      User.findByEmail('joshua.hardy@yahoo.com', function(err, user) {
        expect(user).to.be.a(User);
        done();
      });      
    });
    
    it('should return a User with an ObjectId', function(done) {
      User.findByEmail('joshua.hardy@yahoo.com', function(err, user) {
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
    
  });
  
  describe('find()', function() {
    
    it('should return an Array', function(done) {
      User.find({ username: 'new-user'}, function(err, users) {
        expect(users).to.be.an(Array);
        done();
      });
    });
    
  });
  
  describe('save()', function() {
    
    it('should save and return with ObjectId', function(done) {
      var newUser = new User({ username: 'new-user', email: 'new_email@mail.com'});
      newUser.save(function(err, user) {
        expect(user.data).to.have.key('_id');
        done();
      });
    });
    
  });
  
});