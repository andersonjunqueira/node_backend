export default function makeGetFindUserById({ findUserById, log }) {
  return async function getFindUserById(httpRequest) {
    try {
      
      log.debug({ msg: httpRequest })
      const { id } = httpRequest.params

      const user = await findUserById(id)
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
        statusCode: e.statusCode,
        body: log.createLogObject(e)
      }
    }
  }
}
 