import log from '../../fixtures/log'
import makeDb, { clearDb } from '../../fixtures/db'
import makeFakeUser from '../../fixtures/user'

import Id from '../../../src/Id'
import makeUsersDb from '../../../src/data-access/users-db'
import makeUser from '../../../src/entities/user'

describe('users db', () => {
  let usersDb

  beforeEach(async () => {
    await makeDb()
    await clearDb()
    usersDb = makeUsersDb({ makeDb, Id })
  })

  it('should find user by id', async () => {
    try {

      const user = makeFakeUser()
      const inserted = await usersDb.insert(user)
      expect(inserted).toBeTruthy()

      const found = await usersDb.findById({ id: inserted.id })
      expect(found).toBeTruthy()
      expect(found.id).toBe(inserted.id)

    } catch (e) {
      log.test(e)
      fail('It is not supposed to throw any error')
    }
  })

  it('should not find user by id', async () => {
    try {

      const user = makeFakeUser()
      const inserted = await usersDb.insert(user)
      expect(inserted).toBeTruthy()

      const found = await usersDb.findById({ id: '321654987' })
      expect(found).toBeFalsy()

    } catch (e) {
      log.test(e)
      fail('It is not supposed to throw any error')
    }
  })

  it('should find user by email', async () => {
    try {

      const user = makeFakeUser()
      const inserted = await usersDb.insert(user)
      expect(inserted).toBeTruthy()

      const found = await usersDb.findByEmail({ email: user.email })
      expect(found).toBeTruthy()
      expect(found.id).toBe(user.id)

    } catch (e) {
      log.test(e)
      fail('It is not supposed to throw any error')
    }
  })

  it('should find all users', async () => {
    try {

      const user = makeFakeUser()
      const inserted = await usersDb.insert(user)
      expect(inserted).toBeTruthy()

      const user1 = makeFakeUser()
      const inserted1 = await usersDb.insert(user1)
      expect(inserted1).toBeTruthy()

      const found = await usersDb.findAll()
      expect(found).toBeTruthy()
      expect(found.length).toBeGreaterThan(1)
      expect(found.filter(u => u._id === user.id).length).toBe(1)
      expect(found.filter(u => u._id === user1.id).length).toBe(1)

    } catch (e) {
      log.test(e)
      fail('It is not supposed to throw any error')
    }
  })

  it('should not to find user by email', async () => {
    try {

      const user = makeFakeUser()
      const inserted = await usersDb.insert(user);
      expect(inserted).toBeTruthy()

      const found = await usersDb.findByEmail({ email: 'abc@domain.com' })
      expect(found).toBeFalsy()

    } catch (e) {
      log.test(e)
      fail('It is not supposed to throw any error')
    }
  })

  it('should update user', async () => {
    try {
      
      // insert a user in the db
      const user = makeFakeUser()
      const modifiedOn = user.modifiedOn;
      const inserted = await usersDb.insert(user)
      expect(inserted).toBeTruthy()

      // make sure the user is in the db
      const found = await usersDb.findById({ id: inserted.id })
      expect(found).toBeTruthy()
      expect(found.blockedOn).toBeFalsy()

      // perform a change and update the user
      found.blockedOn = Date.now()
      const updated = await usersDb.update(found)
      expect(updated).toBeTruthy()

      // find the record for checking
      const check = await usersDb.findById({ id: user.id })
      const checkUser = makeUser(check)
      expect(checkUser.getBlockedOn()).toBeTruthy()
      expect(checkUser.getModifiedOn()).not.toBe(modifiedOn)

    } catch (e) {
      log.test(e)
      fail('It is not supposed to throw any error')
    }
  })
})

