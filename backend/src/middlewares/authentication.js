import UnauthorizedError from '../errors/UnauthorizedError'

export default function makeIsAuthenticated({ checkToken, log }) {
  return async function isAuthenticated(req, res, next) {

    try {
      let authenticationHeader = req.headers['Authentication'] || req.headers['authentication']
      if(!authenticationHeader) {
        throw new UnauthorizedError('Authentication header not present.')
      }
      authenticationHeader = authenticationHeader.replace('Bearer ', '')
      await checkToken(authenticationHeader, 'LOGIN')
      return next()

    } catch(e) {
      res.status(e.statusCode)
        .send({ ...log.createLogObject(e) })
    }
  }
}
