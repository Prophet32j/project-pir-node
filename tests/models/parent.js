// var app = require('./../../app');

// database is Mongo
var monk = require('monk');
// getting parents collection in Mongo
var db = monk('localhost/test'),
    parents = db.get('parents');

var expect = require('expect.js');

var Parent = require('./../../models/parent');

describe('Parent Model', function() {
  
  describe('Finding Parents in collection', function() {
    var _id = parents.id('5491b90e8e6a9e01d284a0d1');
    var test_data = { _id: _id, first_name: 'John', last_name: 'Anderson' }
    
    before('insert test parent', function(done) {
      parents.insert(test_data, function(err, doc) {
        done(err);
      });
    });
    
    after('delete test parent', function(done) {
      parents.remove({_id: _id}, function(err) {
        done(err);
      });
    });
    
    describe('findById()', function() {
    
      it('should return null if no record found', function(done) {
        Parent.findById('000000000000000000000000', function(err, parent) {
          expect(parent).to.not.be.ok();
          done();
        });
      });

      it('should return a Parent', function(done) {
        Parent.findById('5491b90e8e6a9e01d284a0d1', function(err, parent) {
          expect(parent).to.be.a(Parent);
          done();
        });
      });

      it('should contain _id key in data', function(done) {
        Parent.findById('5491b90e8e6a9e01d284a0d1', function(err, parent) {
          expect(parent.data).to.have.key('_id');
          done();
        });
      });
    });

    describe('findByUserId()', function() {

      it('should return null if no user_id is found', function(done) {
        Parent.findByUserId('000000000000000000000000', function(err, parent) {
          expect(parent).to.not.be.ok();
          done();
        });
      });

      it.skip('should return a Parent when user_id is found', function(done) {
        Parent.findByUserId('', function(err, parent) {
          expect(parent).to.be.a(Parent);
          done();
        });      
      });

      it.skip('should return a Parent with an ObjectId', function(done) {
        Parent.findByUserId('', function(err, parent) {
          expect(parent.data).to.have.key('_id');
          done();
        });
      });
    
    });

    describe('findAll()', function() {

      it('should return an Array', function(done) {
        Parent.findAll(function(err, parents) {
          expect(parents).to.be.an(Array);
          done();
        });
      });
      
      it('should contain at least 1 Parent', function(done) {
        Parent.findAll(function(err, parents) {
          expect(parents).to.not.be.empty();
          done();
        });
      });

    });

    describe('find()', function() {

      it('should return an Array', function(done) {
        Parent.find({ first_name: test_data.first_name }, function(err, parents) {
          expect(parents).to.be.an(Array);
          done();
        });
      });
      
      it('should contain at least 1 Parent', function(done) {
        Parent.find({ first_name: test_data.first_name }, function(err, parents) {
          expect(parents).to.not.be.empty();
          done();
        });
      });

    });
    
  });
  
  
  describe('Inserting and Modifying Records in Collection', function() {
    
    describe('save()', function() {
      var newParent = new Parent({ first_name: 'new-test-parent' });
      
      after('delete test parent', function(done) {
        parents.remove({ first_name: newParent.first_name }, function(err) {
          done(err);
        });
      });

      it('should save new Parent and return with ObjectId', function(done) {
        newParent.save(function(err, parent) {
          newParent = parent;
          expect(parent.data).to.have.key('_id');
          done();
        });
      });
      
      it('should return an empty error object when update is successful', function(done) {
        parents.findOne({first_name: newParent.first_name}, function(err, doc) {
          newParent.data = doc;
          newParent.set('first_name', 'changed');
          newParent.save(function(err, parent) {
            expect(err).to.not.be.ok();
            done();
          });
        });
      });

    });
    
  });
  
});