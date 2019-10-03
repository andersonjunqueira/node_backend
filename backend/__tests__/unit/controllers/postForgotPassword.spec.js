import log from '../../fixtures/log'
import makeDb, { clearDb } from '../../fixtures/db'
import makeFakeUser from '../../fixtures/user'

import makeUsersDb from '../../../src/data-access/users-db'
import makeTokensDb from '../../../src/data-access/tokens-db'
import makeEmailTransporter from '../../fixtures/emailTransporter'
import makeEmailSender from '../../../src/email/emailSender'
import makeForgotPassword from '../../../src/use-cases/forgotPassword'
import makePostForgotPassword from '../../../src/controllers/postForgotPassword'
import makeCreateAccount from '../../../src/use-cases/createAccount'
import md5 from '../../../src/md5'

describe('post forgot password', () => {
  let usersDb
  let tokensDb
  let transporter
  let emailSender
  let forgotPassword
  let createAccount
  let postForgotPassword
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
    postForgotPassword = makePostForgotPassword({ forgotPassword, log })
    createAccount = makeCreateAccount({ usersDb, md5, log })
    jest.clearAllMocks()
  })

  it('should send the forgot password recovery email', async () => {
    try {

      const userInfo = makeFakeUser()
      const inserted = await createAccount({ fullName: userInfo.fullName, email: userInfo.email, password: userInfo.password })
      expect(inserted).toBeTruthy()

      const request = {
        headers: {
          'Content-Type': 'application/json',
        },
        path: '/api/v0/forgot-password',
        requestURL: `http://localhost:3000/api/v0/forgot-password`,
        body: { email: userInfo.email }
      }

      const response = await postForgotPassword(request)
      expect(response.body).toBeTruthy()
      expect(response.statusCode).toBe(200)
      expect(sendMail).toHaveBeenCalledTimes(1)

    } catch (e) {
      log.test({ msg: e })
      fail('It is not supposed to throw any error')
    }
  })

  it('should not find the user', async () => {
    try {

      const request = {
        headers: {
          'Content-Type': 'application/json',
        },
        path: '/api/v0/forgot-password',
        requestURL: `http://localhost:3000/api/v0/forgot-password`,
        body: { email: 'wont@tell.com' }
      }

      const response = await postForgotPassword(request)
      expect(response.body).toBeTruthy()
      expect(response.statusCode).toBe(404)
      expect(sendMail).toHaveBeenCalledTimes(0)

    } catch (e) {
      log.test({ msg: e })
      fail('It is not supposed to throw any error')
    }
  })

  it('should require email', async () => {
    try {

      const request = {
        headers: {
          'Content-Type': 'application/json',
        },
        path: '/api/v0/forgot-password',
        requestURL: `http://localhost:3000/api/v0/forgot-password`,
        body: { }
      }

      const response = await postForgotPassword(request)
      expect(response.body).toBeTruthy()
      expect(response.statusCode).toBe(400)
      expect(sendMail).toHaveBeenCalledTimes(0)

    } catch (e) {
      log.test({ msg: e })
      fail('It is not supposed to throw any error')
    }
  })
})
