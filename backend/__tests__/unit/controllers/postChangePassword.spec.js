import moment from 'moment'

import log from '../../fixtures/log'
import makeDb, { clearDb } from '../../fixtures/db'
import makeFakeUser from '../../fixtures/user'

import makeToken from '../../../src/entities/token'
import makeUsersDb from '../../../src/data-access/users-db'
import makeTokensDb from '../../../src/data-access/tokens-db'
import makeEmailTransporter from '../../fixtures/emailTransporter'
import makeEmailSender from '../../../src/email/emailSender'
import makeChangePassword from '../../../src/use-cases/changePassword'
import makePostChangePassword from '../../../src/controllers/postChangePassword'
import makeCreateAccount from '../../../src/use-cases/createAccount'
import md5 from '../../../src/md5'

describe('post change password', () => {
  let usersDb
  let tokensDb
  let transporter
  let emailSender
  let changePassword
  let createAccount
  let postChangePassword
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
    changePassword = makeChangePassword({ usersDb, moment, emailSender, md5, log })
    postChangePassword = makePostChangePassword({ changePassword, log })
    createAccount = makeCreateAccount({ usersDb, md5, log })
    jest.clearAllMocks()
  })

  it('should change the password', async () => {
    try {

      const userInfo = makeFakeUser()
      const inserted = await createAccount({ fullName: userInfo.fullName, email: userInfo.email, password: userInfo.password })
      expect(inserted).toBeTruthy()

      const tokenInfo = makeToken({ user: inserted, type: 'PASSWORD' })
      const token = await tokensDb.insert({
        id: tokenInfo.getId(),
        userId: tokenInfo.getUserId(),
        accessToken: tokenInfo.getAccessToken(),
        type: tokenInfo.getType()
      })

      const request = {
        headers: {
          'Content-Type': 'application/json',
          'Authentication': `Bearer ${tokenInfo.getAccessToken()}`
        },
        path: '/api/v0/change-password',
        requestURL: `http://localhost:3000/api/v0/change-password`,
        user: inserted,
        body: { newpassword: 'abc123' }
      }

      
      const response = await postChangePassword(request)
      expect(response.body).toBeTruthy()
      expect(response.statusCode).toBe(200)
      expect(sendMail).toHaveBeenCalledTimes(1)

    } catch (e) {
      log.test({ msg: e })
      fail('It is not supposed to throw any error')
    }
  })

  it('should not change the password without a new password', async () => {
    try {

      const userInfo = makeFakeUser()
      const inserted = await createAccount({ fullName: userInfo.fullName, email: userInfo.email, password: userInfo.password })
      expect(inserted).toBeTruthy()

      const tokenInfo = makeToken({ user: inserted, type: 'PASSWORD' })
      const token = await tokensDb.insert({
        id: tokenInfo.getId(),
        userId: tokenInfo.getUserId(),
        accessToken: tokenInfo.getAccessToken(),
        type: tokenInfo.getType()
      })

      const request = {
        headers: {
          'Content-Type': 'application/json',
          'Authentication': `Bearer ${tokenInfo.getAccessToken()}`
        },
        path: '/api/v0/change-password',
        requestURL: `http://localhost:3000/api/v0/change-password`,
        user: inserted,
        body: { }
      }

      
      const response = await postChangePassword(request)
      expect(response.body).toBeTruthy()
      expect(response.statusCode).toBe(400)
      expect(sendMail).toHaveBeenCalledTimes(0)

    } catch (e) {
      log.test({ msg: e })
      fail('It is not supposed to throw any error')
    }
  })
})
