
export default function buildMakeToken ({ Id, jwt }) {
  return function makeToken ({
    id = Id.makeId(),
    accessToken,
    user,
    exp
  } = {}) {
    if (!Id.isValidId(id)) {
      throw new Error('Token must have an id.')
    }
    if(!user) {
      throw new Error('Token must be linked to a user.')
    }
    if (!accessToken) {
      accessToken = jwt.generate({ user, exp })
    }
    
    return Object.freeze({
      getId: () => id,
      getAccessToken: () => accessToken,
      getUserId: () => user.id || user.getId(), 
    })
  }
}
