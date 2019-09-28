import makeDb, { clearDb } from '../../fixtures/db'
import makeFakeUser from '../../fixtures/user'
import log from '../../fixtures/log'

import makeCreateAccount from '../../../src/use-cases/createAccount'
import makeUsersDb from '../../../src/data-access/users-db'
import md5 from '../../../src/md5'

describe('create account use case', () => {
  let usersDb
  let createAccount

  beforeEach(async () => {
    await makeDb()
    await clearDb()
    usersDb = makeUsersDb({ makeDb })
    createAccount = makeCreateAccount({ usersDb, md5, log })
  })

  it('should not create account without full name', async () => {
    try {

      await createAccount({ email: 'user@domain.com', password: 'password' })
      fail('It is not supposed to get to this point')

    } catch (e) {
      expect(e.message).toBe('Full name, e-mail and password are mandatory.')
    }
  })

  it('should not create account without email', async () => {
    try {

      await createAccount({ fullName: 'Any Name', password: 'password' })
      fail('It is not supposed to get to this point')

    } catch (e) {
      expect(e.message).toBe('Full name, e-mail and password are mandatory.')
    }
  })

  it('should not create account without password', async () => {
    try {

      await createAccount({ fullName: 'Any Name', email: 'user@domain.com' })
      fail('It is not supposed to get to this point')

    } catch (e) {
      expect(e.message).toBe('Full name, e-mail and password are mandatory.')
    }
  })

    it('should create new user account', async () => {
      try {

        const user = makeFakeUser()
        const inserted = await createAccount({ fullName: user.fullName, email: user.email, password: user.password })
        expect(inserted).toBeTruthy()
        expect(inserted.email).toBe(user.email)
        expect(inserted.fullName).toBe(user.fullName)
  
      } catch (e) {
        log.test(e)
        fail('It is not supposed to throw any error')
      }
    })

    it('should not create a duplicated account', async () => {
      try {

        const user = makeFakeUser()
        const inserted = await createAccount({ fullName: user.fullName, email: user.email, password: user.password })
        expect(inserted).toBeTruthy()
        expect(inserted.email).toBe(user.email)

        await createAccount({ fullName: user.fullName, email: user.email, password: user.password })
        fail('It is not supposed to get to this point')
  
      } catch (e) {
        expect(e.message).toBe('E-mail already registered.')
      }
    })
})
