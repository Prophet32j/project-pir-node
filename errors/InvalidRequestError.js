function InvalidRequestError(code, error) {
  Error.call(this, error.message);
  Error.captureStackTrace(this, this.constructor);
  this.name = "InvalidRequestError";
  this.message = error.message;
  this.code = code;
  this.status = 400;
  this.inner = error;
}

InvalidRequestError.prototype = Object.create(Error.prototype);
InvalidRequestError.prototype.constructor = InvalidRequestError;

module.exports = InvalidRequestError;