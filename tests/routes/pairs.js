var request = require('supertest');
var app = require('./../../app');
var expect = require('expect.js');

var Pair = require('./../../models/pair');
var Parent = require('./../../models/parent');
var Reader = require('./../../models/reader');
var Volunteer = require('./../../models/volunteer');

describe('Pairs resource', function() {
  
  var parent = null,
      reader = null,
      reader1 = null,
      reader2 = null,
      reader3 = null,
      volunteer = null,
      volunteer1 = null,
      volunteer2 = null;
  
  before('add test parent', function(done) {
    Parent.create({ email: 'testparent@mail.com', password: 'test', first_name: 'test', last_name: 'parent' }, 
                  function(err, doc) {
                    if (err) return done(err);

                    parent = doc;
                    done();
                  });
  });
  before('add volunteers', function(done) {
    Volunteer.create({ email: 'testvolunteer@mail.com', password: '1234', first_name: 'test', last_name: 'name', 
                        phone: '123-123-1234', gender: 'male', affiliation: 'ISU', about_me: 'testing', two_children: true },
                     { email: 'testvolunteer1@mail.com', password: '1234', first_name: 'test', last_name: 'name', 
                      phone: '123-123-1234', gender: 'male', affiliation: 'ISU', about_me: 'testing' },
                     { email: 'testvolunteer2@mail.com', password: '1234', first_name: 'test', last_name: 'name', 
                      phone: '123-123-1234', gender: 'male', affiliation: 'ISU', about_me: 'testing' },
                     function(err, doc, doc1, doc2) {
                       if (err) return done(err);

                       volunteer = doc;
                       volunteer1 = doc1;
                       volunteer2 = doc2;
                       done();
                     });
  });
  before('add additional reader', function(done) {
    Reader.create({ parent: parent.id, first_name: 'testreader', last_name: 'post', gender: 'male', age: 7, grade: '2', 
                   about_me: 'testing some more!' },
                  { parent: parent.id, first_name: 'testreader', last_name: 'post', gender: 'male', age: 7, grade: '2', 
                     about_me: 'testing some more!' },
                  { parent: parent.id, first_name: 'testreader', last_name: 'post', gender: 'male', age: 7, grade: '2', 
                     about_me: 'testing some more!' },
                  { parent: parent.id, first_name: 'testreader', last_name: 'post', gender: 'male', age: 7, grade: '2', 
                     about_me: 'testing some more!' },
                  function(err, doc1, doc2, doc3, doc4) {
                    if (err) return done(err);

                    reader = doc1;
                    reader1 = doc2;
                    reader2 = doc3;
                    reader3 = doc4;
                    done();
                  });
  });
  
  
  after('remove test pairs, parents, readers, volunteers', function(done) {
    Parent.remove().exec();
    Reader.remove().exec();
    Volunteer.remove().exec();
    Pair.remove().exec();
    done();
  });
  
  describe('requests to /pairs', function() {
    
    describe('GET', function() {
      
      var pair = null;
      
      before('add test pair', function(done) {
        Pair.create({ volunteer: volunteer._id, reader: reader._id, day: 'Monday', time: '3:30pm'}, function(err, doc) {
          if (err) return done(err);

          pair = doc;
          done();
        });
      });
      
      after('remove test pair', function(done) {
        pair.remove();
        pair = null;
        done();
      });
      
      
      it('returns a json array containing pairs with volunteer and reader names', function(done) {
        request(app)
          .get('/pairs')
          .expect(200)
          .expect('Content-Type', /json/)
          .expect(function(res) {
            if (!('first_name' in res.body.pairs[0].volunteer)) return 'missing volunteer name';
          })
          .end(done);
      });
      
      describe('Query Params', function() {
        
        it('returns specific pairs from query ids[]', function(done) {
          request(app)
            .get('/pairs')
            .query({ ids: [pair.id]})
            .expect(200)
            .expect('Content-Type', /json/)
            .expect(function(res) {
              if (res.body.pairs.length === 0) return 'missing pairs on query';
            })
            .end(done);
        });
        
        it('returns pairs of a volunteer from query volunteer', function(done) {
          request(app)
            .get('/pairs')
            .query({ volunteer: pair.volunteer.toString()})
            .expect(200)
            .expect('Content-Type', /json/)
            .expect(function(res) {
              res.body.pairs.forEach(function(doc) {
                if (doc.volunteer._id != pair.volunteer.toString()) throw new Error('incorrect volunteer');
              });
            })
            .end(done);
        });
        
        it('returns array of unapproved pairs on query approved=false', function(done) {
          request(app)
            .get('/pairs')
            .query({ approved: false })
            .expect(200)
            .expect('Content-Type', /json/)
            .expect(function(res) {
              res.body.pairs.forEach(function(pair) {
                if (pair.approved) throw new Error('expected unapproved pair, found approved pair');
              });
            })
            .end(done);
        });
        
        it('returns array of approved pairs on query approved=true', function(done) {
          request(app)
            .get('/pairs')
            .query({ approved: true })
            .expect(200)
            .expect('Content-Type', /json/)
            .expect(function(res) {
              res.body.pairs.forEach(function(pair) {
                if (!pair.approved) throw new Error('expected approved pair, found unapproved pair');
              });
            })
            .end(done);
        });
        
      });
      
    });
    
    describe('POST', function() {
      
      describe('format tests', function() {
        
        var pair = null;
      
        afterEach('remove test pair', function(done) {
          if (!pair) return done();
            Pair.findAndRemove(pair._id, function(err) { pair = null; done(); });
        });
        
        
        it('responds to URL-encoded requests and return the saved document', function(done) {
          request(app)
            .post('/pairs')
            .type('form')
            .send({ volunteer: volunteer.id, reader: reader.id, day: 'Monday', time: '4:00pm' })
            .expect(201)
            .expect(hasIdKey)
            .expect(function(res) {
//               console.log(res);
              pair = res.body.pair;
            })
            .end(done);
        });

        it('responds to json body requests and return the saved document', function(done) {
          request(app)
            .post('/pairs')
            .type('json')
            .send({ volunteer: volunteer.id, reader: reader.id, day: 'Monday', time: '4:00pm' })
            .expect(201)
            .expect(hasIdKey)
            .expect(function(res) {
              pair = res.body.pair;
            })
            .end(done);
        });
        
      });
      
      describe('validation tests', function() {
        
        var pair = null,
            pair1 = null;
        
        before('add pair', function(done) {
          Pair.create({ volunteer: volunteer._id, reader: reader._id, day: 'Monday', time: '3:30pm'},
                      { volunteer: volunteer1._id, reader: reader1._id, day: 'Monday', time: '3:30pm'}, 
                      function(err, doc1, doc2) {
                        if (err) return done(err);
            
                        pair = doc1;
                        pair1 = doc2;
                        done();
                      });
        });
        
        after('remove pair', function(done) {
          pair.remove();
          pair1.remove(done);
        });
        
        
        it('responds with status code 400 when reader does not exist', function(done) {
          request(app)
            .post('/pairs')
            .send({ volunteer: volunteer1.id, reader: '000000000000000000000000', day: 'Monday', time: '4:00pm'})
            .expect(400, done);
        });

        it('responds with status code 400 when volunteer does not exist', function(done) {
          request(app)
            .post('/pairs')
            .send({ volunteer: '000000000000000000000000', reader: reader1.id, day: 'Monday', time: '4:00pm'})
            .expect(400, done);
        });

        it('responds with status code 400 when reader already paired', function(done) {
          request(app)
            .post('/pairs')
            .send({ volunteer: volunteer2.id, reader: reader.id, day: 'Monday', time: '4:00pm' })
            .expect(400, done);
        });

        it('responds with status code 400 when volunteer is paired and only wants one pair', function(done) {
          request(app)
            .post('/pairs')
            .send({ volunteer: volunteer1.id, reader: reader2.id, day: 'Monday', time: '4:00pm' })
            .expect(400, done);
        });

        it('responds with status code 201 when volunteer is paired once and wants two pairs', function(done) {
          request(app)
            .post('/pairs')
            .send({ volunteer: volunteer.id, reader: reader2.id, day: 'Monday', time: '4:00pm'})
            .expect(201)
            .expect(hasIdKey)
            .end(done);
        });
        
        it('responds with status code 400 when volunteer is already paired twice', function(done) {
          request(app)
            .post('/pairs')
            .send({ volunteer: volunteer.id, reader: reader3.id, day: 'Monday', time: '4:00pm'})
            .expect(400, done);
        });
        
      });
      
    });
    
  });
  
  describe('requests to /pairs/:id', function() {
    
    var pair = null,
        pair1 = null;
    
    before('create test pairs', function(done) {
      Pair.create({volunteer: volunteer.id, reader: reader.id, day: 'Wednesday', time: '4:00pm'},
                  {volunteer: volunteer1.id, reader: reader1.id, day: 'Wednesday', time: '4:00pm'}, 
                  function(err, doc, doc1) {
                    if (err) return done(err);

                    pair = doc;
                    pair1 = doc1;
                    done();
                  });  
    });
    
    
    describe('GET', function() {
      
      it('reponds with status code 404 when pair not found', function(done) {
        request(app)
          .get('/pairs/000000000000000000000000')
          .expect(404, done);
      });
      
      it('responds with a pair object with volunteer and reader names', function(done) {
        request(app)
          .get('/pairs/' + pair.id)
          .expect(200)
          .expect(function(res) {
            var volunteer = res.body.pair.volunteer;
            var reader = res.body.pair.reader;
            if (!('first_name' in volunteer) || !('last_name' in volunteer)) return 'missing volunteer name';
            if (!('first_name' in reader) || !('last_name' in reader)) return 'missing reader name';
          })
          .end(done);
      });
      
    });
    
    describe('PUT', function() {
      
      it('responds to url-encoded request bodies', function(done) {
        request(app)
          .put('/pairs/' + pair.id)
          .type('form')
          .send({ pair: { day: 'Monday'} })
          .expect(204, done);
      });
      
      it('responds to json body requests', function(done) {
        request(app)
          .put('/pairs/' + pair.id)
          .type('json')
          .send({ pair: { time: '3:30pm'} })
          .expect(204, done);
      });
      
    });
    
    describe('DELETE', function() {
      
      it('removes pair from Volunteer', function(done) {
        request(app)
          .delete('/pairs/' + pair.id)
          .expect(204)
          .expect(function(res) {
            Volunteer.findById(volunteer._id, function(err, doc) {
              if (err) throw err;
              if (!doc) throw new Error('doc not here');
              
              expect(doc.pairs.indexOf(pair._id)).to.be(-1);
            });
          })
          .end(done);
      });
      
      it('removes pair from Reader', function(done) {
        request(app)
          .delete('/pairs/' + pair1.id)
          .expect(204)
          .expect(function(res) {
            Reader.findById(reader1._id, function(err, doc) {
              if (err) throw err;
              if (!doc) throw new Error('reader not found');
              
              expect(doc.pair).to.not.be.ok();
            });
          })
          .end(done);
      });
      
    });
    
  });
  
});

function hasIdKey(res) {
  if (!('_id' in res.body.pair)) return "missing _id field in doc response";
}