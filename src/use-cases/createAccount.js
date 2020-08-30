const makeUser = require('../entities/user');
const BadRequestError = require('../errors/BadRequestError');

module.exports = ({ usersDb, passwd, md5, log }) => {
  const createAccount = async ({ fullName, email, password }) => {

    log.info(`[createAccount] Creating Account for ${email}`); 
    log.info(`[createAccount] Checking password rules`); 
    const broken = passwd.checkRules(password);
    if(broken.length != 0) {
      throw new BadRequestError(broken);
    }

    log.info(`[createAccount] Searching for user with the same e-mail: ${email}`); 
    const userInfo = await usersDb.findByEmail({ email });
    if(userInfo) {
      throw new BadRequestError('E-mail already registered.');
    }
    
    const user = makeUser({ fullName, email, password: md5(password) });

    log.info(`[createAccount] Adding user with ${email}`); 
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
    });

    return insertedUser;
  }

  return createAccount;
};
