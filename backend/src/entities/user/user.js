import BadRequestError from '../../errors/BadRequestError'

export default function buildMakeUser ({ Id, md5, sanitize, validateEmail, moment }) {
  return function makeUser ({
    id = Id.makeId(),
    fullName,
    email,
    password,
    loginRetries,
    lastSuccessfullLoginOn,
    lastFailedLoginAttemptOn,
    blockedOn,
    createdOn,
    modifiedOn = moment().toISOString()
  }) {
    if (!Id.isValidId(id)) {
      throw new BadRequestError('User must have an id.')
    }
    if (!validateEmail(email)) {
      throw new BadRequestError('User must have a valid e-mail.')
    }
    if (!password) {
      throw new BadRequestError('User password must have a password.')
    }
    
    let fullNameSanitized = sanitize(fullName)
    let hash

    return Object.freeze({
      getId: () => id,
      getCreatedOn: () => createdOn || moment().toISOString(),
      getModifiedOn: () => modifiedOn,
      getHash: () => hash || (hash = makeHash()),
      getFullName: () => fullNameSanitized,
      getEmail: () => email,
      getPassword: () => password,
      getLoginRetries: () => loginRetries || 0,
      getLastSuccessfullLoginOn: () => lastSuccessfullLoginOn,
      getLastFailedLoginAttemptOn: () => lastFailedLoginAttemptOn,
      getBlockedOn: () => blockedOn,
      block: () => {
        blockedOn = moment().toISOString()
      },
      unblock: () => {
        blockedOn = undefined
      }
    })

    function makeHash () {
      return md5(email)
    }
  }
}

