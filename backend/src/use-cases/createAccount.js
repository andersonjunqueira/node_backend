import makeUser from '../entities/user'
import BadRequestError from '../errors/BadRequestError'

const makeCreateAccount = ({ usersDb, passwd, md5, log }) => {
  const createAccount = async ({ fullName, email, password }) => {

    log.debug({ msg: `Creating Account for ${email}`})

    const broken = passwd.checkRules(password)
    if(broken.length != 0) {
      throw new BadRequestError(broken)
    }

    log.debug({ msg: `Searching for a user with the same e-mail: ${email}`})
    const userInfo = await usersDb.findByEmail({ email })
    if(userInfo) {
      throw new BadRequestError('E-mail already registered.')
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
  return createAccount
}
export default makeCreateAccount
