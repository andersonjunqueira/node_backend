module.exports = class InternalServerError extends Error {
  constructor(...args) {
    super(...args);
    Error.captureStackTrace(this, InternalServerError);
    this.statusCode = 500;
  }
};