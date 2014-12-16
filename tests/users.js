var request = require('supertest');
var app = require('./../app');

var redis = require('redis');
var client = redis.createClient();

client.flushdb();

describe('GET Requests to /users', function() {
  
  it('Returns status code 200', function(done) {
    request(app)
      .get('/users')
      .expect(200, done);
  });
  
  it('Returns a list of current users', function(done) {
    request(app)
      .get('/users')
      .expect('Content-Type', /json/, done);
  });
  
});

describe('POST Requests to /users', function() {
  
  it('Returns status code 201', function(done) {
    request(app)
      .post('/users')
      .send('username=prophet32j&email=joshua.hardy@yahoo.com')
      .expect(201, done);
  });
  
});