export default function buildMakeToken ({ Id, jwt }) {
  return function makeToken ({
    id = Id.makeId(),
    accessToken,
    user,
    exp,
    type
  }) {
    if (!Id.isValidId(id)) {
      throw new Error('Token must have an id.')
    }
    
    if(!user) {
      throw new Error('Token must be linked to a user.')
    }

    accessToken = accessToken || jwt.generate({ user, exp })
    
    return Object.freeze({
      getId: () => id,
      getAccessToken: () => accessToken.trim(),
      getUserId: () => user.id || user.getId(), 
      getType: () => type || 'LOGIN', 
    })
  }
}
