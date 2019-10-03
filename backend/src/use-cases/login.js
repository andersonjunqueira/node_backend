import makeUser from '../entities/user'
import makeToken from '../entities/token'
import UnauthorizedError from '../errors/UnauthorizedError'
import BadRequestError from '../errors/BadRequestError'

export default function makeLogin({ usersDb, tokensDb, md5, moment, log }) {
  return async function login(email, password) {

    log.info({ msg: `Starting login for ${email}`})
    
    // find user
    const userInfo = await usersDb.findByEmail({ email })
    if(!userInfo) {
      log.error({ error: `User not found in the database for ${email}`})
      throw new UnauthorizedError('Invalid e-mail/password.')
    }
    
    const user = makeUser(userInfo)

    // check user password
    const hashedPassword = md5(password)

    // if pass ok, but user is blocked
    if(hashedPassword === user.getPassword() && !!user.getBlockedOn())  {

      // saving unsuccessfull login attempt
      await usersDb.update({
        id: user.getId(), 
        fullName: user.getFullName(),
        email: user.getEmail(),
        password: user.getPassword(),
        blockedOn: user.getBlockedOn(),
        createdOn: user.getCreatedOn(),
        lastSuccessfullLoginOn: user.getLastSuccessfullLoginOn(),
        loginRetries: user.getLoginRetries(),
        
        modifiedOn: moment().toISOString(),
        lastFailedLoginAttemptOn: moment().toISOString()
      })

      // throw error
      log.error({ error: `The user ${email} is blocked`})
      throw new UnauthorizedError('This user is blocked.')

    // if pass ok
    } if(hashedPassword === user.getPassword())  {

      // set lastlogin = now, modifiedon = now, loginretries = 0, lastfailedlogin = undefined
      // save user
      log.info({ msg: `Updating success login for ${user.getEmail()}`})
      await usersDb.update({
        id: user.getId(), 
        fullName: user.getFullName(),
        email: user.getEmail(),
        password: user.getPassword(),
        blockedOn: user.getBlockedOn(),
        createdOn: user.getCreatedOn(),
        lastFailedLoginAttemptOn: user.getLastFailedLoginAttemptOn(),
        
        modifiedOn: moment().toISOString(),
        lastSuccessfullLoginOn: moment().toISOString(),
        loginRetries: 0,
      })

      // generate and add token
      const token = makeToken({ user })
      log.info({ msg: `Token ${token.getAccessToken()} generated for ${user.getEmail()}`})

      await tokensDb.insert({
        id: token.getId(),
        userId: token.getUserId(),
        accessToken: token.getAccessToken(),
        type: token.getType()
      })
      
      // token + token expiration datetime
      return token

    // pass is not ok
    } else {

      // set modifiedon = now, loginretries = +1, lastfailedlogin = now
      // save user  
      log.info({ msg: `Updating failed login attempt for ${user.getEmail()}`})

      const attempts = user.getLoginRetries() + 1

      await usersDb.update({
        id: user.getId(),
        fullName: user.getFullName(),
        email: user.getEmail(),
        password: user.getPassword(),
        lastSuccessfullLoginOn: user.getLastSuccessfullLoginOn(),
        createdOn: user.getCreatedOn(),
        
        blockedOn: attempts < 3 ? user.getBlockedOn() : moment().toISOString(),
        modifiedOn: moment().toISOString(),
        lastFailedLoginAttemptOn: moment().toISOString(),
        loginRetries: attempts
      })

      // if login attempts != 0
      if(attempts < 3) {
        // return login + pass don't match + message more 3 - login attempts
        log.info({ msg: `${user.getLoginRetries() + 1} failed login attempts for ${user.getEmail()}`})
        throw new UnauthorizedError(`Invalid e-mail/password. You have ${3 - user.getLoginRetries() -1} attenpts before the user is blocked.`)
      } else {
        // return user blocked
        log.info({ msg: `3 failed login attempts, user ${user.getEmail()} is now blocked`})
        throw new UnauthorizedError('This user is blocked.')
      }
      
    }
  }
}