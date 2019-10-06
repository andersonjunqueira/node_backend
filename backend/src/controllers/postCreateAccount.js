import BadRequestError from '../errors/BadRequestError'

const makePostCreateAccount = ({ createAccount, log }) => {
  const postCreateAccount = async (httpRequest) => {
    try {
      const { fullName, email, password } = httpRequest.body
      if (!fullName || !email || !password) {
        throw new BadRequestError('Full name, e-mail and password are mandatory.')
      }

      const insertedUser = await createAccount({ fullName, email, password })
      delete insertedUser.password

      let location = httpRequest.requestURL
      location = `${location.substr(0, location.indexOf(httpRequest.path))}${process.env.MD_API_ROOT}/users/${insertedUser.id}`

      return {
        headers: {
          'Content-Type': 'application/json',
          'Location': location
        },
        statusCode: 201,
        body: { ...insertedUser }
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
  return postCreateAccount
}
export default makePostCreateAccount