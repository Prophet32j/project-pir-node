var config = require('./../config/config.json');
var mandrill = require('mandrill-api/mandrill');
var client = new mandrill.Mandrill(config.mandrill_api_key);
var Handlebars = require('handlebars');
var fs = require('fs');
var path = require('path');

/*
 * sends a single email to a recipient
 * @param to[] struct{email, name}
 * @param from struct{email, name}
 * @param subject of the email
 * @param html of the email
 * @param callback function(error, emails[])
 */
exports.sendEmail = function(to, from, subject, html, callback) {
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

/*
 * compiles raw handlebars and data into usable html
 * @param source to compile
 * @param data to insert
 * @return html
 */
exports.compileHbs = function(source, data) {
  var template = Handlebars.compile(source);
  var html = template(data);

  return html;
}

exports.getTemplate = function(templateName, callback) {
  var filePath = path.resolve('mailer/templates', './' + templateName);
  fs.readFile(filePath, { encoding: 'utf-8' }, callback);
}