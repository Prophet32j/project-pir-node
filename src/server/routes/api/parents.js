var express = require('express'),
    router = express.Router();
var models = require('./../../models'),
    User = models.user,
    Parent = models.parent,
    Reader = models.reader;
var Mailer = require('./../../mailer');
var errors = require('./../../errors');
var readers_route = require('./readers');

router.route('/')
  .get(function(req, res, next) {
    // parse query params and send to find()
    Parent.find(parseQuery(req.query), null, { lean: true }, function(err, docs) {
      if (err) {
        err.status = 500;
        return next(err);
      }

      res.json({ parents: docs });
    });
  })
  .post(function(req, res, next) {
    var data = req.body;
    // console.log('data: ' + data);
    Parent.create(data, function(err, doc) {
      if (err) {
        err.status = 500;
        return next(err);
      }

      var mailer = new Mailer();
      var message = {
        to: [{
              email: doc.email,
              name: doc.first_name + ' ' + doc.last_name 
            }],
        subject: 'Parent Registration Confirmation'
      };
      var email_data = { "parent": doc.toJSON() };

      mailer.sendEmail('parent-confirmation', email_data, message, function(err, emails) {
        if (err) {
          console.err('Mandrill API Error: ', err.stack);
        }

        res.status(201).json({ parent: doc });
      });

    });
  });

// parse param value to determine if it's email or id
router.param('id', function(req, res, next, id) {
  // check if id is an hex value or email
  console.log('here first');
  var regex = /@/;
  if (regex.test(id)) { 
    Parent.findByEmail(id, function(err, doc) {
      if (err) 
        return next(err);
      if (!doc) {
        return next(new errors.NotFoundError('parent_not_found', { message: 'Email not found' }));
      }
      
      req.parent = doc;
      next();
    });
  }
  else {
    Parent.findById(id, function(err, doc) {
      if (err) 
        return next(err);
      if (!doc) {
        return next(new errors.NotFoundError('parent_not_found', { message: 'Parent ID not found' }));
      }

      req.parent = doc;
      next();
    });
  }
});

router.route('/:id')
  .get(function(req, res) {
    // we need to send along the readers, reduce amount of requests
    var json = {
      parent: req.parent
    }
    if (!req.parent.readers.length)
      return res.json(json);
    
    Reader.findByParentId(req.parent._id, function(err, docs) {
      if (err) {
        err.status = 500;
        return next(err);
      }
      if (docs.length)
        json.readers = docs;

      res.json(json);
    });
  })
  .put(function(req, res) {
    var parent = req.parent;

    Parent.findByIdAndUpdate(parent._id, req.body, function(err, doc, numAffected) {
      if (err) {
        err.status = 400;
        return next(err);
      }

      res.status(204).json({});
    });
  })
  .delete(function(req, res) {
    req.parent.remove(function(err) {
      if (err) {
        err.status = 500;
        return next(err);
      }

      res.status(204).json({});
    });
  });

router.use('/parents/:id/readers', readers_route);

// router.route('/:parentId/readers')
//   .get(function(req, res) {
//     Reader.find({ parent: req.parent._id }, null, { lean: true }, function(err, docs) {
//       if (err) {
//         err.status = 500;
//         return next(err);
//       }

//       res.json({ readers: docs });
//     });
//   })
//   .post(function(res, res) {
//     var reader = req.body.reader;
//     Reader.create(reader, function(err, doc) {
//       if (err) {
//         err.status = 400;
//         return next(err);
//       }

//       // save new doc into parent
//       req.parent.readers.push(doc._id);
//       req.parent.save(function(err) {
//         if (err) {
//           err.status = 400;
//           return next(err);
//         }

//         var mailer = new Mailer();
//         mailer.loadTemplateAndCompile('reader-confirmation', doc.toJSON(), function(err, html) {
//           if (err) {
//             err.status = 500;
//             return next(err);
//           }

//           var to = [{
//             email: req.parent.email,
//             name: req.parent.first_name + ' ' + req.parent.last_name
//           }];
//           var subject = 'Reader Registration Confirmation';

//           mailer.sendEmail(to, null, subject, html, function(err, emails) {
//             if (err) {
//               console.error('Mandrill API Error: ', err.stack);
//             }

//             res.status(201).json({ reader: doc });
//           });
//         });

//       });
//     });
//   });

function parseQuery(query) {
  var conditions = {}
  if (query.ids)
    conditions._id = { $in: query.ids }
  return conditions;
}

module.exports = router;