export default class Response {
  
  status(code) {
    if(!code) {
      return this.statusCode
    } else {
      this.statusCode = code
      return this
    }
  }

  error() {
    return this.err
  }

  send({ error }) {
    this.err = error
  }

}