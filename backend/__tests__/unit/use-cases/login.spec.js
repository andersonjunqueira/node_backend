import moment from 'moment'

import makeDb, { clearDb } from '../../fixtures/db'
import log from '../../fixtures/log'
import makeFakeUser from '../../fixtures/user'

import makeUsersDb from '../../../src/data-access/users-db'
import makeTokensDb from '../../../src/data-access/tokens-db'
import makeFindUserById from '../../../src/use-cases/findUserById'
import makeLogin from '../../../src/use-cases/login'
import makeCreateAccount from '../../../src/use-cases/createAccount'
import md5 from '../../../src/md5'

describe('login use case', () => {
  let usersDb
  let tokensDb
  let login
  let createAccount
  let findUserById

  beforeEach(async () => {
    await makeDb()
    await clearDb()
    usersDb = makeUsersDb({ makeDb })
    tokensDb = makeTokensDb({ makeDb })
    login = makeLogin({ usersDb, tokensDb, md5, moment, log })
    createAccount = makeCreateAccount({ usersDb, md5, log })
    findUserById = makeFindUserById({ usersDb, log })
  })

  it('should not login with a wrong email', async () => {
    try {

      await login('user@domain.com', 'abc123')
      fail('It is not supposed to get to this point')

    } catch (e) {
      expect(e.message).toBe('Invalid e-mail/password.')
    }
  })

  it('should not login with a wrong password', async () => {
    try {

      const user = makeFakeUser()
      await createAccount({ fullName: user.fullName, email: user.email, password: user.password })

      await login(user.email, 'abc123')
      fail('It is not supposed to get to this point')

    } catch (e) {
      expect(e.message).toBe('Invalid e-mail/password. You have 2 attenpts before the user is blocked.')
    }
  })

  it('should successfully login', async () => {

    const userInfo = makeFakeUser({ password: 'abc123' })
    const user = await createAccount({ fullName: userInfo.fullName, email: userInfo.email, password: userInfo.password })

    try {

      const token = await login(user.email, 'abc123')
      expect(token.getUserId()).toBe(user.id)
      expect(token.getAccessToken()).toBeTruthy()

    } catch (e) {
      log.test({ msg: e })
      fail('It is not supposed to throw any error')
    }
  })

  it('should block a user if login is wrong 3x', async () => {
    const user = makeFakeUser()
    const acc = await createAccount({ fullName: user.fullName, email: user.email, password: user.password })

    try {
      await login(user.email, 'abc123')
    } catch (e) {
      expect(e.message).toBe('Invalid e-mail/password. You have 2 attenpts before the user is blocked.')
    }

    try {
      await login(user.email, 'abc123')
    } catch (e) {
      expect(e.message).toBe('Invalid e-mail/password. You have 1 attenpts before the user is blocked.')
    }

    try {
      await login(user.email, 'abc123')
    } catch (e) {
      expect(e.message).toBe('This user is blocked.')
    }

    const found = await findUserById(acc.id)

    expect(found).toBeTruthy()
    expect(found.email).toBe(acc.email)
    expect(found.blockedOn).toBeTruthy()
  })

  it('should not login a blocked user with correct password', async () => {
    const user = makeFakeUser()
    const acc = await createAccount({ fullName: user.fullName, email: user.email, password: user.password })

    try {
      await login(user.email, 'abc123')
      fail('It is not supposed to get to this point')
    } catch (e) {
      expect(e.message).toBe('Invalid e-mail/password. You have 2 attenpts before the user is blocked.')
    }

    try {
      await login(user.email, 'abc123')
      fail('It is not supposed to get to this point')
    } catch (e) {
      expect(e.message).toBe('Invalid e-mail/password. You have 1 attenpts before the user is blocked.')
    }

    try {
      await login(user.email, 'abc123')
      fail('It is not supposed to get to this point')
    } catch (e) {
      expect(e.message).toBe('This user is blocked.')
    }

    try {
      await login(user.email, user.password)
      fail('It is not supposed to get to this point')
    } catch (e) {
      expect(e.message).toBe('This user is blocked.')
    }
  })

})
