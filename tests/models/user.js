// // var testSetup = require('./test-setup');
// var expect = require('expect.js');
// var User = require('./../../models/user');

// describe('User', function() {
  
//   before('Set up MongoDB and Mongoose', function(done) {
//     require('./test-setup')(done);
//   });

//   var user1,user2,user3;

//   before('add test users', function(done) {
//   	User.create({ email: 'testuser1@mail.com', password: '1234', type: 'p' },
//   				{ email: 'testuser1@mail.com', password: '1234', type: 'p' },
//   				{ email: 'testuser1@mail.com', password: '1234', type: 'p' }, 
//   				function(err, doc1, doc2, doc3) {
//   					if (err) return done(err);

//   					user1 = doc1;
//   					user2 = doc2;
//   					user3 = doc3;
//   					done();
//   				});
//   });

//   after('remove test users', function(done) {
//   	User.remove({ email: { $regex: /^test/i } }, done);
//   });

//   describe('.findByEmail()', function() {

//   	it('finds and returns user by email', function(done) {
//   		User.findByEmail(user1.email, function(err, doc) {
//   			expect(err).to.not.be.ok();
//   			expect(doc).to.be.a(User);
//   			done();
//   		});
//   	});

//   });

//   describe('.remove()', function() {

//   	var parent, volunteer;

//   	before('add parent', function(done) {
//   		Parent.create({ email: user1.email, first_name: 'test', last_name: 'parent' }, function(err, doc) {
//   			if (err) return done(err);

//   			parent = doc;
//   			done();
//   		});
//   	});

//   	it('removes related parent')

//   });




// });