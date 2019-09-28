import makeUser from '../entities/user'

export default function makeFindUser({ usersDb, log }) {
  return async function findUser({ id }) {

    log.debug({ msg: `Getting user ${id}`})
    if(!id) {
      log.error({ error: `User id not provided`})
      throw new Error('User id is mandatory.')
    }

    log.debug({ msg: `Searching for a user for the id: ${id}`})
    const userInfo = await usersDb.findById({ id })
    if(!userInfo) {
      log.error({ error: `User not found`})
      throw new Error('User not found.')
    }
    
    const user = makeUser({ ...userInfo })
    return {
      id: user.getId(), 
      fullName: user.getFullName(),
      email: user.getEmail(),
      blockedOn: user.getBlockedOn(),
      createdOn: user.getCreatedOn(),
      lastFailedLoginAttemptOn: user.getLastFailedLoginAttemptOn(),
      modifiedOn: user.getModifiedOn(),
      lastSuccessfullLoginOn: user.getLastFailedLoginAttemptOn(),
      loginRetries: user.getLoginRetries()
    }
  }
}
