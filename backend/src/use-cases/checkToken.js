export default function makeCheckToken({ usersDb, tokensDb, jwt, moment, log }) {
  return async function checkToken(accessToken) {

    if(!accessToken) {
      throw new Error('Invalid token.')
    }

    let decoded
    try {
      decoded = jwt.decode(accessToken)
    } catch (e) {
      if(e.message === 'jwt malformed') {
        throw new Error(`Invalid token.`)
      }
    }

    log.debug({ msg: `Querying for the accessToken ${accessToken}`})
    const token = await tokensDb.findByAccessToken(accessToken)
    if(!token) {
      throw new Error('Token not found.')
    }

    if(moment().isAfter(moment.utc(decoded.exp))) {
      throw new Error('Expired token found.')
    }

    log.debug({ msg: `Querying for the token's associated user`})
    const user = await usersDb.findById({ id: token.userId })
    if(!user) {
      throw new Error(`Token's user not found.`)
    }

    if(!!user.blockedOn) {
      throw new Error(`Token's user is blocked.`)
    }

  }
}
