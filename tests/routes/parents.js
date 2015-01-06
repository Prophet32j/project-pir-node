var request = require('supertest');
var app = require('./../../app');
var Parent = require('./../../models/parent');

describe('Parents resource', function() {
  
  after('Remove test parents', function(done) {
    Parent.remove({ email: { $regex: /^test/i } }, done);
  });
  
  describe('requests to /parents', function() {
    
    describe('GET', function() {
      var parents = [];
      before('add test parent', function(done) {
        Parent.create({ email: 'testget1@mail.com', password: '1234' },
                      { email: 'testget2@mail.com', password: '1234' },
                      { email: 'testget3@mail.com', password: '1234' }, function(err, doc1, doc2, doc3) {
          if (err) return done(err);
          
          parents.push(doc1); parents.push(doc2); parents.push(doc3);
          done();
        });
      });
      
      it('should return json format', function(done) {
        request(app)
          .get('/parents')
          .expect(200)
          .expect('Content-Type', /json/, done);
      });
      
      describe('Query Params', function() {
        
        it('should return specific parents from query ids[]', function(done) {
          var ids = [parents[0].id, parents[1].id];
          request(app)
            .get('/parents')
            .query({ ids: ids })
            .expect(200)
            .expect('Content-Type', /json/)
            .expect(function(res) {
              if (res.body.parents.length != 2) return "parents length not 2";
            })
            .end(done);
        });
        
        it.skip('should return specific parents from query readers[]', function(done) {
          
        });
        
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
      
      it('should respond to JSON body requests and return the saved document', function(done) {
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
      
      it('should only modify items sent in request body and respond with status code 204', function(done) {
        request(app)
          .put('/parents/' + parent.id)
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
  if (!('_id' in res.body.parent)) return "missing _id field in doc response";
}