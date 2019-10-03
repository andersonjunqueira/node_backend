import log from '../../fixtures/log'
import makeDb, { clearDb } from '../../fixtures/db'
import makeFakeUser from '../../fixtures/user'
import makeEmailTransporter from '../../fixtures/emailTransporter'

import makeUsersDb from '../../../src/data-access/users-db'
import makeTokensDb from '../../../src/data-access/tokens-db'
import makeEmailSender from '../../../src/email/emailSender'
import makeForgotPassword from '../../../src/use-cases/forgotPassword'
import makeCreateAccount from '../../../src/use-cases/createAccount'
import md5 from '../../../src/md5'

describe('forgot password use case', () => {
  let usersDb
  let tokensDb
  let transporter
  let emailSender
  let forgotPassword
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
    tokensDb = makeTokensDb({ makeDb })
    transporter = makeEmailTransporter({ nodemailer })
    emailSender = makeEmailSender({ transporter, log })
    forgotPassword = makeForgotPassword({ usersDb, tokensDb, emailSender, log })
    createAccount = makeCreateAccount({ usersDb, md5, log })
  })

  it('should send the forgot password recovery email', async () => {
    try {

      const userInfo = makeFakeUser()
      const inserted = await createAccount({ fullName: userInfo.fullName, email: userInfo.email, password: userInfo.password })
      expect(inserted).toBeTruthy()

      await forgotPassword(inserted.email)
      expect(sendMail).toHaveBeenCalledTimes(1)
      
    } catch (e) {
      fail('It is not supposed to throw any error')
    }
  })

  it('should not find the user', async () => {
    try {

      await forgotPassword('wont@tell.com')
      fail('It is not supposed to throw any error')
      
    } catch (e) {
      expect(e.message).toBe('e-mail not found on the database.')
    }
  })

})