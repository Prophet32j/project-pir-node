// var app = require('./../../app');

var expect = require('expect.js');
var testSetup = require('./test-setup');

var models = require('./../../models'),
    Parent = models.parent,
    Reader = models.reader;

describe('Parent', function() {
  
  before('Set up MongoDB and Mongoose', function(done) {
    testSetup(done);
  });
  var ids = [];
  
  before('Add Parents to collection', function(done) {
    var parents = [{ email: 'test1@mail.com', password: '123', first_name: 'first', last_name: 'last' },
                   { email: 'test2@mail.com', password: '123', first_name: 'first', last_name: 'last' },
                   { email: 'test3@mail.com', password: '123', first_name: 'first', last_name: 'last' }];
    Parent.create(parents, function(err, doc1, doc2, doc3) {
      if (err) return done(err);
      
      ids.push(doc1._id, doc2._id, doc3._id);
      done();
    });
  });
    
  after('Delete Parents from collection', function(done) {
    Parent.remove({ email: { $regex: /^test/i } }, done);
  });
  
  describe('.findByEmail()', function() {
    
    it('should find parent by email and return the document', function(done) {
      Parent.findByEmail('test1@mail.com', function(err, doc) {
        expect(doc).to.be.a(Parent);
        done();
      });
    });
    
  });
  
  describe('.remove()', function() {
    
    var parent = null;
    var reader = null;
    beforeEach('Add Parent and Reader to collections', function(done) {
      Parent.create({ email: 'testremove@mail.com', password: '123', first_name: 'first', last_name: 'last'}, function(err, doc) {
        if (err) return done(err);
        
        parent = doc;
        Reader.create({ 
          parent: parent._id, first_name: 'test', last_name: 'reader', gender: 'male', 
          age: 6, grade: '1', about_me: 'things you should know about me' }, function(err, doc) {
          if (err) return done(err);
            
          reader = doc;
          parent.readers.push(reader._id);
          
          parent.save(function(err, doc) {
            done();
          });
        });              
      });
    });
    
    it('should remove parent from Parent collection', function(done) {
      parent.remove(function(err, doc) {
        Parent.findById(parent._id, function(err, parent_doc) {
          expect(parent_doc).to.not.be.ok();
          done();
        });
      });
    });
    
    it('should remove associated readers from Reader collection', function(done) {
      parent.remove(function(err, doc) {
        Reader.findById(reader._id, function(err, reader_doc) {
          expect(reader_doc).to.not.be.ok();
          done();
        });
      });
    });
  
  });
  
  describe('.findAndRemove()', function() {
    
    var parent = null;
    var reader = null;
    beforeEach('Add Parent and Reader to collections', function(done) {
      Parent.create({ email: 'testfindAndRemove@mail.com', password: '123', first_name: 'first', last_name: 'last'}, function(err, doc) {
        if (err) return done(err);
        
        parent = doc;
        Reader.create({ 
          parent: parent._id, first_name: 'test', last_name: 'reader', gender: 'male', 
          age: 6, grade: '1', about_me: 'things you should know about me' }, function(err, doc) {
          if (err) return done(err);
            
          reader = doc;
          parent.readers.push(reader._id);
          
          parent.save(function(err, doc) {
            done();
          });
        });              
      });
    });
    
    it('should remove parent from Parent collection', function(done) {
      parent.remove(function(err, doc) {
        Parent.findById(parent._id, function(err, parent_doc) {
          expect(parent_doc).to.not.be.ok();
          done();
        });
      });
    });
    
    it('should remove associated readers from Reader collection', function(done) {
      parent.remove(function(err, doc) {
        Reader.findById(reader._id, function(err, reader_doc) {
          expect(reader_doc).to.not.be.ok();
          done();
        });
      });
    });
    
  });
  
});