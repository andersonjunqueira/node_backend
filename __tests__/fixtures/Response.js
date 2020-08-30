class Response {

  contructor() {
    this.headers = {};
    this.statusCode = undefined;
    this.bodyType = undefined;
    this.body = undefined;
  }

  status(code) {
    if(!code) {
      return this.statusCode;
    } else {
      this.statusCode = code;
      return this;
    }
  }

  set(headers) {
    if(!headers) {
      return this.headers;
    } else {
      this.headers = headers;
      return this;
    }
  }

  type(bodyType) {
    if(!bodyType) {
      return this.bodyType;
    } else {
      this.bodyType = bodyType;
      return this;
    }
  }

  error() {
    return this.err;
  }

  getBody() {
    return this.body;
  }

  send(body) {
    this.body = body;
  }
}

module.exports = Response;
