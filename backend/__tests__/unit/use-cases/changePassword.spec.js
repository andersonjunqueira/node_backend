import moment from 'moment'

import log from '../../fixtures/log'
import makeDb, { clearDb } from '../../fixtures/db'
import makeFakeUser from '../../fixtures/user'
import makeEmailTransporter from '../../fixtures/emailTransporter'
import passwd from '../../fixtures/passwd'

import makeUsersDb from '../../../src/data-access/users-db'
import makeEmailSender from '../../../src/email/emailSender'
import makeChangePassword from '../../../src/use-cases/changePassword'
import makeCreateAccount from '../../../src/use-cases/createAccount'
import md5 from '../../../src/md5'

describe('change password use case', () => {
  let usersDb
  let transporter
  let emailSender
  let changePassword
  let createAccount
  const sendMail = jest.fn()
  let nodemailer = {
    createTransport: () => {
      return {
        sendMail
      }
    }
  }
 
  beforeEach(async () => {
    await makeDb()
    await clearDb()
    usersDb = makeUsersDb({ makeDb })
    transporter = makeEmailTransporter({ nodemailer })
    emailSender = makeEmailSender({ transporter, log })
    createAccount = makeCreateAccount({ usersDb, passwd, md5, log })
    changePassword = makeChangePassword({ usersDb, emailSender, passwd, moment, md5, log })
  })

  it('should change the password', async () => {
    try {

      const userInfo = makeFakeUser()
      const inserted = await createAccount({ fullName: userInfo.fullName, email: userInfo.email, password: userInfo.password })
      expect(inserted).toBeTruthy()

      await changePassword({ user: inserted, newpassword: 'abc123' })
      expect(sendMail).toHaveBeenCalledTimes(1)
      
    } catch (e) {
      console.log(e)
      log.error({ msg: e })
      fail('It is not supposed to throw any error')
    }
  })

  it('should not change the password for the rules', async () => {
    try {

      const userInfo = makeFakeUser()
      const inserted = await createAccount({ fullName: userInfo.fullName, email: userInfo.email, password: userInfo.password })
      expect(inserted).toBeTruthy()

      await changePassword({ user: inserted, newpassword: 'ab' })
      fail('It is not supposed to get to this point')
      
    } catch (e) {
      expect(e.message).toBe('Password must contain at least 3 characters.')
    }
  })


})