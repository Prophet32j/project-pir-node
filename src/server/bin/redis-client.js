var redis = require('redis');
var config = require('./../config/config')

module.exports = function() {
  var client;
  if (process.env.REDISTOGO_URL) {
    var rtg = require('url').parse(process.env.REDISTOGO_URL);
    client = redis.createClient(rtg.port, rtg.hostname);
    client.auth(rtg.auth.split(':')[1]);
  } else {
    var rtg = require('url').parse(config.redistogo.url);
    client = redis.createClient(rtg.port, rtg.hostname);
    client.auth(rtg.auth.split(':')[1]);
  }
  return client;
}