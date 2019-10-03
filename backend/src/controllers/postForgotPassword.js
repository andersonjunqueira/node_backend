import BadRequestError from '../errors/BadRequestError'

export default function makePostForgotPassword({ forgotPassword, log }) {
  return async function postForgotPassword(httpRequest) {
    try {
      const { email } = httpRequest.body
      if(!email) {
        throw new BadRequestError('e-mail is mandatory.')
      }

      await forgotPassword(email)

      return {
        headers: {
          'Content-Type': 'application/json'
        },
        statusCode: 200,
        body: { 
          message: 'A message was sent to the informed e-mail with instructions on how to change the password' 
        }
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
 