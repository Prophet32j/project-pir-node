var express = require('express'),
    router = express.Router();
var models = require('./../../models'),
    User = models.user,
    Parent = models.parent,
    Reader = models.reader;
var Mailer = require('./../../mailer');
var errors = require('./../../errors');

router.route('/')
  .get(function(req, res) {
    // parse query params and send to find()
    Parent.find(parseQuery(req.query), null, { lean: true }, function(err, docs) {
      if (err)
        return res.status(500).json(err);
      var json = {
        parents: docs,
      }
      res.json(json);
    });
  })
  .post(function(req, res) {
    var data = req.body;
    Parent.create(data, function(err, doc) {
      if (err)
        return res.status(400).json(err);

      var mailer = new Mailer();
      mailer.loadTemplateAndCompile('parent-confirmation', doc.toJSON(), function(err, html) {
        if (err) 
          return res.status(500).json({ error: err });

        var to = [{
          email: doc.email,
          name: doc.first_name + ' ' + doc.last_name
        }];
        var subject = 'Parent Registration Confirmation';

        mailer.sendEmail(to, null, subject, html, function(err, emails) {
          if (err)
            console.log('Mandrill API Error: ', err);

          res.status(201).json({ parent: doc });
        });
      });
    });
  });

// parse param value to determine if it's email or id
router.param('id', function(req, res, next, id) {
  // check if id is an hex value or email
  var regex = /@/;
  if (regex.test(id)) { 
    Parent.findByEmail(id, function(err, doc) {
      if (err) 
        return next(err);
      if (!doc) 
        return res.status(404).json({ error: new errors.NotFoundError('parent_not_found', { message: 'Email not found' }) });
      
      req.parent = doc;
      next();
    });
  }
  else {
    Parent.findById(id, function(err, doc) {
      if (err) 
        return next(err);
      if (!doc) 
        return res.status(404).json({ error: new errors.NotFoundError('parent_not_found', { message: 'Parent ID not found' }) });

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
      if (err) 
        return res.status(500).json({ error: err });
      if (docs.length)
        json.readers = docs;

      res.json(json);
    });
  })
  .put(function(req, res) {
    var parent = req.parent;

    Parent.findByIdAndUpdate(parent._id, req.body, function(err, doc, numAffected) {
      if (err) 
        return res.status(400).json({ error: err });

      res.status(204).json({});
    });
  })
  .delete(function(req, res) {
    req.parent.remove(function(err) {
      if (err) 
        return res.status(500).json({ error: err });

      res.status(204).json({});
    });
  });

router.route('/:id/readers')
  .get(function(req, res) {
    Reader.find({ parent: req.parent._id }, null, { lean: true }, function(err, docs) {
      if (err) 
        return res.status(500).json({ error: err });

      res.json({ readers: docs });
    });
  })
  .post(function(res, res) {
    var reader = req.body.reader;
    Reader.create(reader, function(err, doc) {
      if (err) 
        return res.status(400).json({ error: err });

      // save new doc into parent
      req.parent.readers.push(doc._id);
      req.parent.save(function(err) {
        if (err) 
          return res.status(400).json({ error: err });

        var mailer = new Mailer();
        mailer.loadTemplateAndCompile('reader-confirmation', doc.toJSON(), function(err, html) {
          if (err) 
            return res.status(500).json({ error: err });

          var to = [{
            email: req.parent.email,
            name: req.parent.first_name + ' ' + req.parent.last_name
          }];
          var subject = 'Reader Registration Confirmation';

          mailer.sendEmail(to, null, subject, html, function(err, emails) {
            if (err)
              console.log('Mandrill API Error: ', err);

            res.status(201).json({ reader: doc });
          });
        });

      });
    });
  });

function parseQuery(query) {
  var conditions = {}
  if (query.ids)
    conditions._id = { $in: query.ids }
  return conditions;
}

module.exports = router;