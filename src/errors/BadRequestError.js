module.exports = class BadRequestError extends Error {
  constructor(...args) {
    super(...args);
    Error.captureStackTrace(this, BadRequestError);
    this.statusCode = 400;
  }
};