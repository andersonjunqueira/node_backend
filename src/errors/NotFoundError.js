module.exports = class NotFoundError extends Error {
  constructor(...args) {
    super(...args);
    Error.captureStackTrace(this, NotFoundError);
    this.statusCode = 404;
  }
};