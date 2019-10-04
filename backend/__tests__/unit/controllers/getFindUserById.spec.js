import log from '../../fixtures/log'
import makeDb, { clearDb } from '../../fixtures/db'
import makeFakeUser from '../../fixtures/user'
import passwd from '../../fixtures/passwd'

import makeUsersDb from '../../../src/data-access/users-db'
import makeFindUserById from '../../../src/use-cases/findUserById'
import makeGetFindUserById from '../../../src/controllers/getFindUserById'
import makeCreateAccount from '../../../src/use-cases/createAccount'
import md5 from '../../../src/md5'

describe('get find user', () => {
  let usersDb
  let findUserById
  let getFindUserById
  let createAccount

  beforeEach(async () => {
    await makeDb()
    await clearDb()
    usersDb = makeUsersDb({ makeDb })
    findUserById = makeFindUserById({ usersDb, log })
    getFindUserById = makeGetFindUserById({ findUserById, log })
    createAccount = makeCreateAccount({ usersDb, passwd, md5, log })
  })

  it('should not find the user', async () => {
    try {

      const request = {
        headers: {
          'Content-Type': 'application/json',
        },
        path: '/api/v0/users/123456',
        requestURL: `http://localhost:3000/api/v0/users/123456`,
        params: { id: '123456' }
      }
  
      const response = await getFindUserById(request)
      expect(response).toBeTruthy()
      expect(response.statusCode).toBe(404)

    } catch(e) {
      log.test({ msg: e })
      fail('It is not supposed to throw any error')
    }

  })

  it('should find a user', async () => {
    try {

      const user = makeFakeUser()
      const insertedUser = await createAccount({ fullName: user.fullName, email: user.email, password: user.password })
      expect(insertedUser).toBeTruthy()
      expect(insertedUser.id).toBeTruthy()

      const request = {
        headers: {
          'Content-Type': 'application/json',
        },
        path:`/api/v0/users/${insertedUser.id}`,
        requestURL: `http://localhost:3000/api/v0/users/${insertedUser.id}`,
        params: { 
          id: insertedUser.id 
        }
      }

      const response = await getFindUserById(request)
      expect(response).toBeTruthy()
      expect(response.statusCode).toBe(200)

    } catch(e) {
      log.test({ msg: e })
      fail('It is not supposed to throw any error')
    }
  })
})
