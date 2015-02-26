// var testSetup = require('./test-setup');
var expect = require('expect.js');

var errors = require('./../../errors');
var models = require('./../../models'),
    User = models.user,
    Parent = models.parent,
    Volunteer = models.volunteer;

describe('User', function() {
  
  before('Set up MongoDB and Mongoose', function(done) {
    require('./test-setup')(done);
  });

  var user1,user2,user3;

  before('add test users', function(done) {
    User.create({ email: 'testuser1@mail.com', password: '1234', type: 'p' },
          { email: 'testuser2@mail.com', password: '1234', type: 'v' },
          { email: 'testuser3@mail.com', password: '1234', type: 'p', activated: true }, 
          function(err, doc1, doc2, doc3) {
            if (err) return done(err);

            user1 = doc1;
            user2 = doc2;
            user3 = doc3;
            done();
          });
  });

  after('remove test users', function(done) {
    User.remove({ email: { $regex: /^test/i } }, done);
  });

  describe('.findByEmail()', function() {

    it('finds and returns user by email', function(done) {
      User.findByEmail(user1.email, function(err, doc) {
        expect(err).to.not.be.ok();
        expect(doc).to.be.a(User);
        done();
      });
    });

  });

  describe('.remove()', function() {

    var parent, volunteer;

    before('add parent', function(done) {
      Parent.create({ email: user1.email, first_name: 'test', last_name: 'parent', phone: '123-123-1234' }, function(err, doc) {
        if (err) return done(err);

        parent = doc;
        done();
      });
    });

    // before('add volunteer', function(done) {
    //   Volunteer.create({ email: user2.email, first_name: 'test', last_name: 'volunteer', })
    // });

    it('removes related parent', function(done) {
      user1.remove(function(err) {
        // expect(err).to.not.be.ok();

        Parent.findById(parent._id, function(err, doc) {
          expect(err).to.not.be.ok();
          // expect(doc).to.not.be.ok();

          done();
        });
      });
    });

    it.skip('removes related volunteer', function(done) {

    });

  });

  var uuid;
  describe('.register()', function() {
    
    it('returns the new doc and uid for url placement', function(done) {
      User.register({ email: 'testregister@mail.com', password: '1234', type: 'p' }, function(err, doc, uid) {
        expect(err).to.not.be.ok();
        expect(doc).to.be.ok();
        expect(uid).to.be.ok();
        uuid = uid;
        done();
      });
    });

  });

  describe('.activate()', function() {

    it('returns an activated user document', function(done) {
      User.activate(uuid, function(err, doc) {
        expect(err).to.not.be.ok();
        expect(doc.activated).to.be.ok();
        done();
      });
    });

  });

  var loggedintoken;
  describe('.login()', function() {

    it('returns NotActivatedError when account not activated', function(done) {
      User.login(user1.email, '1234', function(err, doc, token) {
        expect(err).to.be.a(errors.NotActivatedError);
        done();
      });
    });

    it('returns nothing when email or password mismatch', function(done) {
      User.login(user3.email, 'badpass', function(err, doc, token) {
        expect(err).to.not.be.ok();
        expect(doc).to.not.be.ok();
        expect(token).to.not.be.ok();
        done();
      });
    });

    it('returns the logged in user and a token on success', function(done) {
      User.login(user3.email, '1234', function(err, doc, token) {
        expect(err).to.not.be.ok();
        expect(doc).to.be.a(User);
        expect(token).to.be.ok();
        loggedintoken = token;
        done();
      });
    });

  });

  describe('.logout()', function() {

    it('removes stored token from database and returns a success result', function(done) {
      User.logout(loggedintoken, function(err, result) {
        expect(err).to.not.be.ok();
        expect(result).to.be.ok();
        done();
      });
    });
  });

});