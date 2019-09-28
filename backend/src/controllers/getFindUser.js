export default function makeGetFindUser({ findUser, log }) {
  return async function getFindUser(httpRequest) {
    try {
      
      log.debug({ msg: httpRequest })
      const { id } = httpRequest.params
      if(!id) {
        throw new Error('User id is mandatory')
      }

      const user = await findUser({ id })
      delete user.password

      return {
        headers: {
          'Content-Type': 'application/json',
          'Location': 'abc'
        },
        statusCode: 200,
        body: { ...user }
      }

    } catch (e) {
      log.error({ error: e })

      return {
        headers: {
          'Content-Type': 'application/json'
        },
        statusCode: 400,
        body: {
          error: e.message
        }
      }
    }
  }
}
 