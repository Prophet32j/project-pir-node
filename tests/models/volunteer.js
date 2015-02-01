var expect = require('expect.js');
var testSetup = require('./test-setup');

var models = require('./../../models'),
    Volunteer = models.volunteer,
    Reader = models.reader,
    Pair = models.pair;

describe('Volunteer', function() {
  
  before('Set up MongoDB and Mongoose', function(done) {
    testSetup(done);
  });
  
  var docs = [];
  
  before('Add Volunteers to collection', function(done) {
    var volunteers = [{ email: 'test1@mail.com', password: '123', first_name: 'test', last_name: 'volunteer', phone: '123-123-1234', gender: 'male', affiliation: 'ISU', about_me: 'testing' },
                   { email: 'test2@mail.com', password: '123', first_name: 'test', last_name: 'volunteer', phone: '123-123-1234', gender: 'male', affiliation: 'ISU', about_me: 'testing' },
                   { email: 'test3@mail.com', password: '123', first_name: 'test', last_name: 'volunteer', phone: '123-123-1234', gender: 'male', affiliation: 'ISU', about_me: 'testing' }];
    Volunteer.create(volunteers, function(err, doc1, doc2, doc3) {
      docs.push(doc1, doc2, doc3);
      done();
    });
  });
    
  after('Delete Parents from collection', function(done) {
    Volunteer.remove({ email: { $regex: /^test/i } }, done);
  });
  
  describe('.findByEmail()', function() {
    
    it('should find volunteer by email', function(done) {
      Volunteer.findByEmail('test1@mail.com', function(err, doc) {
        expect(doc).to.be.a(Volunteer);
        done();
      });
    });
    
  });
  
  describe('.remove', function() {
    
    it('should remove volunteer from collection', function(done) {
      var volunteer = docs.pop();
      volunteer.remove(function(err, doc) {
        expect(err).to.not.be.ok();
        expect(doc).to.be.a(Volunteer);
        done();
      });
    });
    
  });
  
});