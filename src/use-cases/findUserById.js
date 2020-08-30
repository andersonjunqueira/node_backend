const makeUser = require('../entities/user');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');

module.exports = ({ usersDb, log }) => {
  return async (id) => {

    if(typeof id === 'undefined' || !id) {
      throw new BadRequestError('User id is mandatory.');
    }
    
    log.debug({ msg: `Getting user ${id}`});
    log.debug({ msg: `Searching for a user for the id: ${id}`});
    const userInfo = await usersDb.findById({ id });
    if(!userInfo) {
      throw new NotFoundError('User not found.');
    }
    
    const user = makeUser({ ...userInfo });
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
    };
  };
};