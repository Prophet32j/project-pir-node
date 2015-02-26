var request = require('supertest');
var app = require('./../../app');

var models = require('./../../models'),
    Reader = models.reader,
    Parent = models.parent;

describe('Readers resource', function() {
  
  var parent = null;
  
  before('Add test parent', function(done) {
    Parent.create({ email: 'testparent@mail.com', password: '1234', first_name: 'first', last_name: 'last' }, function(err, doc) {
      if (err) return done(err);
      
      parent = doc;
      done();
    });
  });
  
  after('Remove test readers', function(done) {
    Reader.remove({ first_name: { $regex: /^test/i } }).exec();
    Parent.remove({ email: { $regex: /^test/i } }).exec();
    done();
  });
  
  describe('requests to /readers', function() {
    
    describe('GET', function() {
      var reader1 = null,
          reader2 = null;
      
      before('Add test reader', function(done) {
        Reader.create(
          { parent: parent._id, first_name: 'test1', last_name: 'reader', gender: 'male', special_needs: true,
          language_needs: true, age: 6, grade: '1', about_me: 'things you should know about me', pair: parent._id } ,
          { parent: parent._id, first_name: 'test2', last_name: 'reader', gender: 'male', 
          age: 6, grade: '1', about_me: 'things you should know about me' }, function(err, doc1, doc2) {
          if (err) return done(err);
          
          reader1 = doc1;
          reader2 = doc2;
          done();
        });
      });
      
      it('should return json format', function(done) {
        request(app)
          .get('/readers')
          .expect(200)
          .expect('Content-Type', /json/, done);
      });
      
      describe('Query Params', function() {
        
        it('should return specific readers from query ids[]', function(done) {
          request(app)
            .get('/readers')
            .query({ ids: [reader1.id] })
            .expect(200)
            .expect('Content-Type', /json/)
            .expect(function(res) { if (res.body.readers.length != 1) return "readers.length not 2!"; })
            .end(done);
        });
        
        it('should return only related readers from query parent', function(done) {
          request(app)
            .get('/readers')
            .query({ parent: reader1.parent.toString() })
            .expect(200)
            .expect('Content-Type', /json/)
            .expect(function(res) { if (res.body.readers.length != 2) return "readers.length not 2!"; })
            .end(done);
        });
        
        it('returns only special needs readers from query special_needs', function(done) {
          request(app)
            .get('/readers')
            .query({ special_needs: true })
            .expect(200)
            .expect('Content-Type', /json/)
            .expect(function(res) { 
              res.body.readers.forEach(function(reader) { 
                if (!reader.special_needs) throw "reader not special!"; 
              }); 
            })
            .end(done);
        });
        
        it('should return only language_needs readers from query language_needs', function(done) {
          request(app)
            .get('/readers')
            .query('language_needs=true')
            .expect(200)
            .expect('Content-Type', /json/)
            .expect(function(res) { 
              res.body.readers.forEach(function(reader) { 
                if (!reader.language_needs) throw "reader not language needs!"; 
              }); 
            })
            .end(done);
        });
        
        it('returns only readers who have been paired', function(done) {
          request(app)
            .get('/readers')
            .query({ paired: true })
            .expect(200)
            .expect('Content-Type', /json/)
            .expect(function(res) {
              res.body.readers.forEach(function(r) {
                if (!r.pair) throw 'found unpaired reader';
              });
            })
            .end(done);
        });
        
      });
      
    }); // end GET tests
    
    describe('POST', function() {
      
      it('should respond to URL-encoded requests and return the saved document', function(done) {
        request(app)
          .post('/readers')
          .type('form')
          .send('parent='+parent.id+'&first_name=testform&last_name=post&gender=male&age=7&grade=2&about_me=testing')
          .expect(201)
          .expect('Content-Type', /json/)
          .expect(hasIdKey)
          .end(done);
      });
      
      it('should respond to JSON body requests', function(done) {
        request(app)
          .post('/readers')
          .type('json')
          .send({ parent: parent.id, first_name: 'testjson', last_name: 'post', gender: 'male', age: 7, grade: '2', about_me: 'testing some more!' })
          .expect(201)
          .expect('Content-Type', /json/)
          .expect(hasIdKey)
          .end(done);
      });
      
      it('should respond with status code 400 on validation error', function(done) {
        request(app)
          .post('/readers')
          .send({ parent: parent.id, first_name: 'testvalidation' })
          .expect(400, done);
      });
      
      it('should respond with status code 400 if parent ID is not found', function(done) {
        request(app)
          .post('/readers')
          .send({ parent: '54a6b71700000178022f7bc1', first_name: 'testparent', last_name: 'post', gender: 'male', age: 7, grade: '2', about_me: 'testing some more!' })
          .expect(400, done);
      });
      
    }); // end POST tests
    
  }); // end /readers tests
  
  describe('requests to /readers/:id', function() {
    
    var reader = null;
      
    before('add test reader', function(done) {
      Reader.create({ parent: parent.id, first_name: 'testreader', last_name: 'post', gender: 'male', age: 7, grade: '2', about_me: 'testing some more!' }, function(err, doc) {
        if (err) return done(err);

        reader = doc;
        done();
      });
    });
    
    describe('GET', function() {
      
      it('should respond with a status code 404 when no reader found', function(done) {
        request(app)
          .get('/readers/54a6b6334772154e68125149')
          .expect(404, done);
      });
      
      it('should find a reader based on document id', function(done) {
        request(app)
          .get('/readers/' + reader.id)
          .expect(200)
          .expect('Content-Type', /json/, done);
      });
      
    }); // end GET tests
    
    describe('PUT', function() {
      
      it('should respond to url-encoded requests', function(done) {
        request(app)
          .put('/readers/'+reader.id)
          .type('json')
          .send({ first_name: 'testput' })
          .expect(204, done);
      });
      
      it('should respond to json requests', function(done) {
        request(app)
          .put('/readers/' + reader.id)
          .type('json')
          .send({ last_login: Date.now() })
          .expect(204, done);
      });
      
    }); // end PUT tests
    
    describe('DELETE', function() {
      
      it('should respond with status code 204 when reader is successfully deleted', function(done) {
        request(app)
          .delete('/readers/' + reader.id)
          .expect(204, done);
      });
      
    }); // end DELETE tests
    
  }); // end /readers/:id tests
  
});
  
function hasIdKey(res) {
  if (!('_id' in res.body.reader)) return "missing _id field in doc response";
}