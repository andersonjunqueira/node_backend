import makeUser from '../entities/user'
import BadRequestError from '../errors/BadRequestError'

const makeChangePassword = ({ usersDb, emailSender, passwd, moment, md5, log }) => {
  const changePassword = async ({ user, newpassword }) => {

    const broken = passwd.checkRules(newpassword)
    if (broken.length != 0) {
      throw new BadRequestError(broken)
    }

    const userInfo = makeUser({ ...user, password: md5(newpassword) })

    log.debug({ msg: `Updating the user with new password.` })
    const updatedUser = await usersDb.update({
      id: userInfo.getId(),
      password: userInfo.getPassword(),
      modifiedOn: moment().toISOString(),
      loginRetries: 0,
      blockedOn: undefined
    })

    // send email with url to change password
    await emailSender.sendChangePassword(user.email, user.fullName)

  }
  return changePassword
}
export default makeChangePassword
