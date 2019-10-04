import makeUser from '../entities/user'
import NotFoundError from '../errors/NotFoundError'

export default function makeChangePassword({ usersDb, moment, emailSender, md5, log }) {
  return async function changePassword({ user, newpassword }) {

    const userInfo = makeUser({ ...user, password: md5(newpassword) })

    log.debug({ msg: `Updating the user with new password.`})
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
}
