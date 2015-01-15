var request = require('supertest');
var app = require('./../../app');
var Volunteer = require('./../../models/volunteer');

describe('Volunteers Resource', function() {
  
  var volunteer, volunteer1;
    
  before('add test volunteer', function(done) {
    Volunteer.create(
      { email: 'testvolunteer21@mail.com', password: '1234', first_name: 'test', last_name: 'name',
       phone: '123-123-1234', gender: 'male', affiliation: 'ISU', about_me: 'testing' },
      { email: 'testvolunteer22@mail.com', password: '1234', first_name: 'test', last_name: 'name',
       phone: '123-123-1234', gender: 'male', affiliation: 'ISU', about_me: 'testing' },
      function (err, doc, doc1) {
        if (err) return done(err);

        volunteer = doc;
        volunteer1 = doc1;
        done();
      });
  });
  
  after('remove test volunteers', function(done) {
    Volunteer.remove({ email: { $regex: /^test/i } }, done);
  });
  
  describe('requests to /volunteers', function() {
    
    describe('GET', function() {
      
      it('should return json format', function(done) {
        request(app)
          .get('/volunteers')
          .expect(200)
          .expect('Content-Type', /json/, done);
      });
      
      describe('Query Parameter', function() {
        
        it('returns specific volunteers from query ids[]', function(done) {
          request(app)
            .get('/volunteers')
            .query({ ids: [volunteer.id]})
            .expect(200)
            .expect('Content-Type', /json/)
            .expect(function(res) {
              if (res.body.volunteers.length > 1) return 'volunteers length is not right';
            })
            .end(done);
        });
        
        it('returns activated volunteers from query activated=true', function(done) {
          request(app)
            .get('/volunteers')
            .query({ activated: true })
            .expect(200)
            .expect('Content-Type', /json/)
            .expect(function(res) {
              res.body.volunteers.forEach(function(v) {
                if (!v.activated) throw new Error('found non-activated volunteer');
              });
            })
            .end(done);
        });
        
      });
      
    });
    
    describe('POST', function() {
      
      it('should respond to url-encoded requests and return the saved document', function(done) {
        request(app)
          .post('/volunteers')
          .type('form')
          .send({ email: 'testpostform@mail.com', password: '1234', first_name: 'test', last_name: 'name',
          phone: '123-123-1234', gender: 'male', affiliation: 'ISU', about_me: 'testing' })
          .expect(201)
          .expect('Content-Type', /json/)
          .expect(hasIdKey)
          .end(done);
      });
      
      it('should respond to json body requests and return the saved document', function(done) {
        request(app)
          .post('/volunteers')
          .type('json')
          .send({ email: 'testpostjson@mail.com', password: '1234', first_name: 'test', last_name: 'name',
          phone: '123-123-1234', gender: 'male', affiliation: 'ISU', about_me: 'testing' })
          .expect(201)
          .expect('Content-Type', /json/)
          .expect(hasIdKey)
          .end(done);
      });
      
      it('should respond with status code 400 on validation errors', function(done) {
        request(app)
          .post('/volunteers')
          .type('form')
          .send({ email: 'testpostform@mail.com', password: '1234', first_name: 'test' })
          .expect(400, done);
      });
      
    });
    
  });
  
  describe('requests to /volunteers/:id', function() {
    
    describe('GET', function() {
      
      it('should respond with a status code 404 when no volunteer found', function(done) {
        request(app)
          .get('/volunteers/test404@mail.com')
          .expect(404, done);
      });
      
      it('should find a volunteer based on email', function(done) {
        request(app)
          .get('/volunteers/' + volunteer.email)
          .expect(200)
          .expect('Content-Type', /json/, done);
      });
      
      it('should find a volunteer based on document id', function(done) {
        request(app)
          .get('/volunteers/' + volunteer.id)
          .expect(200)
          .expect('Content-Type', /json/, done);
      });
      
    }); // end GET tests
    
    describe('PUT', function() {
      
      it('should only modify items sent in request body and respond with status code 204', function(done) {
        request(app)
          .put('/volunteers/' + volunteer.id)
          .type('json')
          .send({ first_name: 'modified' })
          .expect(204, done);
      });
      
    });
    
    describe('DELETE', function() {
      
      it('should respond with status code 204 when volunteer is successfully deleted', function(done) {
        request(app)
          .delete('/volunteers/' + volunteer.id)
          .expect(204, done);
      });
      
    });
    
  });
  
});

function hasIdKey(res) {
  if (!('_id' in res.body.volunteer)) return "missing _id field in doc response";
}