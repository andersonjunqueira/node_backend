import makeUser from '../entities/user'

export default function makeCreateAccount({ usersDb, md5, log }) {
  return async function createAccount({ fullName, email, password }) {

    log.debug({ msg: `Creating Account for ${email}`})
    if(!fullName || !email || !password) {
      log.error({ error: `Full name, e-mail or password not provided`})
      throw new Error('Full name, e-mail and password are mandatory.')
    }

    log.debug({ msg: `Searching for a user with the same e-mail: ${email}`})
    const userInfo = await usersDb.findByEmail({ email })
    if(userInfo) {
      log.error({ error: `Email already in use`})
      throw new Error('E-mail already registered.')
    }
    
    const user = makeUser({ fullName, email, password: md5(password) })

    log.debug({ msg: `Adding the user with ${email} to the database.`})
    const insertedUser = await usersDb.insert({
      id: user.getId(),
      fullName: user.getFullName(),
      email: user.getEmail(),
      password: user.getPassword(),
      modifiedOn: user.getModifiedOn(),
      createdOn: user.getCreatedOn(),
      loginRetries: 0,
      lastSuccessfullLoginOn: undefined,
      lastFailedLoginAttemptOn: undefined,
      blockedOn: undefined
    })

    return insertedUser
  }
}
