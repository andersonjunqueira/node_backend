import log from '../../fixtures/log'
import makeFakeUser from '../../fixtures/user'
import makeDb, { clearDb } from '../../fixtures/db'
import passwd from '../../fixtures/passwd'

import makeUsersDb from '../../../src/data-access/users-db'
import makePostCreateAccount from '../../../src/controllers/postCreateAccount'
import makeCreateAccount from '../../../src/use-cases/createAccount'
import md5 from '../../../src/md5'

describe('post create account', () => {
  let usersDb
  let postCreateAccount
  let createAccount
  
  beforeEach(async () => {
    await makeDb()
    await clearDb()
    usersDb = makeUsersDb({ makeDb })
    createAccount = makeCreateAccount({ usersDb, passwd, md5, log })
    postCreateAccount = makePostCreateAccount({ createAccount, log })
  })

  it('should not create account without full name', async () => {
    try {

      const request = {
        headers: {
          'Content-Type': 'application/json',
        },
        path: '/api/v0/register',
        requestURL: `http://localhost:3000/api/v0/register`,
        body: { email: 'user@domain.com', password: 'abc123' }
      }

      const response = await postCreateAccount(request)
      expect(response.statusCode).toBe(400)

    } catch (e) {
      log.test({ msg: e })
      fail('It is not supposed to throw any error')
    }
  })

  it('should not create account without email', async () => {
    try {

      const request = {
        headers: {
          'Content-Type': 'application/json',
        },
        path: '/api/v0/register',
        requestURL: `http://localhost:3000/api/v0/register`,
        body: { fullName: 'Any Name', password: 'abc123' }
      }

      const response = await postCreateAccount(request)
      expect(response.statusCode).toBe(400)

    } catch (e) {
      log.test({ msg: e })
      fail('It is not supposed to throw any error')
    }
  })

  it('should not create account without password', async () => {
    try {

      const request = {
        headers: {
          'Content-Type': 'application/json',
        },
        path: '/api/v0/register',
        requestURL: `http://localhost:3000/api/v0/register`,
        body: { fullName: 'Any Name', email: 'user@domain.com' }
      }

      const response = await postCreateAccount(request)
      expect(response.statusCode).toBe(400)

    } catch (e) {
      log.test({ msg: e })
      fail('It is not supposed to throw any error')
    }
  })

  it('should create new user account', async () => {
    try {

      const user = makeFakeUser()
      const request = {
        headers: {
          'Content-Type': 'application/json',
        },
        path: '/api/v0/register',
        requestURL: `http://localhost:3000/api/v0/register`,
        body: { fullName: user.fullName, email: user.email, password: user.password }
      }

      const response = await postCreateAccount(request)
      expect(response.statusCode).toBe(201)
      expect(response.headers.Location).toBe(`http://localhost:3000/api/users/${response.body.id}`)

    } catch (e) {
      log.test({ msg: e })
      fail('It is not supposed to throw any error')
    }
  })

  it('should not create a duplicated account', async () => {
    try {

      const user = makeFakeUser()
      const request = {
        headers: {
          'Content-Type': 'application/json',
        },
        path: '/api/v0/register',
        requestURL: `http://localhost:3000/api/v0/register`,
        body: { fullName: user.fullName, email: user.email, password: user.password }
      }

      const response1 = await postCreateAccount(request)
      expect(response1.statusCode).toBe(201)
      expect(response1.headers.Location).toBeTruthy()

      const response2 = await postCreateAccount(request)
      expect(response2.statusCode).toBe(400)
      expect(response2.body.error.message).toBe('E-mail already registered.')

    } catch (e) {
      log.test({ msg: e })
      fail('It is not supposed to throw any error')
    }
  })
})