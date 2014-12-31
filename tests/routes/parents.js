var request = require('supertest');
var app = require('./../../app');
var Parent = require('./../../models/parent');

describe('Parents resource', function() {
  
  after('Remove test parents', function(done) {
    Parent.remove({ email: { $regex: /^test/i } }, function(err) {
      done(err);
    });
  });
  
  describe('requests to /parents', function() {
    
    describe('GET', function() {
      
      it('should return json format', function(done) {
        request(app)
          .get('/parents')
          .expect(200)
          .expect('Content-Type', /json/, done);
      });
      
      describe.skip('Query param: ids[]', function() {
        
      });
      
    }); // end GET tests
    
    describe('POST', function() {
      
      it('should respond to URL-encoded requests and return the saved document', function(done) {
        request(app)
          .post('/parents')
          .send('email=testurlencoded@mail.com&password=1234')
          .expect(201)
          .expect('Content-Type', /json/)
          .expect(hasIdKey)
          .end(done);
      });
      
      it('should respond to JSON body requests', function(done) {
        request(app)
          .post('/parents')
          .type('json')
          .send({ email: 'testjsonparser@mail.com', password: '1234' })
          .expect(201)
          .expect('Content-Type', /json/)
          .expect(hasIdKey)
          .end(done);
      });
      
      it('should respond with status code 400 on validation error', function(done) {
        request(app)
          .post('/parents')
          .send('email=test400@mail.com')
          .expect(400, done);
      });
      
    }); // end POST tests
    
  }); // end /parents tests
  
  describe('requests to /parents/:id', function() {
    
    describe('GET', function() {
      
      var parent = null;
      
      before('add test parent', function(done) {
        Parent.create({ email: 'testgetbyid@mail.com', password: '1234' }, function(err, doc) {
          if (err) return done(err);
          
          parent = doc;
          done();
        });
      });
      
      it('should respond with a status code 404 when no parent found', function(done) {
        request(app)
          .get('/parents/test404@mail.com')
          .expect(404, done);
      });
      
      it('should find a parent based on email', function(done) {
        request(app)
          .get('/parents/' + parent.email)
          .expect(200)
          .expect('Content-Type', /json/, done);
      });
      
      it('should find a parent based on document id', function(done) {
        request(app)
          .get('/parents/' + parent._id)
          .expect(200)
          .expect('Content-Type', /json/, done);
      });
      
    }); // end GET tests
    
    describe('PUT', function() {
      
      var parent = null;
      
      before('Add parent to collection', function(done) {
        Parent.create({ email: 'testput@mail.com', password: '1234' }, function(err, doc) {
          if (err) return done(err);
          
          parent = doc;
          done();
        });
      });
      
      it('should only update sent fields', function(done) {
        request(app)
          .put('/parents/' + parent._id)
          .type('json')
          .send({ last_login: Date.now() })
          .expect(204, done);
      });
      
    }); // end PUT tests
    
    describe('DELETE', function() {
      
      var parent = null;
      
      beforeEach('Add parent to collection', function(done) {
        Parent.create({ email: 'testdelete@mail.com', password: '1234'}, function(err, doc) {
          if (err) return done(err);
          
          parent = doc;
          done();
        });
      });
      
      it('should respond with status code 204 when parent is successfully deleted', function(done) {
        request(app)
          .delete('/parents/' + parent._id)
          .expect(204, done);
      });
      
    }); // end DELETE tests
    
  }); // end /parents/:id tests
  
});
  
function hasIdKey(res) {
  if (!('_id' in res.body)) return "missing _id field in doc response";
}