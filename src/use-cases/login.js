const makeUser = require('../entities/user');
const makeToken = require('../entities/token');
const UnauthorizedError = require('../errors/UnauthorizedError');

module.exports = ({ usersDb, tokensDb, md5, moment, log }) => {
  return async (email, password) => {

    log.info(`[Login] Starting login for ${email}`);

    // LOCATE USER
    const userInfo = await usersDb.findByEmail({ email });
    if (!userInfo) {
      log.error(`No user not found in the database for ${email}`);
      throw new UnauthorizedError('Invalid e-mail/password.');
    }

    // CHECKING PASSWORD
    const user = makeUser(userInfo);
    const hashedPassword = md5(password);

    // PASSWORD IS OK, BUT USER IS BLOCKED
    if (hashedPassword === user.getPassword() && !!user.getBlockedOn()) {
      log.info(`The user ${email} is blocked`);

      // SAVE LOGIN STATS
      await usersDb.update({
        id: user.getId(),
        fullName: user.getFullName(),
        email: user.getEmail(),
        password: user.getPassword(),
        blockedOn: user.getBlockedOn(),
        createdOn: user.getCreatedOn(),
        lastSuccessfullLoginOn: user.getLastSuccessfullLoginOn(),
        
        // login retries +1, last failed attempt
        loginRetries: user.getLoginRetries() + 1,
        modifiedOn: moment().toISOString(),
        lastFailedLoginAttemptOn: moment().toISOString()
      });

      throw new UnauthorizedError('This user is blocked.');

    // PASSWORD IS OK
    } if (hashedPassword === user.getPassword()) {

      // CREATE TOKEN 1H EXPIRATION
      const exp = moment.utc(Date.now()).add(1, 'hours').valueOf();
      const token = makeToken({ user, exp });

      log.info(`[Login] Token ${token.getAccessToken()} generated for ${user.getEmail()}`);
      await tokensDb.insert({
        id: token.getId(),
        userId: token.getUserId(),
        accessToken: token.getAccessToken(),
        type: token.getType(),
        exp: moment(exp).toISOString(),
      });

      // SAVE USER
      log.info(`[Login] Updating success login for ${user.getEmail()}`);
      await usersDb.update({
        id: user.getId(),
        fullName: user.getFullName(),
        email: user.getEmail(),
        password: user.getPassword(),
        blockedOn: user.getBlockedOn(),
        createdOn: user.getCreatedOn(),
        lastFailedLoginAttemptOn: user.getLastFailedLoginAttemptOn(),
        
        // set lastlogin = now, modifiedon = now, loginretries = 0, lastfailedlogin = undefined
        modifiedOn: moment().toISOString(),
        lastSuccessfullLoginOn: moment().toISOString(),
        loginRetries: 0,
      });

      return token;

    // PASSWORD IS NOT OK
    } else {
      log.info(`[Login] Updating failed login attempt for ${user.getEmail()}`);
      
      const attempts = user.getLoginRetries() + 1;
      
      // SAVE USER STATS
      await usersDb.update({
        id: user.getId(),
        fullName: user.getFullName(),
        email: user.getEmail(),
        password: user.getPassword(),
        lastSuccessfullLoginOn: user.getLastSuccessfullLoginOn(),
        createdOn: user.getCreatedOn(),
        
        // set modifiedon = now, loginretries = +1, lastfailedlogin = now
        blockedOn: attempts < 3 ? user.getBlockedOn() : moment().toISOString(),
        modifiedOn: moment().toISOString(),
        lastFailedLoginAttemptOn: moment().toISOString(),
        loginRetries: attempts
      });

      const retriesLimit = process.env.ENV_LOGIN_ATTEMPTS_BLOCK || 0;
      if(retriesLimit > 0) {
        if (attempts < 3) {
          
          // return login + pass don't match + message more 3 - login attempts
          log.info(`[Login] ${user.getLoginRetries() + 1} failed login attempts for ${user.getEmail()}`);
          throw new UnauthorizedError(`Invalid e-mail/password. You have ${3 - user.getLoginRetries() - 1} attenpts before the user is blocked.`);
          
        // IF 3RD FAILED LOGIN
        } else {

          // return user blocked
          log.info(`[Login] 3 failed login attempts, user ${user.getEmail()} is now blocked`);
          throw new UnauthorizedError('This user is blocked.');

        }
      } else {
        throw new UnauthorizedError(`Invalid e-mail/password.`);
      }
    }
  };
};