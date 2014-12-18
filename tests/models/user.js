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
  
  describe.skip('find()', function() {
    
    it('should return an empty Array if collection is empty', function(done) {
      
    });
    
    it('should return an Array of User objects', function(done) {
      
    });
    
  });
  
  describe.skip('save()', function() {
    
    it('should save and return with ObjectId', function(done) {
      
    });
    
  });
  
});