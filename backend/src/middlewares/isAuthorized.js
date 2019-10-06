import UnauthorizedError from '../errors/UnauthorizedError'

const makeIsAuthorized = ({ checkToken, tokenType, log }) => {
  const isAuthorized = async (req, res, next) => {

    try {
      let authenticationHeader = req.headers['Authorization'] || req.headers['authorization']
      if(!authenticationHeader) {
        throw new UnauthorizedError('Authorization header not present.')
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
  return isAuthorized
}
export default makeIsAuthorized
