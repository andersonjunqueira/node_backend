import moment from 'moment'

import makeDb, { clearDb } from '../../fixtures/db'
import log from '../../fixtures/log'
import makeFakeUser from '../../fixtures/user'

import makeUsersDb from '../../../src/data-access/users-db'
import makeTokensDb from '../../../src/data-access/tokens-db'
import makeFindUser from '../../../src/use-cases/findUser'
import makeLogin from '../../../src/use-cases/login'
import makeCreateAccount from '../../../src/use-cases/createAccount'
import md5 from '../../../src/md5'

describe('login use case', () => {
  let usersDb
  let tokensDb
  let login
  let createAccount
  let findUser

  beforeEach(async () => {
    await makeDb()
    await clearDb()
    usersDb = makeUsersDb({ makeDb })
    tokensDb = makeTokensDb({ makeDb })
    login = makeLogin({ usersDb, tokensDb, md5, log, moment })
    createAccount = makeCreateAccount({ usersDb, md5, log })
    findUser = makeFindUser({ usersDb, log })
  })    

  it('should not login without email and password', async () => {
    try {
      
      await login()
      fail('It is not supposed to get to this point')

    } catch(e) {
      expect(e.message).toBe('e-mail and password are mandatory.')
    }
  })

  it('should not login without email', async () => {
    try {

      await login(undefined, 'abc123')
      fail('It is not supposed to get to this point')

    } catch(e) {
      expect(e.message).toBe('e-mail and password are mandatory.')
    }
  })

  it('should not login without password', async () => {
    try {

      await login('user@domain.com')
      fail('It is not supposed to get to this point')

    } catch(e) {
      expect(e.message).toBe('e-mail and password are mandatory.')
    }
  })

  it('should not login with a wrong email', async () => {
    try {
      
      await login('user@domain.com', 'abc123')
      fail('It is not supposed to get to this point')

    } catch(e) {
      expect(e.message).toBe('Invalid e-mail/password.')
    }
  })

  it('should not login with a wrong password', async () => {
    try {
      
      const user = makeFakeUser()
      await createAccount({ fullName: user.fullName, email: user.email, password: user.password })
      
      await login(user.email, 'abc123')
      fail('It is not supposed to get to this point')

    } catch(e) {
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

    } catch(e) {
      log.test({ msg: e})
      fail('It is not supposed to throw any error')
    }
  })

  it('should block a user if login is wrong 3x', async () => {
    const user = makeFakeUser()
    const acc = await createAccount({ fullName: user.fullName, email: user.email, password: user.password })
    
    try { 
      await login(user.email, 'abc123')
    } catch(e) {
      expect(e.message).toBe('Invalid e-mail/password. You have 2 attenpts before the user is blocked.')
    }

    try { 
      await login(user.email, 'abc123')
    } catch(e) {
      expect(e.message).toBe('Invalid e-mail/password. You have 1 attenpts before the user is blocked.')
    }

    try { 
      await login(user.email, 'abc123')
    } catch(e) {
      expect(e.message).toBe('This user is blocked.')
    }

    const found = await findUser({ id: acc.id })
    
    expect(found).toBeTruthy()
    expect(found.email).toBe(acc.email)
    expect(found.blockedOn).toBeTruthy()
  })

})
