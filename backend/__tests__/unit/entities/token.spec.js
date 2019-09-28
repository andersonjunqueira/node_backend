import log from '../../fixtures/log'

import makeToken from '../../../src/entities/token'

describe('token', () => {

  it('must have id', () => {
    try {
      makeToken({ id: '', user: { id: 1 } })
      fail('It is not supposed to get here')
    } catch(e) {
      expect(e.message).toBe('Token must have an id.')
    }
  })

  it('must have a user', () => {
    try {
      makeToken({ user: undefined })
      fail('It is not supposed to get here')
    } catch(e) {
      expect(e.message).toBe('Token must be linked to a user.')
    }
  })

  it('should be created from user', () => {
    try {
      const token = makeToken({ user: { id: 1 }})
      expect(token.getId()).toBeTruthy()
      expect(token.getUserId()).toBeTruthy()
    } catch(e) {
      log.test({ msg: e })
      fail('It is not supposed to throw any error')
    }
  })
})
