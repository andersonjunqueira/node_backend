import makeToken from '../entities/token'
import NotFoundError from '../errors/NotFoundError'

export default function makeForgotPassword({ usersDb, tokensDb, emailSender, log }) {
  return async function forgotPassword(email) {

    // look for user with email
    const userInfo = await usersDb.findByEmail({ email })
    if(!userInfo) {
      throw new NotFoundError('e-mail not found on the database.')
    } 
    
    // create a change password token
    const token = makeToken({ user: userInfo, type: 'PASSWORD' })

    await tokensDb.insert({
      id: token.getId(),
      userId: token.getUserId(),
      accessToken: token.getAccessToken(),
      type: token.getType()
    })

    // send email with url to change password
    await emailSender.sendForgotPassword(userInfo.email, userInfo.fullName, token.getAccessToken())

  }
}
