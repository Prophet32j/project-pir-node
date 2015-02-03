var expect = require('expect.js');
var testSetup = require('./test-setup');

var models = require('./../../models'),
    Volunteer = models.volunteer,
    Reader = models.reader,
    Pair = models.pair,
    User = models.user;

describe('Volunteer', function() {
  
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
  
  var vol1, vol2, vol3;
  before('Add Volunteers', function(done) {
    var volunteers = [{ email: user1.email, first_name: 'test', last_name: 'volunteer', phone: '123-123-1234', gender: 'male', affiliation: 'ISU', about_me: 'testing' },
                   { email: user2.email, first_name: 'test', last_name: 'volunteer', phone: '123-123-1234', gender: 'male', affiliation: 'ISU', about_me: 'testing' },
                   { email: user3.email, first_name: 'test', last_name: 'volunteer', phone: '123-123-1234', gender: 'male', affiliation: 'ISU', about_me: 'testing' }];
    
    Volunteer.create(volunteers, function(err, doc1, doc2, doc3) {
      if (err) return done(err);
      vol1 = doc1; vol2 = doc2; vol3 = doc3;
      done();
    });
  });
    
  after('Delete Parents from collection', function(done) {
    Volunteer.remove({ email: { $regex: /^test/i } }).exec();
    User.remove({ email: { $regex: /^test/i } }, done);
  });
  
  describe('.findByEmail()', function() {
    
    it('finds volunteer by email', function(done) {
      Volunteer.findByEmail(user1.email, function(err, doc) {
        expect(doc).to.be.a(Volunteer);
        done();
      });
    });
    
  });
  
  describe('.remove', function() {
    
    it('removes volunteer from collection', function(done) {
      vol1.remove(function(err, doc) {
        expect(err).to.not.be.ok();

        Volunteer.findById(vol1._id, function(err, doc) {
          expect(err).to.not.be.ok();
          expect(doc).to.not.be.ok();
          done();
        });
      });
    });
    
  });
  
});