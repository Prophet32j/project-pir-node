var config = require('./../config/config.json');
var mandrill = require('mandrill-api/mandrill');
var client = new mandrill.Mandrill(config.mandrill_api_key);
var Handlebars = require('handlebars');
var fs = require('fs');
var path = require('path');
var email_config = require('./config.json');

var Mailer = function() { }


/*
 * sends a single email to recipients
 * @param template name string
 * @param data of the template to load
 * @param email struct{to[]{email,name}, subject, [from_email], [from_name]}
 * @param callback function(error, emails[])
 */
Mailer.prototype.sendEmail = function(template, data, email, callback) {
  var mailer = this;
  loadTemplateAndCompile(template, data, function(err, html) {
    if (err) {
      return callback(err);
    }
    var message = {
      to: email.to,
      from_email: (email.from && email.from.email) || email_config.system_email.email,
      from_name: (email.from && email.from.name) || email_config.system_email.name,
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
  var filePath = path.resolve('src/server/mailer/templates', './' + templateName + '.hbs');
  fs.readFile(filePath, { encoding: 'utf-8' }, callback);
}

function loadTemplateAndCompile(templateName, data, callback) {
  _loadTemplate(templateName, function(err, hbs) {
    if (err)
      return callback(err);

    callback(null, _compile(hbs, data));
  });
}

module.exports = Mailer;