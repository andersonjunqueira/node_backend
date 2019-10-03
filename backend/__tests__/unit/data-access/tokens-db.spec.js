import log from '../../fixtures/log'
import makeDb, { clearDb } from '../../fixtures/db'

import makeTokensDb from '../../../src/data-access/tokens-db'
import makeToken from '../../../src/entities/token'

describe('tokens db', () => {
  let tokensDb

  beforeEach(async () => {
    await makeDb()
    await clearDb()
    tokensDb = makeTokensDb({ makeDb })
  })

  it('should find by accessToken', async () => {
    try {

      // create and insert token in the DB
      const token = makeToken({ user: { id: 123 } })
      const inserted = await tokensDb.insert({
        id: token.getId(),
        userId: token.getUserId(),
        accessToken: token.getAccessToken()
      })
      expect(inserted).toBeTruthy()

      // call find method
      const found = await tokensDb.findByAccessToken(token.getAccessToken())
      expect(found).toBeTruthy()
      expect(found.accessToken).toBe(token.getAccessToken())

    } catch (e) {
      log.test(e)
      fail('It is not supposed to throw any error')
    }

  })

  it('should not find the accessToken', async () => {
    try {

      // create and insert token in the DB
      const token = makeToken({ user: { id: 123 } })
      const inserted = await tokensDb.insert({
        id: token.getId(),
        userId: token.getUserId(),
        accessToken: token.getAccessToken()
      })
      expect(inserted).toBeTruthy()

      // call the find method
      const found = await tokensDb.findByAccessToken('abc123456')
      expect(found).toBeFalsy()

    } catch (e) {
      log.test(e)
      fail(`It is not supposed to throw any error`)
    }
  })

  it('should delete an access token', async () => {
    try {

      // create and insert token in the DB
      const token = makeToken({ user: { id: 123 } })
      const inserted = await tokensDb.insert({
        id: token.getId(),
        userId: token.getUserId(),
        accessToken: token.getAccessToken()
      })
      expect(inserted).toBeTruthy()

      const affected = await tokensDb.remove({ id: inserted.id })
      expect(affected).toBe(1)

    } catch (e) {
      log.test(e)
      fail(`It is not supposed to throw any error`)
    }
  })

})
