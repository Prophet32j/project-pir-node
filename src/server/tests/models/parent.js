// var app = require('./../../app');

var expect = require('expect.js');
var testSetup = require('./test-setup');

var models = require('./../../models'),
    Parent = models.parent,
    Reader = models.reader,
    User = models.user;

describe('Parent', function() {
  
  before('Set up MongoDB and Mongoose', function(done) {
    testSetup(done);
  });

  var user1, user2, user3;
  before('Add Users', function(done) {
    var users = [{ email: 'test1@mail.com', password: 'test', type: 'p' },
                 { email: 'test2@mail.com', password: 'test', type: 'p' },
                 { email: 'test3@mail.com', password: 'test', type: 'p' }];
    User.create(users, function(err, doc1, doc2, doc3) {
      if (err) return done(err);

      user1 = doc1; user2 = doc2; user3 = doc3;
      done();
    });
  });

  var parent1, parent2, parent3;
  before('Add Parents', function(done) {
    var parents = [{ email: user1.email, first_name: 'first', last_name: 'last', phone: '123-1234' },
                   { email: user2.email, first_name: 'first', last_name: 'last', phone: '123-1234' },
                   { email: user3.email, first_name: 'first', last_name: 'last', phone: '123-1234' }];
    Parent.create(parents, function(err, doc1, doc2, doc3) {
      if (err) return done(err);
      
      parent1 = doc1; parent2 = doc2; parent3 = doc3;
      done();
    });
  });
    
  after('Delete Parents from collection', function(done) {
    Parent.remove({ email: { $regex: /^test/i } }).exec();
    User.remove({ email: { $regex: /^test/i } }, done);
  });
  
  describe('.findByEmail()', function() {
    
    it('finds parent by email and returns the document', function(done) {
      Parent.findByEmail(user1.email, function(err, doc) {
        expect(err).to.not.be.ok();
        expect(doc).to.be.a(Parent);
        done();
      });
    });
    
  });
  
  describe('.remove()', function() {
    
    var reader = null;
    before('Add Reader', function(done) {
      Reader.create({ 
        parent: parent1._id, first_name: 'test', last_name: 'reader', gender: 'male', 
        age: 6, grade: '1', about_me: 'things you should know about me' }, function(err, doc) {
        if (err) return done(err);
          
        reader = doc;
        parent1.readers.push(reader._id);
        
        parent1.save(done);
      });
    });
    
    it('removes parent and associated readers', function(done) {
      parent1.remove(function(err, doc) {
        Parent.findById(parent1._id, function(err, parent_doc) {
          expect(parent_doc).to.not.be.ok();
          
          Reader.findById(reader._id, function(err, reader_doc) {
            expect(reader_doc).to.not.be.ok();
            done();
          });
        
        });
      });
    });
  
  });
  
  describe('.findAndRemove()', function() {
    
    var reader1, reader2;
    before('Add Reader', function(done) {
      var readers = [{ 
        parent: parent2._id, first_name: 'test', last_name: 'reader', gender: 'male', 
        age: 6, grade: '1', about_me: 'things you should know about me' },
        { 
        parent: parent3._id, first_name: 'test', last_name: 'reader', gender: 'male', 
        age: 6, grade: '1', about_me: 'things you should know about me' }];

      Reader.create(readers, function(err, doc1, doc2) {
        if (err) return done(err);
          
        reader1 = doc1; reader2 = doc2;

        parent2.readers.push(reader1._id);
        parent2.save();
        parent3.readers.push(reader2._id);
        parent3.save(done);
      });
    });
    
    it('finds parent by id and removes parent and associated readers', function(done) {
      Parent.findAndRemove(parent2._id, function(err, doc) {
        expect(err).to.not.be.ok();

        Reader.findById(reader1._id, function(err, reader) {
          expect(reader).to.not.be.ok();
          done();
        });
      });
    });
    
    it('finds parent by email and removes parent and associated readers', function(done) {
      Parent.findAndRemove(parent3.email, function(err, doc) {
        expect(err).to.not.be.ok();
        expect(doc).to.be.a(Parent);

        Reader.findById(reader2._id, function(err, reader) {
          expect(reader).to.not.be.ok();
          done();
        });
      });
    });
    
  });
  
});