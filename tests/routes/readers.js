var request = require('supertest');
var app = require('./../../app');
var Reader = require('./../../models/reader');

describe.skip('Readers resource', function() {
  
  after('Remove test readers', function(done) {
    Reader.remove({ first_name: { $regex: /^test/i } }, function(err) {
      done(err);
    });
  });
  
  describe('requests to /readers', function() {
    
    describe('GET', function() {
      
      it('should return json format', function(done) {
        request(app)
          .get('/readers')
          .expect(200)
          .expect('Content-Type', /json/, done);
      });
      
      describe.skip('Query param: ids[]', function() {
        
      });
      
    }); // end GET tests
    
    describe('POST', function() {
      
      it.skip('should respond to URL-encoded requests and return the saved document', function(done) {
        request(app)
          .post('/readers')
          .send('email=testurlencoded@mail.com&password=1234')
          .expect(201)
          .expect('Content-Type', /json/)
          .expect(hasIdKey)
          .end(done);
      });
      
      it.skip('should respond to JSON body requests', function(done) {
        request(app)
          .post('/readers')
          .type('json')
          .send({ email: 'testjsonparser@mail.com', password: '1234' })
          .expect(201)
          .expect('Content-Type', /json/)
          .expect(hasIdKey)
          .end(done);
      });
      
      it('should respond with status code 400 on validation error', function(done) {
        request(app)
          .post('/readers')
          .send('email=test400@mail.com')
          .expect(400, done);
      });
      
    }); // end POST tests
    
  }); // end /readers tests
  
  describe('requests to /readers/:id', function() {
    
    describe('GET', function() {
      
      var reader = null;
      
      before('add test reader', function(done) {
        Reader.create({ email: 'testgetbyid@mail.com', password: '1234' }, function(err, doc) {
          if (err) return done(err);
          
          reader = doc;
          done();
        });
      });
      
      it('should respond with a status code 404 when no reader found', function(done) {
        request(app)
          .get('/readers/test404@mail.com')
          .expect(404, done);
      });
      
      it('should find a reader based on email', function(done) {
        request(app)
          .get('/readers/' + reader.email)
          .expect(200)
          .expect('Content-Type', /json/, done);
      });
      
      it('should find a reader based on document id', function(done) {
        request(app)
          .get('/readers/' + reader._id)
          .expect(200)
          .expect('Content-Type', /json/, done);
      });
      
    }); // end GET tests
    
    describe('PUT', function() {
      
      var reader = null;
      
      before('Add reader to collection', function(done) {
        Reader.create({ email: 'testput@mail.com', password: '1234' }, function(err, doc) {
          if (err) return done(err);
          
          reader = doc;
          done();
        });
      });
      
      it('should only update sent fields', function(done) {
        request(app)
          .put('/readers/' + reader._id)
          .type('json')
          .send({ last_login: Date.now() })
          .expect(204, done);
      });
      
    }); // end PUT tests
    
    describe('DELETE', function() {
      
      var reader = null;
      
      beforeEach('Add reader to collection', function(done) {
        Reader.create({ email: 'testdelete@mail.com', password: '1234'}, function(err, doc) {
          if (err) return done(err);
          
          reader = doc;
          done();
        });
      });
      
      it('should respond with status code 204 when reader is successfully deleted', function(done) {
        request(app)
          .delete('/readers/' + reader._id)
          .expect(204, done);
      });
      
    }); // end DELETE tests
    
  }); // end /readers/:id tests
  
});
  
function hasIdKey(res) {
  if (!('_id' in res.body)) return "missing _id field in doc response";
}