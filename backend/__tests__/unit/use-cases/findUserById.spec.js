import log from '../../fixtures/log'
import makeDb, { clearDb } from '../../fixtures/db'
import makeFakeUser from '../../fixtures/user'
import passwd from '../../fixtures/passwd'

import md5 from '../../../src/md5'
import makeUsersDb from '../../../src/data-access/users-db'
import makeCreateAccount from '../../../src/use-cases/createAccount';
import makeFindUserById from '../../../src/use-cases//findUserById'

describe('find user use case', () => {
  let usersDb
  let findUserById
  let createAccount

  beforeEach(async () => {
    await makeDb()
    await clearDb()
    usersDb = makeUsersDb({ makeDb })
    findUserById = makeFindUserById({ usersDb, log })
    createAccount = makeCreateAccount({ usersDb, passwd, md5, log })
  })

  it('should not find the user with no id', async () => {
    try {

      await findUserById()
      fail('It is not supposed to get to this point')

    } catch (e) {
      expect(e.message).toBe('User id is mandatory.')
    }
  })

  it('should not find the user', async () => {
    try {
      const fakeUser = makeFakeUser()
      await createAccount({ fullName: fakeUser.fullName, email: fakeUser.email, password: fakeUser.password })

      await findUserById('123456')
      fail('It is not supposed to get to this point')

    } catch (e) {
      expect(e.message).toBe('User not found.')
    }
  })


  it('should find a user, password not returned', async () => {
    try {
      const fakeUser = makeFakeUser()
      const inserted = await createAccount({ fullName: fakeUser.fullName, email: fakeUser.email, password: fakeUser.password })

      const found = await findUserById(inserted.id)
      expect(found).toBeTruthy()
      expect(found.email).toBe(inserted.email)
      expect(found.fullName).toBe(inserted.fullName)
      expect(found.password).toBeFalsy()
      
    } catch (e) {
      log.test(e)
      fail('It is not supposed to throw any error')
    }
  })

})