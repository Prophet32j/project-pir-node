// var request = require('supertest');
// var app = require('./../../app');

// // TODO
// // recode tests to test strict User and API
// // add MongoDB transactions for additional testing

// describe('Requests to /users', function() {
//   describe('GET', function() {
//     it('Returns status code 200', function(done) {
//       request(app)
//         .get('/users')
//         .expect(200, done);
//     });

//     it('Returns a list of current users', function(done) {
//       request(app)
//         .get('/users')
//         .expect('Content-Type', /json/, done);
//     });
//   });

//   describe('POST', function() {

//     it('Returns status code 201', function(done) {
//       request(app)
//         .post('/users')
//         .send('username=prophet32j&email=joshua.hardy@yahoo.com')
//         .expect(201, done);
//     });

//   });
// });