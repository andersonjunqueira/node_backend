import UnauthorizedError from '../errors/UnauthorizedError'

export default function makeIsAuthorized({ checkToken, tokenType, log }) {
  return async function isAuthorized(req, res, next) {

    try {
      let authenticationHeader = req.headers['Authentication'] || req.headers['authentication']
      if(!authenticationHeader) {
        throw new UnauthorizedError('Authentication header not present.')
      }
      authenticationHeader = authenticationHeader.replace('Bearer ', '')
      const userInfo = await checkToken(authenticationHeader, tokenType)
      req.user = userInfo
      return next()

    } catch(e) {
      res.status(e.statusCode)
        .send({ ...log.createLogObject(e) })
    }
  }
}
