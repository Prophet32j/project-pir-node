var redis = require('redis');

module.exports = function() {
  var client;
  if (process.env.REDISTOGO_URL) {
    var rtg = require('url').parse(process.env.REDISTOGO_URL);
    client = redis.createClient(rtg.port, rtg.hostname);
    client.auth(rtg.auth.split(':')[1]);
  } else {
    client = redis.createClient();
  }
  return client;
}