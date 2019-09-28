export default function makeIsAuthenticated({ checkToken, log }) {
  return async function isAuthenticated(req, res, next) {

    try {
      let authenticationHeader = req.headers['Authentication'] || req.headers['authentication']
      if(!authenticationHeader) {
        throw new Error('Authentication header not present.')
      }
      authenticationHeader = authenticationHeader.replace('Bearer ', '')
      await checkToken(authenticationHeader)
      return next()

    } catch(e) {
      res
        .status(403)
        .send({ error: e.message  })
    }
  }
}
