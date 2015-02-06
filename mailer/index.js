var config = require('./../config/config.json');
var mandrill = require('mandrill-api/mandrill');
var client = new mandrill.Mandrill(config.mandrill_api_key);
var Handlebars = require('handlebars');
var fs = require('fs');
var path = require('path');
var email_config = require('./config.json');

var Mailer = function() { }

/*
 * compiles raw handlebars and data into usable html
 * @param source to compile
 * @param data to insert
 * @return html
 */
Mailer.prototype.compile = function(source, data) {
  var template = Handlebars.compile(source);
  var html = template(data);

  return html;
}

Mailer.prototype.loadTemplate = function(templateName, callback) {
  var filePath = path.resolve('mailer/templates', './' + templateName + '.hbs');
  fs.readFile(filePath, { encoding: 'utf-8' }, callback);
}

Mailer.prototype.loadTemplateSync = function(templateName) {
  var filePath = path.resolve('mailer/templates', './' + templateName);
  return fs.readFileSync(filePath, { encoding: 'utf-8' });
}

Mailer.prototype.loadTemplateAndCompile = function(templateName, data, callback) {
  this.loadTemplate(templateName, function(err, hbs) {
    if (err)
      return callback(err);

    callback(null, this.compile(hbs, data));
  });
}

/*
 * sends a single email to a recipient
 * @param to[] struct{email, name}
 * @param from struct{email, name}
 * @param subject of the email
 * @param html of the email
 * @param callback function(error, emails[])
 */
Mailer.prototype.sendEmail = function(to, from, subject, html, callback) {
  if (!from) {
    from = email_config.system_email;
  }
  var message = {
    to: to,
    html: html,
    subject: subject,
    from_email: from.email,
    from_name: from.name
  };

  client.messages.send({ 'message': message, 'async': true }, function(emails) {
    return callback(null, emails);
  },
  function(err) {
    return callback(err);  
  });
}

module.exports = Mailer;