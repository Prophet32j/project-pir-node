// var app = require('./../../app');

var expect = require('expect.js');
var mongoose = require('mongoose');
var uri = 'mongodb://localhost/test';

var Parent = require('./../../models/parent'),
    Reader = require('./../../models/reader');

describe('Reader', function() {
  
  var parent = null;
  
  before('Set up MongoDB and Mongoose', function(done) {
    if (mongoose.connection.db) return done();
    require('./../../models/schemas').init();
    mongoose.connect(uri, done);
  });
  
  before('Add parent to collection', function(done) {
    Parent.create({ email: 'parentreadertest@mail.com', password: '123'}, function(err, doc) {
      if (err) return done(err);

      parent = doc;
      done();              
    });
  });
  
  after('Remove parent from collection', function(done) {
    parent.remove(done);
  });
  
  describe('.remove()', function() {
    
    var reader = null;
    
    beforeEach('Add Parent and Reader to collections', function(done) {
      Reader.create({ parent: parent._id, first_name: 'test', last_name: 'reader', 
                      gender: 'male', age: 6, grade: '1', about_me: 'things you should know about me' }, function(err, doc) {
        if (err) return done(err);
          
        reader = doc;
        parent.readers.push(reader._id);

        parent.save(function(err, doc) {
          done();
        });
      }); 
    });
    
    it('should remove reader from collection', function(done) {
      reader.remove(function(err, doc) {
        Reader.findById(reader._id, function(err, doc) {
          expect(doc).to.not.be.ok();
          done();
        });
      });
    });
    
    it('should remove reader from Parent.readers', function(done) {
      reader.remove(function(err, doc) {
        Parent.findById(parent._id, function(err, doc) {
          expect(doc.readers).to.not.contain(reader._id);
          done();
        });
      });
    });
  
  });
  
  describe('.findByParentId', function() {
    
    before('Add a reader to collection', function(done) {
      Reader.create({ parent: parent._id, first_name: 'test', last_name: 'reader', 
                      gender: 'male', age: 6, grade: '1', about_me: 'things you should know about me' }, function(err, doc) {
        if (err) return done(err);
          
        reader = doc;
        parent.readers.push(reader._id);

        parent.save(function(err, doc) {
          done();
        });
      })
    });
    
    it('should return an array', function(done) {
      Reader.findByParentId(parent._id, function(err, docs) {
        if (err) return done(err);
        
        expect(docs).to.be.an(Array);
        done();
      });
    });
    
    it('should return readers', function(done) {
      Reader.findByParentId(parent._id, function(err, docs) {
        if (err) return done(err);
        
        expect(docs[0]).to.be.a(Reader);
        done();
      });
    });
  });
  
});