var express = require('express'),
    router = express.Router();

var models = require('rm-models'),
    User = models.user;

router.route('/')
  .get(function(req, res, next) {
    res.render('login', { title: 'Sign-in' });
  })
  .post(function(req, res, next) {
    console.log(req.body);
    var email = req.body.email;
    var password = req.body.password;

    User.login(email, password, function(err, doc) {
      if (err) {
        err.status = err.status || 500;
        console.log(err);
        return next(err);
      }

      var user = {
        id: doc.id,
        email: doc.email,
        role: doc.role,
        created: doc.created,
        last_login: doc.last_login
      }
      // determine if this is browser or mobile app
      if (req.body.isBrowser) {
        console.log('hi');
        res.render(user.role + '/dashboard', { title: 'Parent Dashboard', user: user });
      } else {
        res.json({ token: token, user: user });
      }
    });
  });

module.exports = router;