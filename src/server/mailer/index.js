var config = require('./config/config.json'),
    mandrill = require('mandrill-api/mandrill'),
    client = new mandrill.Mandrill(config.mandrill_api_key),
    Handlebars = require('handlebars'),
    fs = require('fs'),
    path = require('path');

/*
 * sends a single email to recipients
 * @param template name string
 * @param data of the template to load
 * @param email struct{to[]{email,name}, subject, [from_email], [from_name]}
 * @param callback function(error, emails[])
 */
exports.sendEmail = function(template, data, email, callback) {
  var mailer = this;
  loadTemplateAndCompile(template, data, function(err, html) {
    if (err) {
      return callback(err);
    }
    var message = {
      to: email.to,
      from_email: (email.from && email.from.email) || config.system_email.email,
      from_name: (email.from && email.from.name) || config.system_email.name,
      subject: email.subject,
      html: html
    };

    client.messages.send({ "message": message, "async": true }, function(emails) {
      return callback(null, emails);
    }, callback);
  });
}

/*
 * compiles raw handlebars and data into usable html
 * @param source to compile
 * @param data to insert
 * @return html
 */
 function _compile(source, data) {
  var template = Handlebars.compile(source);
  var html = template(data);

  return html;
}

function _loadTemplate(templateName, callback) {
  var filePath = path.join(__dirname, 'templates', templateName + '.hbs');
  // var filePath = path.resolve('templates', './' + templateName + '.hbs');
  fs.readFile(filePath, { encoding: 'utf-8' }, callback);
}

function loadTemplateAndCompile(templateName, data, callback) {
  _loadTemplate(templateName, function(err, hbs) {
    if (err)
      return callback(err);

    callback(null, _compile(hbs, data));
  });
}