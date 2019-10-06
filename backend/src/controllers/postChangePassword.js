import BadRequestError from '../errors/BadRequestError'

const makePostChangePassword = ({ changePassword, log }) => {
  const postChangePassword = async httpRequest => {
    try {
      const { newpassword } = httpRequest.body
      if (!newpassword) {
        throw new BadRequestError('New password is mandatory.')
      }

      await changePassword({ user: httpRequest.user, newpassword })

      return {
        headers: {
          'Content-Type': 'application/json'
        },
        statusCode: 200,
        body: {
          message: 'Your password has been changed successfully'
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
  return postChangePassword
}

export default makePostChangePassword