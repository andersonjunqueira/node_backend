import BadRequestError from '../errors/BadRequestError'

export default function makePostLogin({ login, log }) {
  return async function postLogin(httpRequest) {
    try {
      
      const { email, password } = httpRequest.body
      if(!email || !password) {
        throw new BadRequestError('e-mail and password are mandatory.')
      }

      const tokenInfo = await login(email, password)

      return {
        headers: {
          'Content-Type': 'application/json',
        },
        statusCode: 200,
        body: { accessToken: tokenInfo.getAccessToken() }
      }

    } catch (e) {
      log.error({ error: e })

      return {
        headers: {
          'Content-Type': 'application/json'
        },
        statusCode: e.statusCode,
        body: log.createLogObject(e)
      }
    }
  }
}
 