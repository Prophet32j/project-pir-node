// var app = require('./../../app');

// database is Mongo
var monk = require('monk');
// getting volunteers collection in Mongo
var db = monk('localhost/test'),
    volunteers = db.get('volunteers');

var expect = require('expect.js');

var Volunteer = require('./../../models/volunteer');

describe('Volunteer Model', function() {
  
  describe('Finding Volunteers in collection', function() {
    var _id = volunteers.id('5491b90e8e6a9e01d284a0d1');
    var test_data = { _id: _id, first_name: 'John', last_name: 'Anderson' }
    
    before('insert test volunteer', function(done) {
      volunteers.insert(test_data, function(err, doc) {
        done(err);
      });
    });
    
    after('delete test volunteer', function(done) {
      volunteers.remove({_id: _id}, function(err) {
        done(err);
      });
    });
    
    describe('findById()', function() {
    
      it('should return null if no record found', function(done) {
        Volunteer.findById('000000000000000000000000', function(err, volunteer) {
          expect(volunteer).to.not.be.ok();
          done();
        });
      });

      it('should return a Volunteer', function(done) {
        Volunteer.findById('5491b90e8e6a9e01d284a0d1', function(err, volunteer) {
          expect(volunteer).to.be.a(Volunteer);
          done();
        });
      });

      it('should contain _id key in data', function(done) {
        Volunteer.findById('5491b90e8e6a9e01d284a0d1', function(err, volunteer) {
          expect(volunteer.data).to.have.key('_id');
          done();
        });
      });
    });

    describe('findByUserId()', function() {

      it('should return null if no user_id is found', function(done) {
        Volunteer.findByUserId('000000000000000000000000', function(err, volunteer) {
          expect(volunteer).to.not.be.ok();
          done();
        });
      });

      it.skip('should return a Volunteer when user_id is found', function(done) {
        Volunteer.findByUserId('', function(err, volunteer) {
          expect(volunteer).to.be.a(Volunteer);
          done();
        });      
      });

      it.skip('should return a Volunteer with an ObjectId', function(done) {
        Volunteer.findByUserId('', function(err, volunteer) {
          expect(volunteer.data).to.have.key('_id');
          done();
        });
      });
    
    });

    describe('findAll()', function() {

      it('should return an Array', function(done) {
        Volunteer.findAll(function(err, volunteers) {
          expect(volunteers).to.be.an(Array);
          done();
        });
      });
      
      it('should contain at least 1 Volunteer', function(done) {
        Volunteer.findAll(function(err, volunteers) {
          expect(volunteers).to.not.be.empty();
          done();
        });
      });

    });

    describe('find()', function() {

      it('should return an Array', function(done) {
        Volunteer.find({ first_name: test_data.first_name }, function(err, volunteers) {
          expect(volunteers).to.be.an(Array);
          done();
        });
      });
      
      it('should contain at least 1 Volunteer', function(done) {
        Volunteer.find({ first_name: test_data.first_name }, function(err, volunteers) {
          expect(volunteers).to.not.be.empty();
          done();
        });
      });

    });
    
  });
  
  
  describe('Inserting and Modifying Records in Collection', function() {
    
    describe('save()', function() {
      var newVolunteer = new Volunteer({ first_name: 'new-test-volunteer' });
      
      after('delete test volunteer', function(done) {
        volunteers.remove({ first_name: newVolunteer.first_name }, function(err) {
          done(err);
        });
      });

      it('should save new Volunteer and return with ObjectId', function(done) {
        newVolunteer.save(function(err, volunteer) {
          newVolunteer = volunteer;
          expect(volunteer.data).to.have.key('_id');
          done();
        });
      });
      
      it('should return an empty error object when update is successful', function(done) {
        volunteers.findOne({first_name: newVolunteer.first_name}, function(err, doc) {
          newVolunteer.data = doc;
          newVolunteer.set('first_name', 'changed');
          newVolunteer.save(function(err, volunteer) {
            expect(err).to.not.be.ok();
            done();
          });
        });
      });

    });
    
  });
  
});