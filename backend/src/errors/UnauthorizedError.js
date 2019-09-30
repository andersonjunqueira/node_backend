export default class UnauthorizedError extends Error {

  constructor(...args) {
    super(...args);
    Error.captureStackTrace(this, UnauthorizedError)
    this.statusCode = 401
  }

}