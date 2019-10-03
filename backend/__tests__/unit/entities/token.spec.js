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

  it('should not create a token with wrong type', () => {
    try {
      makeToken({ user: { id: 1 }, type: 'NOTYPE' })
      fail('It is not supposed to get here')
    } catch(e) {
      expect(e.message).toBe('Invalid token type.')
    }
  })

  it('should create LOGIN token', () => {
    try {
      const token = makeToken({ user: { id: 1 } })
      expect(token.getId()).toBeTruthy()
      expect(token.getUserId()).toBeTruthy()
      expect(token.getType()).toBe('LOGIN')
    } catch(e) {
      fail('It is not supposed to throw any error')
    }
  })

  it('should create PASSWORD token', () => {
    try {
      const token = makeToken({ user: { id: 1 }, type: 'PASSWORD' })
      expect(token.getId()).toBeTruthy()
      expect(token.getUserId()).toBeTruthy()
      expect(token.getType()).toBe('PASSWORD')
    } catch(e) {
      fail('It is not supposed to throw any error')
    }
  })

  it('should create CHANGEPASS token', () => {
    try {
      const token = makeToken({ user: { id: 1 }, type: 'CHANGEPASS' })
      expect(token.getId()).toBeTruthy()
      expect(token.getUserId()).toBeTruthy()
      expect(token.getType()).toBe('CHANGEPASS')
    } catch(e) {
      fail('It is not supposed to throw any error')
    }
  })

})
