import moment from 'moment'

import makeDb, { clearDb } from '../../fixtures/db'
import log from '../../fixtures/log'
import makeFakeUser from '../../fixtures/user'

import makeUsersDb from '../../../src/data-access/users-db'
import makeTokensDb from '../../../src/data-access/tokens-db'
import makeCheckToken from '../../../src/use-cases/checkToken'
import makeToken from '../../../src/entities/token'
import Id from '../../../src/Id'
import jwt from '../../../src/jwt'

describe('check token use case', () => {
  let usersDb
  let tokensDb
  let checkToken

  beforeEach(async () => {
    await makeDb()
    await clearDb()
    usersDb = makeUsersDb({ makeDb, Id })
    tokensDb = makeTokensDb({ makeDb, Id })
    checkToken = makeCheckToken({ usersDb, tokensDb, jwt, moment, log })
  })

  it('should fail to check an undefined token', async () => {
    try {
      
      await checkToken(undefined)
      fail('It is not supposed to get to this point')

    } catch(e) {
      expect(e.message).toBe('Invalid token.')
    }
  })

  it('should fail to check an empty token', async () => {
    try {
      
      await checkToken('')
      fail('It is not supposed to get to this point')

    } catch(e) {
      expect(e.message).toBe('Invalid token.')
    }
  })

  it('should reject a malformed token', async () => {
    try {
      
      await checkToken('123654987')
      fail('It is not supposed to get to this point')

    } catch(e) {
      expect(e.message).toBe('Invalid token.')
    }
  })

  it('should not validate an expired token', async () => {
    try {
      
      const userInfo = makeFakeUser()
      const user = await usersDb.insert(userInfo)
      delete user.password

      const exp = moment.utc(Date.now()).subtract(1, 'hours').valueOf()
      const tokenInfo = makeToken({ user, exp })
      const token = await tokensDb.insert({
        id: tokenInfo.getId(),
        userId: tokenInfo.getUserId(),
        accessToken: tokenInfo.getAccessToken()
      })

      await checkToken(token.accessToken)
      fail('It is not supposed to get to this point')

    } catch(e) {
      expect(e.message).toBe('Expired token found.')
    }
  })

  it('should not validate with an invalid user', async () => {
    try {
      
      const tokenInfo = makeToken({ user: { id: 321654987 }})
      const token = await tokensDb.insert({
        id: tokenInfo.getId(),
        userId: tokenInfo.getUserId(),
        accessToken: tokenInfo.getAccessToken()
      })
      await checkToken(token.accessToken)
      fail('It is not supposed to get to this point')

    } catch(e) {
      expect(e.message).toBe(`Token's user not found.`)
    }
  })

  it('should validate the token successfully', async () => {
    try {
      
      const userInfo = makeFakeUser()
      const user = await usersDb.insert(userInfo)
  
      const tokenInfo = makeToken({ user })
      const token = await tokensDb.insert({
        id: tokenInfo.getId(),
        userId: tokenInfo.getUserId(),
        accessToken: tokenInfo.getAccessToken()
      })
      await checkToken(token.accessToken)

    } catch(e) {
      log.test({ msg: e })
      fail('It is not supposed to get to this point')
    }
  })

})