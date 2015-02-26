var _ = require('lodash');

/*
 * sets default keys on data from User schema.
 * Strips out any keys not specified in User schema
 * @param data to be sanitized
 * @return sanitized data
 */
exports.sanitize = function(data, schema) {
  return _.pick(_.defaults(data, schema), _.keys(schema));
}