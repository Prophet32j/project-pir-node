function NotActivatedError(code, error) {
  Error.call(this, error.message);
  Error.captureStackTrace(this, this.constructor);
  this.name = "NotActivatedError";
  this.message = error.message;
  this.code = code;
  this.status = 401;
  this.inner = error;
}

NotActivatedError.prototype = Object.create(Error.prototype);
NotActivatedError.prototype.constructor = NotActivatedError;

module.exports = NotActivatedError;