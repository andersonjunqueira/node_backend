import BadRequestError from '../../errors/BadRequestError'

const buildMakeToken = ({ Id, jwt }) => {
  const makeToken = ({
    id = Id.makeId(),
    accessToken,
    user,
    exp,
    type
  }) => {
    if (!Id.isValidId(id)) {
      throw new BadRequestError('Token must have an id.')
    }
    
    if(!user) {
      throw new BadRequestError('Token must be linked to a user.')
    }

    if(type && type !== 'LOGIN' && type !== 'PASSWORD') {
      throw new BadRequestError('Invalid token type.')
    }

    accessToken = accessToken || jwt.generate({ user, exp })
    
    return Object.freeze({
      getId: () => id,
      getAccessToken: () => accessToken.trim(),
      getUserId: () => user.id || user.getId(), 
      getType: () => type || 'LOGIN', 
    })
  }
  return makeToken
}
export default buildMakeToken