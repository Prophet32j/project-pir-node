var config = require('./../config/config.json');
var mandrill = require('mandrill-api/mandrill');
var client = new mandrill.Mandrill(config.mandrill_api_key);

/*
 * sends a single email to the recipient identified
 * @param recipient struct{email,name} to send to
 * @param subject of the email
 * @param body of the email in html format
 * @param callback function(error, status)
 */
exports.sendEmail = function(recipient, subject, body, callback) {
  var message = {
    to: [{
      email: recipient.email/*,
      name: recipient.name*/
    }],
    html: body,
    subject: subject,
    from_email: 'josh.hardy.ufen@gmail.com',
    from_name: 'Partners In Reading'
  };

  client.messages.send({ 'message': message, 'async': true }, function(emails) {
    if (!emails.length)
      return;

    var email = emails[0];
    console.log(email);
    return callback(null, email.status);
  }, function(err) {
    if (err) 
      return callback(err);  
  });
}

exports.sendBulkEmail = function(messages, callback) {

}